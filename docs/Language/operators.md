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