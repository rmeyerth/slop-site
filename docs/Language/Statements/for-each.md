---
sidebar_position: 4
---

# For Each (Loop)
The foreach loop is a simplified version of the repeat statement. It simplifies the loop criteria
by iterating over a collection of objects assigning each value to a scoped variable. In the
following example each employee in a collection is assigned to the variable 'emp':
```bash
foreach(emp : acme.employees) result = "Name: " + {?emp}.name + ", Age: " + {?emp}.age;
```
The result from this would be an array of Strings:
```bash
["Name: Jennifer Smith, Age: 39", "Name: Bob Seinfeld, Age: 23", ...]
```
The primary reason for this loop type is to simplify the definition so we don't have to reference
each object by using the collection and index reference. If you are just looking to extract a specific
field from a collection then you can simply use the following without the loop:
```bash
acme.employees.name
```
Getting back to the for each, we can also filter the results back from the loop. In the following
example we are filtering the names returned by age:
```bash
foreach(emp : acme.employees) {?emp}.age > 40 ? result = {?emp}.name : null;
```
This would just return the names of only those individuals older than 40. This use case is not perfect
as you see we are only setting the result by using a conditional where the false case return an unused
'null' value. This could be fixed by adding a single conditional 'if' statement, but this exceeds the 
scope for this simple scenario. Please see [Adding Statements](#adding-statements) for more information.

**NOTE**: There is a known issue which has already been fixed and will be released in the upcoming 
version 1.1