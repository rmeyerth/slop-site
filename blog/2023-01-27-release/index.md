---
slug: release
title: SLOP 1.35 Release
authors: [tronied]
tags: [slop]
---
After working hard for the last couple of weeks on SLOP, I am happy to announce that SLOP 1.35 has been
released. There have been numerous bug fixes and changes since the last release, so will briefly list them 
below:
### Variables
Variable tags i.e. `{?myVariable}` have been replaced with regular name equivalents. For example:
```java
> myVariable = 12
Result: 12
> myVariable
Result: 12
> newResult = myVariable - 4
Result: 8
> [a = 0,b = 1] + repeat(i++,0,<10) result = a + b; a = b; b = result;
Result: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```
Please be aware that variables are case-sensitive, so you must use the same case when referencing. 
### Collection Filters
Collection filtering can now be done using the traditional indexing section. If you wanted to filter 
and map collection items, you would have to use a loop:
```bash
> foreach (emp : acme.employees) if (emp.age < 40) result = emp.name;
Result: ['Mary','Bob']
```
Now you can remove the loop entirely and use the following:
```bash
> acme.employees[^~age < 40].name
Result: ['Mary','Bob']
```
The initial '^' character flags up to the Parser that this is using conditions rather than index filtering. 
The '~' character denotes that any following field references should be taken from the items within the
collection. You can define a condition as you would normally and that includes the use of logical operators.
For example:
```bash
acme.employees[^acme.topEarners.contains(~payrollId) and ~name.startsWith('S')]
> Result: Employee(employeeId='EMP4326', name='Sharon', payrollId=114, age=43)
```
As can be seen this is using a more complicated condition. In the case above we're using a native call to
check to filter those employees who exist on the topEarners collection. Secondly, that their name starts 
with an 'S' which results Sharons employee object being returned.
### Static Referencing
You can now add references to classes which may exist outside your context. These may be enums which you
would want to reference. To do this we'll need to add a classpath reference in the context:
```bash
SLOPConfig config = new SLOPConfig();
config.include("testEnum", "dev.slop.enums.TestEnum");
config.include("testClass", "dev.slop.model.TestClass");
```
We can now reference a value within the class or enum by using the '#' symbol. For example:
```
> (#testEnum.VALUE_A.value + 124) / 4
Result: 31
```
We can now also reference enum values within a public inner class e.g.
```java
public class TestClass {

    public enum TestEnum {
        VALUE_A(1),
        VALUE_B(2),
        VALUE_C(3);

        private int value;

        TestEnum(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }
    }
}
```
To do this use the '$' character before the declared inner class:
```
> (#testClass.$TestEnum.VALUE_A.value + 124) / 4
Result: 31
```
### Unary Operator
This was an oversight on my part and now have happily added the ability to use '!' in front of a Boolean 
value or expression to negate it. This works in exactly the same way as other languages e.g.
```java
> !(3 > 4)
Result: true
> !!(3 > 4)
Result: false
> !(!(3 > 4) == 4 > 3)
Result: false
```
### Syntax Validation
This has been included since the last version (1.32) but I did not document it. If you type a statement
and make a mistake, it will show an error and highlight the problem and location:
```java
> repeat(i++;0;<10) result = i + 1;

dev.slop.exception.LexerException: Expected token ',' in RepeatToken but expression ended prematurely. 
----------------------------------------------------------------
- Guidance: A repeat statement requires 3 parts of the iteration to be defined and separated by a ',' 
            character e.g. repeat ( i++, 0, <10 ) ...
- Last Read Tokens: 'result','=','i','+','1'
- Expression: repeat(i++;0;<10) result = i + 1;
----------------------------------------------------------------
```
In the above example, we have mistakenly used semi-colons instead of commas when defining the repeat
loop. It is showing that it expected the token ',' and will provide guidance where it thinks you have
gone wrong. This is now implemented by all statements and in case you are looking to add this to your
own additions, this occurs by overriding the following method in your Token class:
```java
@Override
public Optional<String> getGuidance(String token, List<Integer> groupsCount) {
    if (token.equalsIgnoreCase(","))
        return Optional.of("A repeat statement requires 3 parts of the iteration to be defined and " +
            "separated by a ',' character e.g. repeat ( i++, 0, <10 ) ...");
    ...
}
```
### LinkedHashMap Support
SLOP now supports the use of LinkedHashMap's. The reason for this may not be clear unless you are 
familiar with JSON and use it frequently in serialisation / de-serialisation. What this allows you 
to do is create an endpoint i.e. REST which allows a JSON payload to be pushed to a POST endpoint.
This can be serialised into a LinkedHashMap which can now be set directly into the SLOP context 
and act like a normal model object. This means you don't have to have the objects or DTO's on the 
classpath to use them in SLOP expressions. They work in exactly the same way as objects added to the
context and allows SLOP to work independently of any code dependencies.

### Closing Comments
There are many other changes and bug fixes I have made, but without turning this into war and peace I 
will end it here. I realise some of the documentation is now out of date now and will endeavour 
to update this in due course. I am still hard at work on my side project which uses SLOP, with many of
the changes and improvements coming from that. There is still so much I want to do and have a lot
planned in the coming months. One of these is the ability to assign values to tokens. The majority of 
tokens will remain immutable as it makes no sense to assign values to them, but certain ones like 
the ability to modify values within the structure of a context object or collection are on my radar.

As always, if you have any feedback, questions or concerns please send an email to tronied@yahoo.com
or head on over to the board [here](https://slop.boards.net). 
