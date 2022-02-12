---
sidebar_position: 7
---

# Variables
Variables at present are classified as statements because they are matched and processed using the Grammar system.
They currently have limited ability aside from being set and read from the context. To set a value you simply define
a name with an equals and the value e.g.
```
myValue = 12
```
To reference that value, you wrap it in curly brackets with a question mark prefix before the name e.g.
```
result = {?myValue} * 4
```
At previously mentioned, the increment (++) and decrement (--) operators are not currently supported for modifying
variable values. This is because it needs Parser support to be added to modify context values directly. Support will
be added for this in a future release. If you do want to increment the value of a variable, you will need to reference
it in the operation and store it back to itself e.g.
```
myValue = {?myValue} + 1
```
Variables can be used in Chained Expressions or statements which support multiple expressions. For example, when
using the repeat statement you can share values between them in a left-to-right direction. Using the fibonacci
example again, we can see this in use:
```
[0,1] + repeat(i++,0,<10) result = {?first} + {?second}; first = {?second}; second = {?result};
```