---
sidebar_position: 3
---

# Adding Types / Operations
As can be seen in the [Design Approach](#design-approach) section, types can be defined using regular 
expressions or grammar. If the type you are wanting is simple and represents a primitive type or object 
then regular expressions would be best. However, if you are wanting to customise how your type is defined 
or interact with other types then use grammar.

Take the original example which is a simple long type. We can see by the regular expression ``(^(-?[0-9]+)L)``
that a long can be defined either positive or negative so long as a number is followed by an 'L' character.
So far so simple, however things get more complicated when it comes to collections. Let's say we wanted to define a
Map type where one or more key / value pairs are separated by '->' syntax and surrounded by curly braces. We
could define this by using the following ``{((.+?)->(.+?),?)+}``, however say we have ``{1->1,2->2 + 2,3->3}`` 
in an expression, because we've got multiple embedded groups we run into issues with them either not knowing
when to stop (overly greedy) or not being greedy enough due to the syntax.

This is where defining the pattern with grammar is useful as it is designed to handle complex structures. It
also allows better handling of individual tokens in simplistic form. Let's use the Map as an example and now
use ``'{' ( ( val '->' expr ','? ) )+ '}'``. This can be broken down to the following:

```
'{'   = Starting syntax curly brace
(     = Capture group start
(     = Capture group start (Multiple embedded grammar groups used for collection element separation)
val   = Single capture token (Key must be defined as a single value and cannot be the result of an 
        operation)
'->'  = Syntax key / value pair separator
expr  = Multiple token capture group (could be the result of an operation e.g. 1 + 1)
','   = A syntax comma separating key / value pairs
?     = Makes the preceding tag (comma) optional as a map could be defined as a single key / value 
        e.g. {1->1}
)     = Closing capture group
)     = Closing capture group (Each capture group gets mapped to a TokenGroup handled by the 
        ``process`` method)
+     = Signifies that there could be one or more of the preceding group (in this case key / value 
        pairs)
'}'   = Closing syntax curly brace
```

It is important to understand when and where methods within a Token get called: 
1. Pattern tokens are initially generated and stored against all token types registered in the configuration class. 
Depending on the pattern type (``getPatternType`` method) this determines whether these are created by the Grammar 
Lexer or deferred to the regex matchers during the Expression String lexing stage.
2. As each literal value is read from the Expression String, matches may occur against registered Token classes and 
their pattern tokens. If two or more matches are found then it looks ahead in the expression to make a best-guess at 
a matching Token. In the case where there is no clear choice an exception is thrown.
3. Once the matching Token has been identified, a new instance of it is created by calling the ``createToken(String value)``
method. This creates a new version of the Token and clones all the pattern tokens and settings from the match.
4. During the lexing phase, the matched Token will be added to the top of the stack so that if it was declared within
the body of another token or has itself other tokens declared in the body, these can easily be managed. Each
Token keeps track of its position with new items being added to the stack at that position until they are deemed 
complete and added as a child token of the new stack head.
5. As more tokens / syntax are read from the expression, the position of the matched token is progressed accordingly 
and tokens are added to Token Groups matching the position in which they're added (see ``MyToken.getTokenGroups()``).
6. Once the lexing phase is complete, the hierarchical list of tokens is sent to the Parser for resolution. Each
Token is responsible for resolving its own result in tandem with the Parser when its ``process()`` method is called.
Child tokens (located in the token groups) can then be used to affect behaviour or resolve values. 

Let's take the simple conditional statement as an example and perform a breakdown:
```java
//...
@Override
public String getPattern() {
    //condition ? trueResult : falseResult
    return "expr '?' expr ':' expr";
}

@Override
public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {
    //Expect that there are 3 tokens groups representing the condition and true / false token groups
    if (getTokenGroups().size() < 3) {
        throw new ParserException(String.format("Condition does not have required arguments to execute. Expecting " +
                "condition (%s), trueResult (%s) and falseResult (%s)", getTokenGroups().get(0), getTokenGroups().get(1),
                getTokenGroups().get(2)));
    }
    //Evaluate the condition using the tokens found in the first token group
    Token<?> conditionResult = parser.processExpression(getTokenGroups().get(0).getTokens(), context);
    //If the condition is not a Boolean then throw an error i.e. "1 + 2 ? 3 : 4"
    if (!(conditionResult instanceof BooleanToken)) {
        throw new ParserException(String.format("Expected a boolean result from condition '%s'. Possible invalid " +
                        "condition specified", getTokenGroups().get(0)));
    }
    //Execute the relevant set of tokens based on the condition result
    return Collections.singletonList((((BooleanToken) conditionResult).getValue()) ?
            parser.processExpression(getTokenGroups().get(1).getFlatTokens(), context) :
            parser.processExpression(getTokenGroups().get(2).getFlatTokens(), context));
}
//...
```
The pattern is very simple consisting of 3 expressions (one or more tokens) with the condition and two possible results. Looking
at the ``process`` method we can see an initial check is made to ensure that there are 3 defined token groups, otherwise an 
exception is thrown. This is part of the role of the Parser with each Token responsible for validating its content. If we 
match up the token groups against the capture groups defined in the grammar string, we get the following:
```
TokenGroups Collection:
    0 = Condition
    1 = True Result
    2 = False Result
```
The first task will then be to resolve the value of the conditional part which is found at position 0 of the token groups:
```java
    //Evaluate the condition using the tokens found in the first token group
    Token<?> conditionResult = parser.processExpression(getTokenGroups().get(0).getTokens(), context);
```
As mentioned before, the tokens are passed back to the Parser for resolution as each token will be responsible for resolving
its own value. The parser also handles the type operations in any expression e.g. A + B. Once a result has been returned from
the parser it is assigned to a new token called ``conditionResult``. Tokens are stateless by default and so we have to check 
it conforms to the type we are wanting, which in the case of a condition is a Boolean. If not we throw an exception:
```java
    //If the condition is not a Boolean then throw an error i.e. "1 + 2 ? 3 : 4"
    if (!(conditionResult instanceof BooleanToken)) {
        throw new ParserException(String.format("Expected a boolean result from condition '%s'. Possible invalid " +
                        "condition specified", getTokenGroups().get(0)));
    }
```
Finally we can evaluate our condition and resolve the associate set of tokens and return the result:
```java
    //Execute the relevant set of tokens based on the condition result
    return Collections.singletonList((((BooleanToken) conditionResult).getValue()) ?
            parser.processExpression(getTokenGroups().get(1).getFlatTokens(), context) :
            parser.processExpression(getTokenGroups().get(2).getFlatTokens(), context));
```

Getting back to our Map type then, although it is a bit more complicated it uses the same principles. We verify the data
and perform certain actions against a set of tokens or resolve their values:
```java
@NoArgsConstructor
public class MapToken extends Token<Map<Token<?>, Token<?>>> {

    public MapToken(Map<Token<?>, Token<?>> values) {
        super("Map", values);
    }

    @Override
    public Token<Map<Token<?>, Token<?>>> createToken(String value) {
        MapToken source = new MapToken(new HashMap<>());
        Token<Map<Token<?>, Token<?>>> result = cloneDefaultProperties(source);
        result.setValue(source.getValue());
        return result;
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.GRAMMAR;
    }

    @Override
    public String getPattern() {
        //One or more key / value pairs separated by '->' and wrapped in curly braces e.g. {1->1,2->2}
        return "'{' ( ( val '->' expr ','? ) )+ '}'";
    }

    @Override
    public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {
        Map<Token<?>, Token<?>> aMap = Objects.isNull(getValue()) ? new HashMap<>() : getValue();
        //Handle blank initializer
        if (!getTokenGroups().isEmpty()) {
            //Scan the resulting token groups and unwrap as much as possible to make handling easier
            Token<?> mapStructure = getTokenGroups().get(0).unwrapKeepStructure(getTokenGroups().get(0));
            if (mapStructure instanceof TokenGroup) {
                /* Expect map structure to take form of a TokenGroup with child TokenGroups of Key / Value pairs.
                 * If this is not the case then wrap the result in another TokenGroup as the unwrap has gone too far */
                if (((TokenGroup) mapStructure).getTokens().stream().anyMatch(t -> !(t instanceof TokenGroup))) {
                    mapStructure = new TokenGroup(Collections.singletonList(mapStructure));
                }
                ((TokenGroup) mapStructure).getTokens()
                        .forEach(tg -> {
                            //Although the key is restricted to a single token, resolve it anyway as it could need resolving
                            Token<?> key = ((TokenGroup) tg).getTokens().get(0);
                            key = parser.processExpression(key instanceof TokenGroup ?
                                    ((TokenGroup) key).getTokens() : Collections.singletonList(key), context);
                            Token<?> value = ((TokenGroup) tg).getTokens().get(1);
                            value = parser.processExpression(value instanceof TokenGroup ?
                                    ((TokenGroup) value).getTokens() : Collections.singletonList(value), context);
                            //Add the resolved values to resulting map
                            aMap.put(key, value);
                        });
            } else {
                throw new ParserException(String.format("Cannot initialize map with token of type '%s'",
                        mapStructure.getClass().getSimpleName()));
            }
        }
        if (Objects.isNull(getValue())) setValue(aMap);
        return Collections.singletonList(this);
    }

    @Override
    public String toString() {
        if (Objects.isNull(getValue())) {
            throw new ParserException("Map values have not been processed yet");
        }
        String result = getValue().entrySet().stream()
                .map(e -> e.getKey().getValue().toString() + " -> " + e.getValue().getValue().toString())
                .collect(Collectors.joining(", "));
        return "MapToken{values = [" +
                result +
                "]}";
    }
}
```
To register / declare the type in the configuration, simply create a new instance and add to the tokenHandler collection
in the configuration class:
```java
    private void initTokenHandlers() {
        //...
        
        //Language literals / supported types
        //...        
        tokenHandlers.add(new MapToken());
        //...
    }
```
This allows us to now define a Map using ``{Key->Value,Key->Value,...}``. If you enable unsafe operations 
(See [Configuration Class](#configuration-class)), you can add, remove or fetch values directly using the
Map Java class implementation e.g.
```bash
> {1->"first",2->"second"}.get(1)
Result: "first" (Time taken: 1ms)
```
The maps are not type specific and can support anything you throw at it:
```bash
> myVar = {"first"->1,2->"second"}
> {?myVar}.put("third",3)
> {?myVar}
Result: {"first"=1, 2="second", "third"=3} (Time taken: 1ms)
> {?myVar}.remove("third")
> {?myVar}
Result: {"first"=1, 2="second"} (Time taken: 1ms)
```
## Type Operations
Operation support can be added for your type to allow more ease of use when dealing with the types natively. 
For example, we can define the following TypeOperation implementation for our new Map type:
```java
/**
 * Handles Map operations including add and subtract with the latter supporting both Map and Lists. The
 * result is returned as a MapToken.
 */
public class MapOperation implements TypeOperation {

    /**
     * See {@link TypeOperation#canHandle(Token, OperatorToken, Token) canHandle}
     */
    @Override
    public boolean canHandle(Token<?> first, OperatorToken operator, Token<?> second) {
        return first.is(Map.class) && (second.is(Map.class) || second.is(List.class));
    }

    /**
     * See {@link TypeOperation#handleCustomOperator(Token, OperatorToken, Token) handleCustomOperator}
     */
    @Override
    public <T> T handleCustomOperator(Token<?> first, OperatorToken operator, Token<?> second) {
        throw new ParserException(String.format("Unable to handle Map operation with operator '%s'",
                operator.getValue()));
    }

    /**
     * See {@link TypeOperation#process(SLOPConfig, Token, OperatorToken, Token) process}
     */
    @Override
    @SuppressWarnings("unchecked")
    public Token<?> process(SLOPConfig config, Token<?> first, OperatorToken operator, Token<?> second) {
        OperatorHandler handler = config.getOperatorHandler();
        //We can suppress warnings here as we've already checked the contained token
        Map<Token<?>,Token<?>> original = first.getValue(Map.class);
        if (second.is(Map.class)) {
            Map<Token<?>,Token<?>> compare = second.getValue(Map.class);
            return handleMapOperations(handler, original, compare, operator,
                    () -> handleCustomOperator(first, operator, second));
        } else {
            List<Token<?>> compare = second.getValue(List.class);
            return handleListOperations(handler, original, compare, operator,
                    () -> handleCustomOperator(first, operator, second));
        }
    }

    @SuppressWarnings("unchecked")
    private Token<?> handleMapOperations(OperatorHandler handler, Map<Token<?>,Token<?>> original,
                                         Map<Token<?>,Token<?>> compare, OperatorToken operator,
                                         CustomOperation customOp) {
        final Map<Token<?>, Token<?>> result;
        switch (handler.getOpType(operator)) {
            /* Adds two maps together e.g. {1:1,2:2} + {3:3,4:4} = {1:1,2:2,3:3,4:4}. Note that if there is a key
             * which already exists in the left-side map then it will be overwritten by that on the right e.g.
             * {1:1,2:2} + {1:2,3:3} = {1:2,2:2,3:3} */
            case ADD:
                result = new HashMap<>(original);
                result.putAll(compare);
                break;
            /* Subtracts a map from the other e.g. [1:1,2:2,3:3] - [2:2,3:3] = [1:1]. Please note items are only removed
             * if their key and values match. There if you did [1:1] - [1:3], you'd still result in the original [1:1] */
            case SUBTRACT:
                result = new HashMap<>(original);
                List<Token<?>> keysToRemove = original.keySet().stream()
                        .filter(compare.keySet()::contains)
                        .collect(Collectors.toList());

                keysToRemove.forEach(kr -> {
                    //Only remove those with matching values too
                    if (result.get(kr).equalsValue(compare.get(kr))) {
                        result.remove(kr);
                    }
                });
                break;
            default: result = (Map<Token<?>, Token<?>>) customOp.handleCustomOp();
        }
        return new MapToken(result);
    }

    @SuppressWarnings("unchecked")
    private Token<?> handleListOperations(OperatorHandler handler, Map<Token<?>,Token<?>> original,
                                         List<Token<?>> compare, OperatorToken operator,
                                         CustomOperation customOp) {
        Map<Token<?>, Token<?>> result;
        if (handler.getOpType(operator) == OperatorType.SUBTRACT) {
            /* Subtracts the matching keys present in the right-side list from the left-side map */
            List<Token<?>> keysToRemove = original.keySet().stream()
                    .filter(compare::contains)
                    .collect(Collectors.toList());
            keysToRemove.forEach(original::remove);
            result = original;
        } else {
            result = (Map<Token<?>, Token<?>>) customOp.handleCustomOp();
        }
        return new MapToken(result);
    }

    /**
     * A simple functional interface to avoid having to pass multiple parameters to perform the same
     * call for both right-side Map and Lists if the default case is triggered.
     */
    @FunctionalInterface
    private interface CustomOperation {
        Token<?> handleCustomOp();
    }
}
```
Although this looks quite complicated, let's start by breaking each stage down and explaining what each part does.
As the parser processes the tokens, it looks for certain patterns like that of two Tokens surrounding an OperatorToken.
In this scenario, it will fetch all of the declared TypeOperation classes and search for a match using the ``canHandle`` 
method by passing it all the tokens involved in the operation. In the case of our MapOperation class, we are doing the 
following:
```java
@Override
public boolean canHandle(Token<?> first, OperatorToken operator, Token<?> second) {
    return first.is(Map.class) && (second.is(Map.class) || second.is(List.class));
}
```
In this case we're declaring that we only support a map type on the left-side but both a map or list on the right-side. 
If it found that the types do match then a call to the ``process`` method is made:
```java
@Override
@SuppressWarnings("unchecked")
public Token<?> process(SLOPConfig config, Token<?> first, OperatorToken operator, Token<?> second) {
    OperatorHandler handler = config.getOperatorHandler();
    //We can suppress warnings here as we've already checked the contained token
    Map<Token<?>,Token<?>> original = first.getValue(Map.class);
    if (second.is(Map.class)) {
        Map<Token<?>,Token<?>> compare = second.getValue(Map.class);
        return handleMapOperations(handler, original, compare, operator,
                () -> handleCustomOperator(first, operator, second));
    } else {
        List<Token<?>> compare = second.getValue(List.class);
        return handleListOperations(handler, original, compare, operator,
                () -> handleCustomOperator(first, operator, second));
    }
}
```
In the above case we're first fetching the OperatorHandler class from the config. This allows us to compare the passed 
operator against the registered ones we have and perform an easy (and readable) switch statement to handle each. In
this case since we have to handle both right-side list and map types, we first check and call a different method to
handle each (``handleMapOperations`` and ``handleListOperations``). We are also passing in a method reference to
handle any unsupported operators that we encounter. In this case though we are just throwing an exception if that 
occurs in the ``handleCustomOperator()`` method.

Let's take a look at the ``handleListOperations`` method for simplicity:
```java
@SuppressWarnings("unchecked")
private Token<?> handleListOperations(OperatorHandler handler, Map<Token<?>,Token<?>> original,
                                        List<Token<?>> compare, OperatorToken operator,
                                        CustomOperation customOp) {
    Map<Token<?>, Token<?>> result;
    if (handler.getOpType(operator) == OperatorType.SUBTRACT) {
        /* Subtracts the matching keys present in the right-side list from the left-side map */
        List<Token<?>> keysToRemove = original.keySet().stream()
                .filter(compare::contains)
                .collect(Collectors.toList());
        keysToRemove.forEach(original::remove);
        result = original;
    } else {
        result = (Map<Token<?>, Token<?>>) customOp.handleCustomOp();
    }
    return new MapToken(result);
}
```
In this case we are only supporting subtraction using an array as it we can use the key values found in an array
to remove those from the Map. We simply loop through the key values filtering to only those which match the keys
and then remove them from the resulting Map. Regarding operations, it is up to the choice of the developer as to
whether the original Map is updated but in this case we leave the state of the original Map alone and return a 
new Map containing the result. If we wanted to reflect those changes back to the original map we would do:
```bash
> myMap = {1->1,2->2,3->3}
> {?myMap}
Result: {1->1,2->2,3->3}
> {?myMap} = {?myMap} - [2]
> {?myMap}
Result: {1->1,3->3}
```

This operations class can then be registered in the config under the initTypeOperations() method:
```java
    private void initTypeOperations() {
        //...
        typeOperations.add(new MapOperation());
    }
```
With those registered, in addition to the above example we can now perform the following:
```bash
> {1->1,2->2} + {3->3,4->4}
Result: {1=1, 2=2, 3=3, 4=4}
> {1->1,2->2,3->3} - {2->2}
Result: {1=1, 3=3}
```
In the above example the addition of the List containing keys is there to simplify the removal process. Otherwise by
performing a subtraction using two maps you would have to match both key and value. It is good to keep in mind what
would be useful to make writing expressions simple and as concise as possible.

*NOTE: This code is now included as part of the core SLOP functionality.