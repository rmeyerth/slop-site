---
sidebar_position: 2
---

# Literals
Literals are fixed values but can represent different types. The default set of types are listed below:

| Type | Pattern | Example | Description |
|:-----|:--------|:--------|:------------|
| Boolean | N/A | myVal = true | True / false value |
| Decimal | #.# | 39.4 | Stored as a big decimal |
| Float | #.#F | 39.4F | Floating point equivalent of decimal |
| Long | ###L | 123456789L | A long is used where a value would exceed the maximum integer length |
| Integer | ## | 12345 | A standard non-decimal number |
| Null | N/A | null | Used where a result can be compared to the lack of any value |
| String | "..." | "This is a string" | A text value |
| Array | [ ... , ... ] | [1,2,3,4,5] | A collection which stores any values e.g. [1,true,3.5F] |
| Map | { ... , ... } | {"pi"->3.14,"planck"->6.62} | A map containing key / value pairs |

As they have fixed values they cannot be changed, however they can be used in type operations to create new literals.
For example, adding the following two literals results in the creation of a new literal:
```bash
addString = "First" + "Second"
```
Evaluating by using {?addString} would result in "FirstSecond", likewise performing an addition on two arrays:
```bash
[1,2] + [3,4]
```
Would result in:
```bash
[1,2,3,4]
```
Although it may look like we're modifying the first by adding the second to get the result, in actuality a new array 
literal is created. Literals are the building blocks of all expressions and without them, we could not perform any 
operations. Even resolved field values are read into literal types. Only variables can have their values modified and
updated.