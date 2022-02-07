---
sidebar_position: 2
---

# Operation
An operation does not provide any specific outcome / logic on its own. It can be used to isolate sections of an expression
either to group logic together or to affect the order in which it is evaluated. It can be defined by wrapping a section
in brackets. Using the previous example taken from the [Context](#context) section for dividing the number of employees
by company revenue:
```bash
(acme.revenue / acme.employees.size()).intValue()
```
In this situation if we did not use an operation, we would not be able to map the resulting value to an integer using a 
native call. Another example of where using operations is beneficial is to ensure correct evaluation with operators. 
For example:
```
1 - 2 * 3 / 4
```
In this scenario, the result may be different from what is expected. The default result for this is -0.5, however
if we want it to calculate from left to right, we would need to do the following to override the default operator order:
```
((1 - 2) * 3) / 4
```
In this case the result would be 0.75 which matches what we're expecting.

**NOTE**: The default operator order is BODMAS but this can be changed. Please see [Custom Operators](#custom-operators)
for more information.