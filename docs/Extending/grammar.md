---
sidebar_position: 2
---

# Grammar
The grammar pattern determines not only the structure of the statement and how it can be defined, but also structure 
of how the tokens are organised into groups for processing. To start there are two basic grammar tokens which cause 
other values to be captured. These are 'val' (single) and 'expr' (multiple). Around this you can group tokens together 
using brackets or define syntax by wrapping values in single quotes. For example, the grammar for a FunctionToken is 
the following:
```bash
val '(' ( expr ','? )+ ')'
```
Breaking this down we get the following:
```
val   = Captures single value
'('   = Denotes an opening bracket in the syntax
(     = Start of a grammar group
expr  = Captures one or more values
','?  = An optional comma value. '?' marks the preceding token as optional
)+    = End of the grammar group. The '+' denotes that the contents of this group can be repeated one or more times
')'   = A closing bracket in the syntax
```
Using this we can pass the following values in an expression which would be a valid match:
```bash
DATE("14-02-1983 15:49:03", "dd-MM-yyyy hh:mm:ss")
SUM(45 * 15 + 1, 2 / 3, 3)
```
The first match would result in the following token output:
```
FunctionToken( tokenGroups = [
    TokenGroup( tokens = [
        StringToken( value = "DATE" )
    ],
    TokenGroup( tokens = [
        TokenGroup ( tokens = [ StringToken( value = "14-02-1983 15:49:03" ) ] ),
        TokenGroup ( tokens = [ StringToken( value = "dd-MM-yyyy hh:mm:ss" ) ] ),
    ] )
] )
```
In the above example, the 'val' capture group even though it is a single token gets added into its own TokenGroup. A
second TokenGroup gets added to contain the one or more 'expr' capture groups that are expected. Expressions 
representative of one or more tokens always get added into their own TokenGroups so that there is a clear split between
subsequent parameters (in this case) and the tokens which go to constructing that single parameter.

For the more complicated second example, it would be the following:
```
FunctionToken( tokenGroups = [
    TokenGroup( tokens = [
        StringToken( value = "SUM" )
    ],
    TokenGroup( tokens = [
        TokenGroup ( tokens = [
            IntegerToken( value = 45 ),
            OperatorToken( value = * ),
            IntegerToken( value = 15 ),
            OperatorToken( value = + ),
            IntegerToken( value = 1 )
        ] ),
        TokenGroup ( tokens = [
            IntegerToken( value = 2 ),
            OperatorToken( value = / ),
            IntegerToken( value = 3 ),
        ] ),
        TokenGroup ( tokens = [ IntegerToken( value = 3 ) ] )
    ] )
] )
```
When defining a grammar pattern you should be aware of the structure of other tokens defined within SLOP. Should
one of the existing Tokens conflict with the new Token and the Lexer is unsure of which match to use, it will
throw a LexerException to highlight the issue.

There is one final token which can be used when specifying grammar which is the '<' flag. This can be seen in
the SwitchToken:

     ... ( expr ','? )+ ':' expr '!'<? ';'? )+ ...

This can follow a syntax token and tells the Lexer not to discard it but instead add it to the context as it would
with a normal token as a TokenValue or NonToken. This can be useful to pass flags to the token processing code
(triggered by the Parser) to denote a certain situation. In the above example if an exclamation mark is found in a
switch case then it will stop looking at any other cases (similar to how a break works in the Java switch statement).

If constructing a new Grammar expression string is still confusing and how it relates to the resulting TokenGroup
structure, please follow the example provided in the [Adding Statements](#adding-statements) section.