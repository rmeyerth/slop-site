---
sidebar_position: 4
---

# Type Operations
If you've read the section [Design Approach](#design-approach), you should now know how to add your own types.
You should now be able to define a value using declared syntax and see that type reflected in its tokenized form. If 
you're unsure of how to do this, the best way to do this would be to stick a breakpoint in your IDE in the 
``YourType.process(...)`` method. The next stage is to add type operations so that when you use an operator with the 
new type, an appropriate action occurs and a result returned. For example, say I want to be able to define
a map type I would declare a class with the following*:
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
        return "'{' ( ( val '->' expr ','? ) )+ '}'";
    }

    @Override
    public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {
        if (Objects.isNull(getValue())) {
            HashMap<Token<?>, Token<?>> aMap = new HashMap<>();
            //Unwrap to bare-bones groups and tokens
            Token<?> mapStructure = getTokenGroups().get(0).unwrapKeepStructure(getTokenGroups().get(0), 1);
            if (!(mapStructure instanceof TokenGroup)) {
                throw new ParserException("Expected map to simplify to TokenGroup but got " +
                        mapStructure.getClass().getSimpleName());
            }
            //Iterate through map structure and resolve all contained token values
            ((TokenGroup) mapStructure).getTokens()
                    .forEach(tg -> {
                        if (!(tg instanceof TokenGroup)) {
                            throw new ParserException("Expected mapping to be TokenGroup but got " +
                                    tg.getClass().getSimpleName());
                        }
                        Token<?> key = ((TokenGroup) tg).getTokens().get(0);
                        key = parser.processExpression(key instanceof TokenGroup ?
                                ((TokenGroup)key).getTokens() : Collections.singletonList(key), context);
                        Token<?> value = ((TokenGroup) tg).getTokens().get(1);
                        value = parser.processExpression(value instanceof TokenGroup ?
                                ((TokenGroup)value).getTokens() : Collections.singletonList(value), context);
                        aMap.put(key, value);
                    });
            setValue(aMap);
        }
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
This allows us to now define a Map using ``{Key->Value,Key->Value,...}``. If you enable unsafe operations 
(See [Configuration Class](#configuration-class)), you can add, remove or fetch values as the core object
is simply a Map and those functions can be performed out of the box e.g.
```bash
> {1->"first",2->"second"}.get(1)
Result: "first" (Time taken: 1ms)
```
The maps are not specific on type and can be defined using different types:
```bash
> myVar = {"first"->1,2->"second"}
> {?myVar}.put("third",3)
> {?myVar}
Result: {"first"=1, 2="second", "third"=3} (Time taken: 1ms)
> {?myVar}.remove("third")
> {?myVar}
Result: {"first"=1, 2="second"} (Time taken: 1ms)
```
Type operations can perform the same operations but slightly allow more customization. For example, by creating the
following MapOperations class:
```java
public class MapOperation implements TypeOperation {
    
    @Override
    public boolean canHandle(Token<?> first, OperatorToken operator, Token<?> second) {
        return first.is(Map.class) && (second.is(Map.class) || second.is(List.class));
    }

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
        Map<Token<?>, Token<?>> result;
        switch (handler.getOpType(operator)) {
            /* Adds two maps together e.g. {1:1,2:2} + {3:3,4:4} = {1:1,2:2,3:3,4:4}. Note that if there is a key
             * which already exists in the left-side map then it will be overwritten by that on the right e.g.
             * {1:1,2:2} + {1:2,3:3} = {1:2,2:2,3:3} */
            case ADD:
                original.putAll(compare);
                result = original;
                break;
            /* Subtracts a map from the other e.g. [1:1,2:2,3:3] - [2:2,3:3] = [1:1]. Please note items are only removed
             * if their key and values match. There if you did [1:1] - [1:3], you'd still result in the original [1:1] */
            case SUBTRACT:
                List<Token<?>> keysToRemove = original.keySet().stream()
                        .filter(compare.keySet()::contains)
                        .collect(Collectors.toList());
                keysToRemove.forEach(kr -> {
                    //Only remove those with matching values too
                    if (original.get(kr).equalsValue(compare.get(kr))) {
                        original.remove(kr);
                    }
                });
                result = original;
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

    @Override
    public <T> T handleCustomOperator(Token<?> first, OperatorToken operator, Token<?> second) {
        throw new ParserException(String.format("Unable to handle Map operation with operator '%s'",
                operator.getValue()));
    }

    /**
     * Cuts down on the amount of parameters needing to be passed to each operation handler method
     */
    @FunctionalInterface
    private interface CustomOperation {
        Token<?> handleCustomOp();
    }
}

```
You can register it in the config under the initTypeOperations() method:
```java
    private void initTypeOperations() {
        //...
        typeOperations.add(new MapOperation());
    }
```
The following operations can now be performed:
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