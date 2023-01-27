---
sidebar_position: 1
---

# Overview
SLOP includes five main components:

1. [Processor](#processor): _Evaluates expressions, ability to save / import lexer output and override other SLOP components._
2. [Config Class](#config-class): _Declaration of token classes (literals, operators, statements etc) and management of properties._
3. [Lexer](#lexer): _Converts the String expression into a hierarchical set of tokens that can be read by the parser._
4. [Parser](#parser): _Reads tokens and defers responsibility to each handler and type operation classes to resolve values_
5. [Context](#context): _Contains objects that are referenced in the expression. Used to store variables._

## Processor
The processor class is the starting point for anyone wishing to use or configure SLOP. It can evaluate static expressions by
 using:
```java
SLOPProcessor.processStatic("3 > 4 ? 'no' : 'yes'").getValue(String.class);
```
or by creating an instance and calling the process method:
```java
SLOPProcessor processor = new SLOPProcessor();
processor.process("3 > 4 ? 'no' : 'yes'").getValue(String.class);
```
Each accepts a context object and each has its own advantages over the other. The static version is quick to call 
without the need to create an instance. It is meant for fast lightweight evaluation of expressions, though this 
does impact performance making multiple requests. Also, unlike the instanced version it does not provide the ability to
serialize the lexer output, chain expressions (See [Extra Features](#extra-features)), or modify the configuration / 
override other SLOP components.

## Configuration Class
The configuration class can be ignored by most users but is useful to those wishing to add / modify existing functionality.
It provides methods to add literals, type operations, statements and customize operators. For example, by creating 
a default configuration class, setting the setOperatorHandler method to the following, you can change the default operators 
to use a different set:
```java
SLOPConfig config = new SLOPConfig();
config.setOperatorHandler(new VerboseOperator(""));
SLOPProcessor processor = SLOPProcessor(config);
```
Now when defining an expression, instead of declaring:
```bash
1 + 3 / (5 * 9) % 2
```
You can use:
```bash
1 add 3 div (5 mul 9) mod 2
```
Why would you do this? I have no idea, but it shows that every aspect of SLOP can be changed if you so wish. If you're 
curious, please take a look at the default OperatorToken class compared with the VerboseOperator class to see how this can 
be done.

Another important aspect of the configuration class is defining and setting custom properties. The tokens use these 
properties to alter their behaviour or end result. At this stage (and to avoid confusion), everything that is
read from an expression String is mapped to a token class (literals, statements etc). Although I will go into this
later in greater detail (See [Extending](#extending)), each token class contains the pattern and code to process a 
result. As such, when I refer to tokens I am referring to them in their abstract form using this context.

There are some general properties which have been defined in a DefaultProperties class. These are:
```java
 DATE_FORMAT("dateFormat"),
 ESCAPE_CHARACTER("escapeCharacter"),
 OR_OPERATOR("orOperator"),
 DEBUG_MODE("debugMode"),
 SAFE_OPERATIONS("safeOperations");
```
As a quick run through of each:
- The date format determines the default format used when using the DATE function e.g. dd-MM-yyyy
- Determines which character can be used as an escape character e.g. "Test String \"Inner String\"". In this case 
it's using the backslash character.
- The keyword used as an OR operator. This is a legacy entry and would recommend looking to the LogicOperator class instead.
- Debug mode enables all debug messages to see how values were derived.
- Safe operations is enabled by default. Disabling allows native calls (via reflection) to be called on objects. For example:
  ```java
  SLOPConfig config = new SLOPConfig();
  config.setProperty(DefaultProperties.SAFE_OPERATIONS, false)
  SLOPProcessor processor = new SLOPProcessor(config);
  processor.process("'testing'.substring(1,4).concat('run')"); //Results in "testrun"
  ```
  Using the above example, attempting a native call without setting that property will throw a ParserException.

The above properties are the default set included with SLOP, however you can add your own and use them within your own
statements. Please see the [Adding Statements](#adding-statements) section for more information.

## Lexer
Lexers are used to transform different types of expressions into a series of tokens. SLOP uses two lexers which are the 
SLOPGrammarLexer and SLOPLexer. As per it's name, the first is dedicated to translating token grammar Strings into
pattern tokens. Pattern tokens are used by the second lexer to match the current token (read from an expression) to an 
equivalent token type as either a new match or existing item in the stack. Please see the [Design](#design) section for
more information on how the Lexer processes an Expression String.

## Parser
The parser takes the tokens mapped by the lexer and resolves them into one or more resulting values. It does this by 
deferring responsibility to each token for resolution of it's value. For example, given the following:
```bash
(1 + 2) / 2
```
This would equate to the following token structure from the Lexer:
```bash
TokenGroup[
   OperationToken[
      IntegerToken(1),
      OperatorToken("+"),
      IntegerToken(2)
   ],
   OperatorToken("/"),
   IntegerToken(2)
]
```
The Parser will loop through each token calling the process method to resolve their values. With most literal 
tokens (Integer / Operator / String), when invoked it simply returns its own value e.g. String("hello") 
would be "hello". With a token like the OperationToken (itself a statement) that has three child tokens, these will have to be 
calculated into a result. It is the responsibility of each token to resolve its own child tokens. Don't think though 
that the token is left to fend for itself and start performing adding or subtracting calculations as that responsibility 
can be passed back to the Parser. The Parser is a parameter in the process call and has methods to resolve a 
list of tokens into a result. If this is confusing then I can appreciate that! For more information please see the 
[Design](#design) section for more information on how the Parser and Tokens work together to resolve values.

## Context
The context instance can be used to pass objects so that they can be evaluated and be referenced in Expression Strings.
For example, given the following classes:
```java
class Company {
    private String name;
    private BigDecimal revenue;
    private List<Employee> employees;
    
    //...
}

class Employee {
    private String name;
    private int age;
    
    //All args constructor
}
```
We could create a context object and set the following:
```java
SLOPContext context = new SLOPContext();

//Employees
Employee employeeA = new Employee("Mary", 34);
Employee employeeB = new Employee("Bob", 54);
Employee employeeC = new Employee("Susan", 64);
Employee employeeD = new Employee("Jim", 23);

//Company
Company acmeCompany = new Company();
acmeCompany.setName("ACME Company Plc");
acmeCompany.setRevenue(BigDecimal.valueOf(129000000));
acmeCompany.setEmployees(Arrays.asList(employeeA, employeeB, employeeC, employeeD));

context.set("acme", acmeCompany);
```
Now using the above, we could write the following to calculate revenue divided by the number of employees:
```java
SLOPConfig config = new SLOPConfig();
config.setProperty(DefaultProperties.SAFE_OPERATIONS, false);
SLOPProcessor processor = new SLOPProcessor(config);
System.out.println("Result: " + processor.process("(acme.revenue / acme.employees.size()).intValue()"
            .getValue(Integer.class));
```
**NOTE**: Because the default result from this would be a BigDecimal (3.225E..), we use the native call intValue() on 
the result to get a more understandable figure. As such, this results in:
```bash
Result: 32250000
```
Using another example with the employee collection, let's say we wanted to extract each name into a collection. 
In most languages you would iterate through each object adding the relevant field. This would be similar to the following:
```bash
repeat(index++;0;<acme.employees.size()) result = acme.employees[index].name;
```
or when using the for-each statement:
```bash
foreach(emp : acme.employees) result = emp.name;
```
You can however get the same result by skipping looping entirely and just specifying the collection and target field:
```bash
acme.employees.name
```
All three above examples would result in the following:
```bash
["Mary", "Bob", "Susan", "Jim"]
```
For more information on the repeat or field token, please see the [Statements](#statements) section for
more information.