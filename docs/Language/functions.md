---
sidebar_position: 4
---

# Functions
SLOP has been designed to provide as much functionality as possible, but it may be the case where the right results 
cannot come by using expressions alone. This is where custom functions come into play. Functions can be written in 
the native language but referenced within expression Strings. Only a limited set of functions have been provided in 
the core SLOP package, but writing your own is very easy. Let's take a look at creating a random function:

```java
public class RandomOp implements Function {

    @Override
    public String getName() {
        return "RAND";
    }

    @Override
    public Token<?> execute(SLOPConfig config, List<Token<?>> values) {
        Random random = new Random();
        if (values.size() < 1 || values.size() > 2) {
            throw new ParserException("Expected two arguments e.g. 'RAND('integer', 1000)'");
        }
        if (!(values.get(0).getValue() instanceof String)) {
            throw new ParserException("Expected random type (param 0) to be a String value. Valid values are: " +
                    "'integer', 'double', 'float', 'long', 'boolean'");
        }
        String type = values.get(0).getValue(String.class);
        if (values.size() == 2) {
            if (!type.equalsIgnoreCase("integer")) {
                throw new ParserException("Bound only supported when using the integer type");
            }
            if (values.get(1).getValue() instanceof Integer) {
                throw new ParserException("The bound parameter must be specified as an integer");
            }
        }
        switch (type) {
            case "integer": return new TokenValue(values.size() == 1 ? random.nextInt() :
                random.nextInt(values.get(1).getValue(Integer.class)));
            case "float": return new TokenValue(random.nextFloat());
            case "double": return new TokenValue(random.nextDouble());
            case "boolean": return new TokenValue(random.nextBoolean());
            case "long": return new TokenValue(random.nextLong());
        }
        throw new ParserException(String.format("Unexpected type provided in random function '%s'", type));
    }
}
```
Functions are simple from a code standpoint as it requires only to implement the Function interface and methods.
The above will provide the ability to create random numbers using a type parameter to be used in an expression. 
It is important when creating functions to check and throw errors if the parameter list is not in the expected 
format. The code itself is fairly self-explanatory and will allow it to be called by using the RAND name and two 
parameters (the second being restricted on the type). Next we need to add it to our config:
```java
SLOPConfig config = new SLOPConfig();
config.addFunction(new RandomOp());
SLOPProcessor processor = new SLOPProcessor(config);
```
Finally we are ready to test it out. It can be useful to test any SLOP changes by using the SLOPRunner class in the 
test package. This allows expressions to typed in and evaluated after the enter key is pressed. Here is some output 
for our new function:
```bash
> RAND("integer")
Result: 13788106 (Time taken: 3ms)
> RAND("integer",1000)
Result: 730 (Time taken: 5ms)
> RAND("integer",100)
Result: 55 (Time taken: 2ms)
> RAND("boolean")
Result: true (Time taken: 2ms)
> RAND("boolean")
Result: false (Time taken: 2ms)
> RAND("float")
Result: 0.5708346 (Time taken: 2ms)
> RAND("long")
Result: -7999691372481956837 (Time taken: 1ms)
```
Functions can then be used in conjunction with other values to trigger an action or resolve a value:
```
> 3.1459 * RAND("float")
Result: 0.20246804
```
Although this is just an example, it shows that we can leverage the underlying native language to fulfill either
shortfalls in what is possible with the included literals and statements or to avoid overly complex expressions. 
Imagine a banking application where we have customers stored on a database. We could setup a custom notification 
stored on a record that is associated with a specific customer which is triggered each day or whenever a change 
is made to their account. The following will notify them if their main account falls below £250 and it's still 
less than or equal to the 15th of each month:
```
customer.mainAccount.total < 250.00 and DAY("LTE", 15) ? EMAIL_WARNING(customer) : null
```
