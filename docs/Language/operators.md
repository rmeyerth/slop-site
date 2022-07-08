---
sidebar_position: 4
---

# Operators
SLOP uses the same operators as C / C++ / Java languages out of the box. Below a list of the supported operators
with examples:

| Name | Notation | Example | Result |
|:-----|:---------|:--------|:-------|
| Add  | +        | 1 + 1   | 2      |
| Subtract | -    | 4 - 2   | 2      |
| Divide | /      | 4 / 2   | 2      |
| Multiply | *    | 2 * 2   | 4      |
| Greater or Equal To | >= | 5 >= 4 | true |
| Less than or Equal To | <= | 5 <= 4 | false |
| Less than | <   |  3 < 4   | true   |
| Greater than | &gt; | 3 &gt; 4   | false  |
| Modulus | %     | 8 % 3   | 2      |
| Not Equal | !=  | 1 != 2  | true   |
| Equals | ==     | 2 == 2  | true   |

The default set of operators follow the standard BODMAS order of mathematical operations. This along with modification or 
addition of new operators is supported. Please see the [Custom Operators](#custom-operators) section for more information. 

**NOTE**: There is a limitation where operators that modify left-side values i.e. increment (++), decrement (--)
are only supported for special cases in specific statements. This is because at present the Parser does not
support modification of variables directly, but have to be reassigned using the 'val = expr' pattern. An issue has
been logged about this and will look to included in upcoming versions. Until that time to increment a variable
please use 'myVar = {?myVar} + 1'.

## Logical Operators
Logical Operators are used when wanting to perform multiple parts to a condition. Irrespective of the language used, they
share the same fundamental names which are AND and OR. A language such as Java / C# uses && and || respectively, whereas
a language like Pascal adopts a more literal approach by using 'and' and 'or'. The default for SLOP follows this more
literal approach (and | or), though like with everything this can be customized through the creation of a class which 
extends both the Token<?> class and implemented the LogicOperatorHandler interface. You can then choose in the REGEX
pattern the values you wish to use:
```java
@Override
public String getPattern() {
    return "^(\\|\\||&&)";
}
```
From there you can set your customized version of the Logic Operator Handler to the config by using the following:
```java
SLOPConfig config = new SLOPConfig();
config.setLogicOperatorHandler(new MyCustomLogicOperators());
```
For more details, please look at the LogicOperator class file within the SLOP codebase. The final stage will be to
configure which tag is the OR operator. You can do this by setting a property:
```java
config.setProperty(DefaultProperty.OR_OPERATOR, "||");
```
From there you can start using those in expressions (AND):
```
> 99 > 50 && 23 - 22 == 1
Result: true
```
The OR operator:
```
> 54 - 12 == 9 || 1 < 2
Result: true
```
**NOTE**: Please note again, the default logical operators for SLOP are 'and' and 'or'.