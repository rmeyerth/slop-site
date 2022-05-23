---
sidebar_position: 4
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

| Grammar | Description |
|:-----|:--------|
| '{' | Starting syntax curly brace |
| ( | Capture group start |
| ( | Capture group start (Multiple embedded grammar groups used for collection element separation) |
| val | Single capture token (Key must be defined as a single value and cannot be the result of an operation) |
| '->' | Syntax key / value pair separator |
| expr | Multiple token capture group (could be the result of an operation e.g. 1 + 1) |
| ',' | A syntax comma separating key / value pairs |
| ? | Makes the preceding tag (comma) optional as a map could be defined as a single key / value e.g. {1->1} |
| ) | Closing capture group |
| ) | Closing capture group (Each capture group gets mapped to a TokenGroup handled by the ``process`` method) |
| + | Signifies that there could be one or more of the preceding group (in this case key / value pairs) |
| '}' | Closing syntax curly brace |
Now that we have our pattern defined we can fill out the rest of the class definition:
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
            Token<?> mapStructure = getTokenGroups().get(0).unwrapKeepStructure(getTokenGroups().get(0));
            if (mapStructure instanceof TokenGroup) {
                /* Expect map structure to take form of a TokenGroup with child TokenGroups of Key / Value pairs.
                 * If this is not the case then wrap the result in another TokenGroup as the unwrap has gone too far */
                if (((TokenGroup) mapStructure).getTokens().stream().anyMatch(t -> !(t instanceof TokenGroup))) {
                    mapStructure = new TokenGroup(Collections.singletonList(mapStructure));
                }
                ((TokenGroup) mapStructure).getTokens()
                        .forEach(tg -> {
                            Token<?> key = ((TokenGroup) tg).getTokens().get(0);
                            key = parser.processExpression(key instanceof TokenGroup ?
                                    ((TokenGroup) key).getTokens() : Collections.singletonList(key), context);
                            Token<?> value = ((TokenGroup) tg).getTokens().get(1);
                            value = parser.processExpression(value instanceof TokenGroup ?
                                    ((TokenGroup) value).getTokens() : Collections.singletonList(value), context);
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
I would then register / declare this in the configuration:
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
Type operation support can be added to allow more ease of use when dealing with the types natively. For example, 
we can define the following TypeOperation implementation for our Map type:
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
Although this looks quite complicated, all we're doing is adding support for it to handle only a left-side map and
the option or either a map or list on the right-side. Operations can then be added such as add and subtract. This 
class can then be registered in the config under the initTypeOperations() method:
```java
    private void initTypeOperations() {
        //...
        typeOperations.add(new MapOperation());
    }
```
The following can now be performed:
```bash
{1->1,2->2} + {3->3,4->4}
Result: {1=1, 2=2, 3=3, 4=4} (Time taken: 46ms)
{1->1,2->2,3->3} - {2->2}
Result: {1=1, 3=3} (Time taken: 14ms)
{1->1,2->2,3->3,4->4} - [1,3]
Result: {2=2, 4=4} (Time taken: 12ms)
```
To explain this, the ``canHandle`` method in the TypeOperation interface determines which types the operations class can 
handle from the Parser. For most types this would be restricted to the same type. However, it provides the flexibility 
to control extra types to provide more functionality or for ease of use. In the above case the MapOperations class 
will trigger if the first token is a Map but the second could be either a Map or List. This is purely because whilst 
the ``+`` operation is handy for adding elements to a Map, the ``-`` is a bit overkill to specify both a key and value 
to remove the entry. As such, we can utilise the List to represent the keys to simplify things.

*NOTE: This code is now included as part of the core SLOP functionality.