---
sidebar_position: 3
---

# Repeat (Loop)
The repeat statement is a collection of one or more expressions that is repeated until a condition is met. This is
similar to the for loop in most languages which consist of three parts. These are:

1) The loop variable definition and method of progression
2) A value to initialize the loop variable
3) The condition that will be checked every iteration. If it is met then the loop will exit.

The body of the repeat statement is a series of separate expression Strings that are separated by semi-colons. Let's look
at the simplest example:
```
repeat(i++,1,<11) result = {?i};
```
The result of this is:
```
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```
We can reverse that by doing the following:
```
repeat(i--,10,>0) result = {?i};
```
Which will result in:
```
[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```
Each individual expression String in the body operate in exactly the same way as a standard expression. As such, you 
can use other statements or assign values to variables. The 'result' variable though is a special case where the value 
assigned is used in the resulting array for that iteration. The order of expression evaluation goes from left to right, 
much like a standard language if you added a new line character between each e.g.:
```
repeat(index++;0;<acme.employees.size())
   salaryAge = acme.employees[{?index}].salary / acme.employees[{?index}.age; 
   revCalculation = acme.revenue / {?salaryAge}; 
   result = switch({?revCalculation})[< 2000: {?salaryAge} * 0.15;< 4000: {?salaryAge} * 0.10; ... ]
```