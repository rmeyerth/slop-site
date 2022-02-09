---
sidebar_position: 5
---

# Switch
The switch statement has been so far the most ambitious of the project. Being frustrated by the lack of flexibility in
the Java version, I attempted to overcome these shortfalls by adding many of the features I would have liked to be
present as possible. Whether all of these changes somehow removes the basic idea of a simple switch is up for debate,
but below I will list and explain these features below.

At it's core the idea of a switch is simple. You evaluate a single value against a set of other values (or cases) and 
execute code paired with the match. At the basic level the SLOP statement does not differ from that, you can still
use that formula:
```java
switch(emp.name)["Mary": "Banker";"Bob": "Coder"; "Jim": "Marketing"; default: "I don't know"]
```
In this case our value is passed as a parameter and cases are separated by semi-colons with the condition present before
the colon and the result after. So far so simple, but one of the restrictive things about this model is the limited
cases (no pun intended) where you can use this. What happens if you want to evaluate integers for example? Say we have
multiple conditions where we want to check whether a value falls within some set boundaries. In Java this is not currently
possible at the time of writing this. In SLOP though we have no such restriction and therefore can use the following:
```java
switch(person.age)[< 1: "Baby";< 3: "Toddler";< 12: "Adolescent"; ...]
```
Firstly there is an issue with the above statement. If you run it and the person declared in the parameter is 2 for example, 
the result would be a collection of multiple results being ["Toddler", "Adolescent", ...] and every case after. This is 
because the switch statement does not stop when it finds a match by default and will return all matching condition results 
in the set. The avoid this we can use the '!' flag following the case definition:
```java
switch(person.age)[< 1: "Baby"!;< 3: "Toddler"!;< 12: "Adolescent"!; ...]
```
The above would now return the correct result of just "Toddler". You may notice that we are defining all case evaluations 
without specifying the value we're comparing it to. This is typical for a switch, but should this be required (especially 
when declaring multiple parameters - more on this later!), you can reference each parameter by doing the following:
```java
switch(person.age)[$0 < 1: "Baby";$0 < 3: "Toddler";$0 < 12: "Adolescent"; ...]
```
This is unnnecessary or the most part so you can ditch that just in favour of using the desired operator and comparison
value. It is also not restricted to using single value evaluations. For example, we could do the following:
```java
switch(person.salary)[> acme.revenue / acme.averageSalary: "High Earner"; ...]
```
Much like the C / C++ / Java equivalents, the SLOP switch has a default case which acts as a fallback if none of the
other cases match. The condition is replaced by the keyword 'default', but follows the same pattern with the result
being provided after the semi-colon. An example of this can be seen in the first example on this page.

## Multiple Parameters
A typical switch has one parameter by which it is used to compare against the cases. What would happen though if we 
wanted to pass in multiple values or use those in a condition? You can provide multiple parameters by defining them
separated by a comma. There are two methods of evaluating these parameters in each switch case. The first is using
them in a single condition. For example:
```java
switch(acme.outgoings, acme.revenue)[$0 > $1: "Deficit";$0 < $1: "Profit";$0 == $1: "Holding Even"]
```
Here we are using the earlier method of referencing parmeters. It could be argued that the values could be simply referenced 
without passing them as parameters which is true, however by using the parameter reference it makes it a lot more concise.
Using this same method you can also evaluate both parameters against some value:
```java
switch(acme.outgoings, acme.revenue)[
    $0 > 500000 AND $1 - $0 > 100000: "We're Ok";
    $0 > 750000 AND $1 - $0 > 50000: "Cause for concern"; 
    $0 > 750000 AND $1 - $0 <= 10000: "Uh oh"; 
    ...
]
```
As one final feature of the SLOP switch, parameters can be contained within their own conditions separated by a comma
character. For example:
```java
switch(a.intA, a.intB, a.intC)[>5,>10,>15: "First";>10,<12,20: "Second"]
```
When defining parameter conditions like this, you must ensure that the number of comma separated conditions matches
the number of parameters otherwise an exception will be thrown.

## Future Improvements
These are the features I will also be looking to add in the near future:
1. Evaluation against arrays of objects. This would be similar to how a contains() works against the parameter variable.
For example, you could use:
  ```java
  switch(emp.name)[["Mary","Bob","Susan"]: "Board Member"; default: "Employee"]
  ```
2. Similar to the multiple expressions suppported by the repeat and for-each, add the ability to add groups of expressions
per case. As the current case syntax separator is already a semi-colon, an optional grouping could be added e.g.:
  ```java
  switch(emp.age)[<30: {empAgeCompanyAge = $0 * acme.age; result = "R = " + {?empAgeCompanyAge}}]
  ```