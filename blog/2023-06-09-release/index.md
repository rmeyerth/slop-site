---
slug: release150
title: SLOP 1.50 Release
authors: [tronied]
tags: [slop]
---
I’m excited to announce the most significant update so far. It includes many new features that enhance both the language and toolkit. I apologize 
yet again for not updating the documentation, but I promise to work on it as soon as possible. In the meantime, you can use this announcement as 
a reference for the new features.

## Grammar Changes
### Type Restrictions
The gammar system uses several keywords to represent tokens. This change relates to the 'val' keyword as it can now support a type to be specified 
to limit what it can be used for. As an example, let's look at the newly renamed InvocationToken, once called the OperationToken. This has the 
following pattern and we can see that the first capture token now has an added type:
```
val:String '(' ( expr ','? )+ ')'
```
This makes a lot of sense as these restrictions are necessary to ensure the code is defined as expected. For example, up until now you could have
had an IfToken defined as the name with the brackets and parameters aferwards! Although no doubt that would have been caught and rejected at the 
parser stage, we do need to ensure language structure and rules can be enforced if desired. As such, in this scenario we can restrict the name of 
whatever it is we're calling to a a simple String.

### Grammar References
Up until now, if you wanted to define a token pattern you had to be fairly explicit in its structure. This mean't that everything within your 
intended syntax had to be explicitly declared. Let's look a Java for loop as an example where this would be a problem:
```java
for (int i = 0;i < 10;i++) {
    println("Loop " + i);
}
```
So far so easy, with our traditional approach we can define the following:
```
'for' '(' ( expr ';' expr ';' expr ) ')' '{' ( expr ';' )+ '}'
```
Ok, fine but how would you now add single line support like the following:
```java
for (int i = 0;i < 10;i++) println("Loop " + i);
```
You could make the curly braces optional tokens, but this can quickly turn into a mess. Additionally, what happens when we want to add support
for different types of loops? Java supports both for-each and the for loop using the same 'for' keyword and you can't do that using optionals.
This is the problem I originally faced when adding loops which led to me creating separate ForEachToken and RepeatToken's. 

This is where the new grammar references can be used as they provide the option to split the pattern so not only do you not need to declare 
everything within one token, but also the option to support branching patterns. Let's look at the new ForToken which replaces both previous 
versions which are now deprecated:
```
'for' '(' [ fixedLoop, variableLoop ] ')' [ singleLine, multiLine ]
```
Grammar references are defined within a pair of square brackets. You can have one or more references to other tokens based on whether you want a
fixed but deferred responsibility to another token, or a branch. At this stage I also need to introduce the idea of token types. By default all
tokens have a PRIMARY type. However, you can now define SECONDARY tokens which can't be used on their own but are dependant on other tokens.
In the above example, the ForToken is a PRIMARY with both FixedLoopToken and VariableLoopToken's being SECONDARY.

In somewhat of a divergence, the SingleLineToken is a PRIMARY but the MultiLineToken is a SECONDARY. Why is this? Well, as part of normal code 
you could define:
```
myVar = 1 + 1;
```
You would not however do the same with a multi-line brackets unless it belonges to another token. Of course this up to the individual and their
language so this can always be changed. A token can be defined as a SECONDARY by calling the overloaded Token constructor here:
```java
public FixedLoopToken() {
    super("fixedLoop", null, TokenType.SECONDARY);
}
```
By omitting this third parameter it will default to PRIMARY. You'll also notice that the name declared as the first constructor parameter is 
important as that is used as the unique reference in the grammar. Using this approach, we can now define the pattern for that approach:
```java
@Override
public String getPattern() {
    return "expr ';' expr ';' expr";
}
```
One final note about this is the addition of a new interface called TokenCallback. This provides a method with a callback to the parent 
token. Why would we do this? Well, on each iteration of the loop, we would want to call back to the parent token to invoke the body token. This is
achieved through a functional interface and subsequent lambda function. Here is the process function code of the ForToken:
```java
@Override
public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {
    //...
    Token<?> loopToken = getTokenGroups().get(0).getFlatTokens().get(0);
    Token<?> bodyToken = getTokenGroups().get(1).getFlatTokens().get(0);
    return loopToken.processWithCallback(parser, context, config, () -> {
        List<Token<?>> result = bodyToken.processNoParams(parser, context, config);
        if (result.size() == 1 && result.get(0) instanceof ReturnToken) {
            return Optional.of(result.get(0));
        }
        return Optional.empty();
    });
}
```
You'll also notice mention of a ReturnToken. This replaces the existing 'result = ' method used to transport values. This also makes use of a new
feature called Parser Flags, but I'll save explaining that and some of the finer points about the return until later. As one final comment on 
grammar references, migration of existing tokens over to using grammar references has started but is a gradual proccess. As such, whilst some
have been done others do remain untouched. Rest-assured though that upgrades will be made where applicable to all tokens in the future.

## New operators
### Increment / Decrement Equals
This has been a long time coming as providing the ability to add or remove from the value of a variable whilst not having to explicitly retrieve it 
first was absent. I am now happy to reveal that this has now been added and it works with all default types. If you do have your own custom types
and want to provide this functionality then all it takes is to add in an entry into the TypeOperations implementation for that class. For example, 
in the MapOperation class now that we have the following in our supported list of operations:
```java
private Token<?> handleMapOperations(SLOPContext context, OperatorHandler handler, String varName, Map<Token<?>,Token<?>> original,
                                     Map<Token<?>,Token<?>> compare, OperatorToken operator, CustomOperation customOp) {
    final Map<Token<?>, Token<?>> result;
    switch (handler.getOpType(operator)) {
        //..
        case INCREMENT_EQUALS:
            result = new HashMap<>(original);
            result.putAll(compare);
            context.set(varName, result);
            break;
        //...
    }
}
```
We can now run the following code and add to a map:
```
myMap = {};
myMap += {aKey -> aValue};
```
## New tokens
### Return Token
As previously mentioned, the return token replaces the existing 'result = ' method of returning values. This operates in much the same way as other 
languages in that when it is called, all other content is ignored and it instantly returns the value. This makes use of a new feature called Parser
Flags which tell the parser to treat it differently. I won't go into too much detail about those now but will discuss it later in the Toolkit Changes
section. Although the return token is simple in its nature, it does have one optional flag providing a special feature. This is the '&' character
and when defined will allow each result to be collated together into a collection and returned as a whole. This removes the need to maintain a separate
list which you then add elements to and return. An example can be seen here:
```
for (emp : employees) return &emp.name;
```
This will return a list of all employees names, though I would suggest avoiding this for this purpose as you can simply do:
```
employees.name
```
to get the same result. If the '&' were to be omitted, then this would return the first instance of an employee name.
### Range
The range token provides a fast way of creating a list of values between two values. It is used by defining two values separated by '..' and can be 
used in other tokens as it just returns a standard collection. For example, you can now define the following:
```
for(char : A..Z) return & char;
```
This returns a list of all characters (inclusive) between A and Z. You can also use numbers and other characters as it simply iterates between the
two, so be warned you might end up with a big list!
### Elvis
...no, not him. I put this in the token section although traditionally it is called an Elvis operator. During my recent play with functions and
recursion, I noticed it was a pain to keep comparing a value to null using the traditional conditional token. As such, although I've never used it
in anger in another language, I thought it would be nice to add this feature. It simply follows the approach where if a value is null then it uses a 
defined secondary value. An example can be seen here:
```
memMap = {};
func fastFib(n) {
    if (n <= 1) return n;
    /* If the results exist use that, alternatively perform recursive call */
    result = memMap.get(n - 1) ?: fastFib(n - 1) + memMap.get(n - 2) ?: fastFib(n - 2);
    memMap += {n -> result};" +
    return result;
}
return fastFib(47);
```
Firstly, yes that is a comment and another new feature, though not reall noteworthy compared to the rest of this. In the above example we are checking
to see if the current n iteration exists in the memory map. If so, we can skip recursing and just use that value. There is a bit of unnecessary code 
here as regardless of whether it exists in the map or not, we are re-adding it. Still, it is a very performant alternative compared to the traditional
recursive approach. This brings us nicely onto the next section which is...

## Functions
Apologies if you're confused by what I mean by functions as surely haven't we had functions since the beginning? Well, those were what I would refer
to as system and definitely Java written functions. As you have no doubt seen by the above, what I am referring to here are user defined functions
which can be defined and run through the use of the updated InvocationToken. These work much in the same way as most other languages. They define a 
list of parameters which are a requirement to be fulfilled when it is called. The FunctionToken makes use of a new toolkit interface called TokenParameters
which allows parameters to be passed between two tokens directly:
```java
public class FunctionToken extends Token<Void> implements TokenParameters {

    public FunctionToken() {
        super("Function", null);
    }
                                                                           
    //...
                                                                           
    @Override
    public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {
        //Adds itself as a SINGLETON into memory under the function name
    }
       
    @Override
    public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config, List<Token<?>> providedParams) {
        //Evaluates the embedded function tokens to resolve a result
    }
}
```
When the token is first evaluated by the parser, it calls the traditional process method. This simply adds itself into memory as a SINGLETON. This is
a variable type meaning that so long as it's not part of an instance, there is only ever one of them. The other method is called directly by the 
InvocationToken so that parameters can be passed.

Another big challenge was supporting recursion. This is because each time a method is called it needs to maintain its own set of values of the
same parameters and changes to those. The test method for this was the following simple function:
```
func fibonacci(n) {
   return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
result = fibonacci(10);
```
After many hours trawling through stack traces and logs, I finally came out with an approach using multi-layered variable storing. On each recursive
iteration and variable store, a new version is pushed to a stack and removed once the token execution has completed. 

## Types
Having gone through the trials of implementing functions and recursion, I thought I may as well go all in and implement types. This required a bit of
creating thinking as to how this would work. The first stage was to add a new variable type called PROTOTYPE which acts as a blueprint from which
instances can be created.

- Parameters
- Inheritance
- Constructors
Imports
Building / Load from File
Toolkit Changes
- Parser flags
- Variable Types
    - Instances
    - Prototypes
    - Singleton