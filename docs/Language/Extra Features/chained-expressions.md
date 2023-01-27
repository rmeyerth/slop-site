---
sidebar_position: 2
---

# Chained Expressions
These are where the result of one expression can be referenced in another, effectively creating a chain to 
reach the final result. Chained expressions are passed in a collection to the SLOPProcessor where special 
syntax can be used to reference the previous result. The following test shows how this can be used:
```java
    @Test
    public void testSimpleChainedResults() {
        assertEquals(2, processor.process(Arrays.asList(
                "4 * 4",
                "{?} / 4",
                "{?} - 2"
        )).getValue());
    }
```
Each expression passed results in value that can be referenced using the ``{?}`` reference. In the case above
the first simply calculates 4 multiplied by itself resulting in 16. This is then referenced in the next expression
and divided by itself to become 4. The final expression then subtracts to reach the final result which is 2. These
references are a special feature which can be used for expression chains but are not required. Take the following
for example:
```java 
    @Test
    public void testAssignNameChainedExpression() {
        assertEquals(12, processor.process(Arrays.asList(
                "resultA = 4 * 4",
                "resultB = resultA / 4",
                "resultB - 2"
        )).getValue());
    }
```
In this case we are using variables to achieve the same result. Each expression in the chain is executed 
sequentially, but the final result will be that of only the final expressions result. Chained expressions are
useful when the there are multiple calculations required to reach a goal but performing it in a single expression 
would make it complicated and difficult to read. This way it can be broken down into component parts and results.