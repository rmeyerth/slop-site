---
slug: release150
title: SLOP 1.50 Release
authors: [tronied]
tags: [slop]
---
I’m excited to announce the most significant update so far. It includes many new features that enhance both the language and toolkit. I apologise 
yet again for not updating the documentation, but I promise to work on it as soon as possible. In the meantime, you can use this announcement as 
a reference for the new features.

## Grammar Changes
### Type Restrictions
Token grammar patterns presently use the 'val' keyword to define a token to be captured. As the grammar is fairly easy-going in terms of what 
this could represent, this in theory could be anything. This causes issues when we want a token to be of a specific type. Let's use the 
newly renamed InvocationToken, once called the OperationToken as an example. The pattern for this is defined using the following:
```
val '(' ( expr ','? )+ ')'
```
This works, but as mentioned that 'val' could be anything. For example, you could have an IfToken defined as the name with the brackets and 
parameters after! This is where the new ability to specify type restrictions can be used:
```
val:String '(' ( expr ','? )+ ')'
```
To add a type we simply add a ':' and the named type of the value it is expecting. If the token provided does not match then this token will not
get matched or if it's already on the stack during tokenization, it will throw an error. This should allow a lot more control with regards to the
structure of our tokens and error reporting.

### Grammar References
Up until now, if you wanted to define a token you had to be fairly explicit with the pattern structure. Everything had to be declared in full will 
little option for deviation. Let's look the Java for loop as an example where this would be a problem:
```java
for (int i = 0;i < 10;i++) {
    println("Loop " + i);
}
```
So far so easy, with our traditional approach we can define the following:
```
'for' '(' ( expr ';' expr ';' expr ) ')' '{' ( expr ';' )+ '}'
```
Fine, but how would we now add single line support like the following?
```java
for (int i = 0;i < 10;i++) println("Loop " + i);
```
You could make the curly braces optional tokens, but this can quickly turns into a mess. Additionally, what happens when we want to add support
for different types of loops? Java supports both for and for-each loops using the same keyword and you can't do that using optionals. This is the 
problem I originally faced when adding loops which led to me creating separate loop tokens (ForEachToken and RepeatToken). 

This is where the new grammar references can be used as they provide the option to split the pattern so not only do you not need to declare 
everything within one token, but also providing the option to support branching patterns. Let's look at the new ForToken which replaces both previous 
versions (now deprecated):
```
'for' '(' [ fixedLoop, variableLoop ] ')' [ singleLine, multiLine ]
```
Grammar references are defined within a pair of square brackets. You can have one or more references to other tokens based on whether you want a
fixed structure with deferred processing, or a branch. At this stage I also need to introduce the idea of token types. By default, all tokens have 
the default PRIMARY type assigned. However, you can now define tokens to be SECONDARY where they can't be used on their own but are dependent on 
other tokens. In the above example, the ForToken is the PRIMARY with both FixedLoopToken and VariableLoopToken's being SECONDARY.

In somewhat of a divergence, the SingleLineToken is a PRIMARY but the MultiLineToken is a SECONDARY. Why is this? Well, as part of normal code 
you could define:
```
myVar = 1 + 1;
```
You would not however do the same with a multi-line brackets unless it belongs to another token. Of course this up to the individual and their
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
There is also the addition of a new interface called TokenCallback. This provides a method with a callback to the parent token. Why would we do 
this? Well, on each iteration of the loop, we would want to call back to the parent token to invoke the body token. This is achieved through
a functional interface and subsequent lambda function. Here is the process function code of the ForToken:
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
grammar references, migration of existing tokens over to using grammar references has started but is a gradual process. As such, whilst some
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
We can now run the following code:
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
This will return a list of all employees names, though I would suggest using this alternative instead if extracting a field from a collection:
```
employees.name
```
If the '&' were to be omitted, this would return the first instance of an employee name.
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
Firstly, yes that is a comment and another new feature, though not really noteworthy compared to the rest of this. In the above example we are checking
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
creating thinking as to how this would work. The first stage was to add a new variable type called PROTOTYPE so that it can act as a blueprint from which
instances can be created. The biggest issue was how to deal with type properties. Variables could be defined within the class itself, but without creating
lots of handlers and relations, how could they easily be managed? In the end I decided to store a LinkedHashMap as the instance value and that would store 
each field value. In this first iteration, these would be defined either through definition in the type declaration or as part of a constructor.

I still plan on managing instance declared variables at the top-level to this map, but this will require further work of capturing those set events which 
I deemed outside the scope of this first trial implementation. As such, the format I came up with for defining a type uses the following:
```
type MyType(a,b,c) {
   /* ... */
}
```
### Parameters / Variables
These parameters work in the same way as a Java record where the type has 3 fields (a, b and c). These values can be accessed from within the instance 
and its children as well as from the outside using the FieldToken. For example, for the following:
```
type MyType(a,b,c) {
   /* ... */
}

test = new MyType(1,2,3);
return test.a + test.b + test.c;
```
This would return the result 6. Likewise, doing the following:
```
type MyType(a,b,c) {
   function aTest() {
      return a + b + c;
   }
}

test = new MyType(1,2,3);
return test.aTest();
```
Would return the same result.

**NOTE:** Any variables declared within an instance are added to global storage currently. Only those declared within the type paramters and 
constructors are added locally. This will be fixed as a priority.
### Inheritance
The current model for inheritance only supports extending the functionality and properties of another type. Parents can be defined by using the '<-' 
notation after the name and optional parameters. For example:
```
type ParentType(d);

type ChildType(a,b,c,d) <- ParentType;

test = new ChildType(1,2,3,4);
return test.a + test.d;
```
This looks a bit strange as neither the ParentType nor ChildType's have bodies. This is actually optional, but still allows properties
to be referenced, used and changed. In the above case we see that we have the ParentType which has a property of 'd'. However, by
defining that property we also make it a required field which must be set. This is why we also declare 'd' in the ChildType declaration.
If we don't declare that and just do ``type ChildType(a,b,c) <- ParentType;``, we get the following error:
```
'MyType' has a dependency on 'ParentType' which requires parameter(s) 'd' to be 
defined in the class definition or constructor. Please add this to the MyType 
type definition.
```
Functions and resources can be defined in the parent and used within the child class. There is no notion of modifiers yet, so everything is public
at this early stage.
### Constructors
Constructors work in the same way as the type parameters, but offer different sets of fields. When a class inherits from a type it will
try and match the parameters against one of these. If no match was found then an error will be thrown. Constructors are defined by using 
the 'this' keyword with braces and values. For example:
```
type ParentType {
    this(d);
}
```
You can also provide a body to perform other actions in constructor e.g.
```
type ParentType {
    this(d) {
        d += 3.14;
    }
}
```
At this early stage, the actual design and implementation of these hasn't been finalised but provides a way to declare dynamic and changing
types. As mentioned earlier, it is my plan to return to types and their implementation to improve and enhance in the future.

## Building / Load from File
You can now save your expressions to file in a "compiled" state using SLOPProcessor.tokenizeToFile(expression, path). This provides a
performance boost as it uses the saved lexer result and loads it straight into the parser. There is no specific file type for either 
SLOP source files or "compiled" files and as such that decision is up to you. To load a "compiled" source file simply use 
processor.processFromFile(filePath, SLOPContext).

## Imports
Following on from the ability to now save and load source files, I am happy to announce the addiiton of the import token. This allows both
"compiled" and raw source files to be loaded in at runtime. Here is an example of the syntax:
```
import 'CompiledSource', @'UncompiledSource.slp';
```
As can be seen above, to load an uncompiled source file and use its declared functions, types and other resources, you have to
precede the declaration with an '@'. This will inform the token that it needs to be pre-compiled first. You can declare multiple imports
in the same import statement or load them in separate statements e.g.
```
import './compiled/CompiledSource';
import @'./source/UncompiledSource.slp';

/* Call external function in compiled source */
functionA();
/* Call external function in uncompiled source */
functionB();
```

## Toolkit Changes
### Parser flags
During the development of all the aforementioned features, it became apparent that I needed a way for the parser to handle specific types 
of events or be able to pass messages to others through their response. These events are common across languages and using flags could 
adopt a common approach within the parser itself (another way to say hardcode!). As such, I added a new field called parserFlags to the 
Token class. At this stage there are the following flags that can be set:
```java
public enum ParserFlag {
    BREAK,
    CONTINUE,
    RETURN,
    RETURN_GROUP,
    EXIT
}
```
As previously mentioned, some of these affect the behaviour of parser execution including BREAK, RETURN, CONTINUE and EXIT. Using one 
of these alters the traditional flow of execution. The RETURN_GROUP also affects the parser in that execution is stopped, but it is
also used to signal to the parent token to collate the results together - please see the Return Token '&' flag.

You may be looking at the above thinking "but you haven't got...". These were just the immediate set of flags I could think of, but
that's not to say this won't increase in number in future. Please let me know if there are any I'm missing and I'll do my best to 
get them added into the next release.

### Variable Types
Variable types determine how a value that is stored in context is handled. There are currently five types which are the following:
```java
public enum VariableType {
    DEFAULT,
    PARAMETER,
    PROTOTYPE,
    INSTANCE,
    SINGLETON
}
```
1. DEFAULT: This is the default type for a stored value and no special provisions will be undertaken. The value is simply stored 
and retrieved
2. PARAMETER: This is used when storing parameter values of tokens. The difference here is that special provision is given to
keeping track of the depth of the active token when it is defined. It also uses a variable stack so that as a function is recursed, 
values are pushed and removed upon each declaration and token completion. This means that even if a function calls itself mid-way,
once the recursion has completed and returned, the original parameter value will now be the top of the stack. This accounts for
changes to that variable as the token and depth will remain the same until it is completed.
3. PROTOTYPE: This is where a token acts as a blueprint for an INSTANCE type variable. A token adds itself as a PROTOTYPE when it
is initially called by the parser, but then can be cloned to create instances. It is similar to a SINGLETON as only one will 
exist under a given name.
4. INSTANCE: An instance is cloned from a PROTOTYPE. This is used to flag to other tokens that a given object can be modified.
In the case of SLOP, this is used by the FieldToken to check that the reference is an instance. If so it will defer the calls to 
the token instance.
5. SINGLETON: Much like the design pattern, this ensures that only one exists in memory at any one time. This is used by functions
defined at the top-level.

## Closing Comments
I realise that with this update not everything has been left in a fully completed state. Types still require some attention but 
for a first try I am happy with the results. More work and testing is planned to finalize what works and what doesn't. I think
this is the first time I now look at the project and feel it is finally starting to reach maturity. The speed at which I am
able to add features shows I've done something right. Everything just fits together well and it's rare I ever come across a 
situation where changes need to be made to the underlying code to get something to work (ahem, Parser Flags).

My plans for the future are to keep pushing the envelope and see where I end up. I now view SLOP as almost a language 
creation tool rather than a language in its own right. The current group of tokens is more acting as a test platform to 
ensure everything is working as it should. The next steps will be to release another artifact for just the toolkit, 
stripping out all but the base tokens. From there I'll aim to write a tutorial on how to get started and put it 
out there. Don't get me wrong, there are still bugs I've yet to discover in the lexer and no doubt these will arise when
this happens, but I feel now is the time to release it and see what happens.

Until the next time, as always you can always contact me with issues, questions or feedback at rmeyer@hotmail.co.uk. I 
always welcome hearing from anyone good or bad.

Robert.