---
sidebar_position: 6
---

# Field
The field statement is a simple method of structuring objects and fields to access values. Similar to how this would 
be done in Java, field or object references are separated by a period character (.). Depending on how many levels
deep the statement goes within sub-objects or collections it can vary in size. Collections or Maps can use square
brackets to specify an index or key to extract a particular value. Firstly though, let's look at a simple example:
```
acme.revenue / acme.employees.size()
```
In the above we have two field statements. The first is an Integer field whilst the second uses the native call 
'size()' on the employee's collection*. Fields can be used in calculations or statements so long as the returned
value is compatible e.g. ``employee.isActive / employee.dateJoined`` would throw a Parser exception. Moving on
from this we can access specific items in collections using the following:
```
acme.employees[0].name
```
Alternative you can specify the following if the employees object was a Map:
```
acme.employees["#E0001354"].name
```
The Field statement also has a useful shortcut to extract values. Typically you would need to iterate through
collections with an incrementing index, but in this case that can be done automatically to return the value:
```
acme.employees.firstName + " " + acme.employees.lastName
```
This would return an array of every employee's full name. As SLOP is open with regards to adding new types, you
could get creative with the above to form new structures or filter / extract data with little to no effort.

*NOTE: Native calls can only be used if the SAFE_OPERATIONS property in the configuration object is set to true.
Please see the [Overview - Configuration Class](/docs/Language/overview#configuration-class) for more information.
