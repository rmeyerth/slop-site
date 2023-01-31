---
slug: release
title: SLOP 1.35 Release
authors: [tronied]
tags: [slop]
---
After working hard for the last couple of weeks, I am pleased to announce that SLOP 1.35 has been
released. There have been numerous fixes and changes since the last version. I will list a few of 
them below:
### Variables
Referencing variable tags i.e. `{?myVariable}` has now been replaced with their regular name equivalents 
e.g. `myVariable`. As such, you can now perform assignments and references using the same tag:
```java
> myVariable = 12
Result: 12
> myVariable
Result: 12
> newVariable = myVariable - 4
Result: 8
```
For comparison, here is the original fibonacci example (see [here](/docs/Language/Statements/variables#fibonacci-example-breakdown) for more details):
```java
[a = 0,b = 1] + repeat(i++,0,<10) result = {?a} + {?b}; a = {?b}; b = {?result};
```
This is now replaced with the simpler definition:
```java
[a = 0,b = 1] + repeat(i++,0,<10) result = a + b; a = b; b = result;
```
Please be aware that variables are case-sensitive, so you must use the same case when referencing. 
### Collection Filters
Conditional filtering can now be done using the collections index section. Using the following example, 
the context is initialised with a sample company and employees. There is also an array of top earners 
that we'll reference later:
```java
private static Company sampleCompany() {
    Company company = new Company();
    company.getEmployees().add(Employee.builder()
            .employeeId("EMP1").payrollId(123).name("Bob").age(37).build());
    company.getEmployees().add(Employee.builder()
            .employeeId("EMP2").payrollId(321).name("Sharon").age(54).build());
    company.getEmployees().add(Employee.builder()
            .employeeId("EMP3").payrollId(789).name("Mike").age(49).build());
    company.getEmployees().add(Employee.builder()
            .employeeId("EMP4").payrollId(987).name("Anna").age(25).build());
    company.getTopEarners().add(321);
    company.getTopEarners().add(987);
    return acme;
}

public static void main(String[] args) {
    //Create and initialise context
    SLOPContext context = new SLOPContext();
    context.set("acme", sampleCompany());
    //Create config and allow unsafe operations
    SLOPConfig config = new SLOPConfig();
    config.setProperty(DefaultProperty.SAFE_OPERATIONS, false);    
    SLOPProcessor processor = new SLOPProcessor(config);
    //Use passed parameter to the app and print result
    System.out.println(String.format("Result: %s", 
        processor.processStatic(args[0], context));
}
```
Traditionally, if you wanted to filter and map collection items, you would have to use a loop in your
expression:
```bash
foreach (emp : acme.employees) if (emp.age < 40) result = emp.name;
```
You can now remove the loop entirely by using the following:
```bash
acme.employees[^~age < 40].name
```
Both of the above provide the following result:
```bash
Result: ['Bob', 'Anna']
```
The initial '^' character flags up to the Parser that this is using condition criteria rather than 
a standard integer index. The '~' character denotes that any field reference following it should be 
taken from the item being iterated in the collection. You have free-reign over how you define conditions
so long as they evaluate to booleans. This includes the use of logical operators, for example:
```bash
acme.employees[^acme.topEarners.contains(~payrollId) and ~name.startsWith('S')]
```
As we're not defining a field, this would output the entire matched object:
```bash
Result: Employee(employeeId='EMP2', payrollId=321, name='Sharon', age=54)
```
In the expression above we're using the collection native call contains() on the topEarners list to filter to 
those employees that have a matching payroll ID. Second to this, a second native call startsWith() is 
used to filter names beginning with an 'S'. This results in Sharons employee object being returned. If we wanted 
to fetch this object in its Java native form, we would use:
```java
Employee result = processor.process(args[0], context).getValue(Employee.class);
```
### Static Referencing
You can now add references to enums and static class methods via a new include() method in the 
configuration object. Let's see this in action by adding an enum we want to reference:
```bash
SLOPConfig config = new SLOPConfig();
config.include("testEnum", "dev.slop.enums.TestEnum");
```
For reference this enum has the following definition:
```java
package dev.slop.enums;

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
```
We can now reference a value within the enum by using the '#' symbol. For example:
```
(#testEnum.VALUE_A.value + 124) / 4
```
Would result in:
```bash
Result: 31
```
We can now also reference enums within another class by using the '$' character. For example, using
the same enum but located within another class, first we include the reference:
```java
config.include("testClass", "dev.slop.model.TestClass");
```
With the following defined class but the same enum:
```java
package dev.slop.model;

public class TestClass {
    public enum TestEnum {
        ...
    }
}
```
We can perform the following for the same result:
```
(#testClass.$TestEnum.VALUE_A.value + 124) / 4
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
own tokens, this occurs by overriding the following method in your Token class:
```java
@Override
public Optional<String> getGuidance(String expected, List<Integer> groupsCount) {
    if (expected.equalsIgnoreCase(","))
        return Optional.of("A repeat statement requires 3 parts of the iteration to be defined and " +
            "separated by a ',' character e.g. repeat ( i++, 0, <10 ) ...");
    ...
}
```
### LinkedHashMap Support
SLOP now supports the use of LinkedHashMap's. The reason for this may not be clear unless you are 
familiar with JSON and use it frequently in serialisation / de-serialisation. What this allows you 
to do for example is create a POST REST endpoint that allows unstructured JSON payloads to be pushed.
This can be serialised into a LinkedHashMap and passed directly into the SLOP context to act like a 
normal model object. This means you don't have to have the class definition or DTO's on the classpath 
to use them in SLOP expressions. Once added they work in exactly the same way as normal objects allowing 
SLOP to work independently of additional code dependencies.

### Closing Comments
There are many other changes and bug fixes I have made, but without turning this into war and peace I 
will end it here. I realise some of the documentation is now out of date now and will endeavour 
to update this in due course. I am still hard at work on my side project which uses SLOP, with many of
the changes and improvements coming from that. There is still so much I want to do and have a lot
planned in the coming months. One of these is the ability to assign values to tokens. The majority of 
tokens will remain immutable as it makes no sense to assign values to them, but certain ones like 
the ability to modify values within the structure of a context object or collection are on my radar.

As always, if you have any feedback, questions or concerns please email me at rmeyer@hotmail.co.uk
or head on over to the board [here](https://slop.boards.net). 
