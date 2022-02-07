---
sidebar_position: 1
---

# Conditional
The conditional or ternary statement is the easiest way to evaluate a condition and select a single value as a result.
It is made up of three parts (condition, true result, false result) and if you're familiar with programming works in the 
same way most languages use them. Conditionals can be simple:
```bash
4 > 3 ? "yes" : "no"
```
or complex:
```bash
12 % (sampleObject.componentA * sampleObject.componentB + 6 <= (SUM(sampleObject.subObjects.value,4) -
    sampleObject.componentC / 3) + 30 ? 9 * sampleObject.subObjects[0].subSubObject.valueB + 2 : 3)
```
Conditionals are greedy by nature meaning that they eat preceding or following tokens until a parent statement token
is found. This can make them difficult to read as it is not always clear where they begin and end (the above is a
good example of this). They can be chained together to evaluate multiple conditions with results:
```bash
person.age < 2 ? "Infant" : person.age < 9 ? "Child" : person.age < 19 ? "Adolescent" : ...
```
For most scenarios this would not be the recommended as it is not easy to read. Please look to the [Switch](#switch) 
statement for a better alternative.