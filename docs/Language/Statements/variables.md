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
using the repeat statement you can declare and share values between them in a left-to-right direction. 

#### Fibonacci Example Breakdown
```
[a = 0,b = 1] + repeat(i++,0,<10) result = {?a} + {?b}; a = {?b}; b = {?result};
```
This may appear confusing upon first reading, but let's break it down. Firstly an initial array of [0,1] is
declared, but each array item value is assigned to two variables (a and b). This is because when you assign something
to a variable, it's value is also returned. We add this array to the result of the next statement (repeat loop) which 
also returns an array of values. The repeat statement loops 10 times and has 3 sections separated by a ';' character.

If you're familiar with the fibonacci sequence then this will be fairly explanatory, but if not I'll describe each
section below:
1. ``result = {?a} + {?b}`` - Stores the result of the a and b variables into the result variable. On the first pass 
it will be 0 + 1
2. ``a = {?b}`` - Sets what is in the b variable (1 on first pass) to the a variable. At this state both a and b are 1
3. ``b = {?result}`` - b variable becomes the value of result (1)

With each pass we can see the following values assigned:
1. a = 0, b = 1, result = 1
2. a = 1, b = 1, result = 2
3. a = 1, b = 2, result = 3
4. a = 2, b = 3, result = 5
5. a = 3, b = 5, result = 8
6. etc...

The repeat loop uses each result variable from each iteration to return in an array of values. If we append those to the
initial array we then get ``[0,1,1,2,3,5,8...]``