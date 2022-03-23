---
sidebar_position: 1
---

# Saving / Loading Lexer Output
As discussed in the [Overview](#overview) section, there are two parts to the execution process which involve the
Lexer and Parser. The Lexer transforms an expression into a series of tokens, whereas the Parser uses those tokens
and any referenced objects to calculate a result. Although it may seem like the calculation would be the most costly
part, the opposite is in fact true. Lexing code or expressions is generally much more expensive due to the logic 
required to keep track of which token is being written to and where. This is why compilers are faster than 
interpreters as they are able to transform (compile) written code into machine code which can be stored to disk and
very fast to execute. Using that same logic, SLOP can serialize and persist the tokens to file so that those expressions
can be loaded once and executed in token form in a fraction of the normal time. This can be useful when you may want
to run different values through the same expression without having to lex the expression each time.

To do this there are two methods called tokenizeToString and tokenizeToFile on the SLOPProcessor object. Each can 
be used for different purposes but both accept an expression and persist the Lexer output to String or File.
```java
SLOPProcessor processor = new SLOPProcessor();
String serializedOutput = processor.processToString("[1,2 * 1,SUM(1,2,3) + 1]");
```
Likewise for reading serialized output either in String or File form there are two methods (processFromString / 
processFromFile) in the SLOPProcessor();
```java
ExpressionResult<?> result = processor.processFromString(serializedOutput);
```
To provide one example where these features could be used, imagine you have a document generator which contains
one or more templates containing expressions. If you have 1000 customers all of which need statements you could
evaluate each expression in the document each time but this would be very slow. What we could do with the above
functionality is to serialize the expressions within the template to file and reference each using a unique key. 
When the system / service starts up these are loaded into memory (a Map object for example) so that as the document
is being processed instead of evaluating each expression the tokens can be run through the Parser with the relevant
objects to resolve the result. This would result in the 1000 documents being created orders of magnitude faster
than the former method.