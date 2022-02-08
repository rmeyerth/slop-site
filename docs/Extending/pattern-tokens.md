---
sidebar_position: 3
---

# Pattern Tokens
Although this section is not strictly necessary for extending SLOP, it describes the mechanism through which more 
complex tokens (statements) are identified and updated. As opposed to the standard literal tokens which use regular 
expressions to match and have their values set, statements are added to a stack and appended to until the token is 
marked as complete and added to the list of resulting tokens.

Without wanting to skip over how literals are scanned, a loop scans through the expression String and each token's
pattern is then evaluated against it to see if there is a match. Take the following:
```
12345.99 + 100 / 50
```
Using the following token patterns:
```
DecimalToken = ^-?[0-9]+\.[0-9]+
IntegerToken = ^-?[0-9]+
OperatorToken = ^(\+\+|--|\+|-|\/|\*|>=|<=|<|>|%|!=|==)
```
We can perform a loop now on the expression, removing each match until it is empty. The String is trimmed after each 
iteration which matches other languages where whitespace is ignored. Using this we see the following iteration events:
```
1) DecimalToken matched with value '12345.99'
2) OperatorToken matched with the value '+'
3) IntegerToken matched with the value '100'
4) OperatorToken matched with value '/'
5) IntegerToken matched with value '50'
```
This is a very simple example, but the same basic premise is used for statements. The only difference here is that the
grammar pattern is mapped into a series of hierarchical pattern tokens. This is used to keep track of the location of 
the last read token and what we are expecting the next token to be. For example, using the OperatorToken as an example
which has the following pattern:
```
'(' expr ')'
```
This is mapped to the following pattern:
```
GrammarGroup(position = 0, tokens = [
    GrammarValue('('),
    GrammarExpression(),
    GrammarValue(')')
]
```
All pattern tokens (even if they are not part of a defined group in the pattern) will be part of a GrammarGroup. This 
is because the GrammarGroup is used to record and track the current position within the token. If we assume that we 
only have this statement in the list of token handlers, with the following expression:
```
1 + (2 + 3)
```
We first read the Integer and Operator tokens and add them to the resulting token list. However, when we get to 
the '(', none of the literals trigger a match. A check of the topmost stack item is made first to ensure that it is 
not the next logical token in that. As our stack is empty however, we look for a new match in the token handlers 
list and find a match with the OperatorToken. A new instance of that token is created and added to the top of the stack 
and the parent GrammarGroup pattern token's position is updated to 1. The position always points to the next expected 
token that the token is expecting. In this case the positions are 0-indexed hence 1 pointing to the GrammarExpression.

The Lexer then reads three more tokens which are an IntegerToken, OperatorToken and a final IntegerToken. As the next
token after the GrammarExpression is a closing bracket ')', all of these get added to the child token list of the 
OperatorToken. Finally the closing brace is read, the tokens position is updated and marked as complete and removed 
from the top of the stack and added to the resulting token list:
```
[== Resulting Tokens ==]
IntegerToken(1),
OperatorToken(+),
OperationToken(tokens = [
    TokenGroup(tokens = [      
        IntegerToken(2),
        OperatorToken(+),
        IntegerToken(3)
    ])    
])
```
This is a very simple example, but what happens if we have embedded statements? This is where the stack comes more 
into play. Let's take the following expression as an example:
```
((1 - 2) * 3) / 4 < -1 ? "no" : "yes"
```
In the above although it may look simple, we have 3 levels of statements being processed. For this example I will
describe each stage and provide the state of the stack. In the beginning our stack is empty and our first read
token is an open bracket. Like the last example we have a match in the OperationToken which gets created and added
to the top of the stack. Unlike last time though, the next read token is also an open bracket. As our top-most
stack item is not expecting a closing bracket without at least some content, we look to the token handler list 
and again match the OperationToken which again gets created and added to the stack.

After the first two tokens have been evaluated, this is the state of our stack:
```
[== Stack ==]
OperationToken(position = 1, tokens = []) <-- Stack Top
OperationToken(position = 1, tokens = [])
```
The next three tokens are read and as they are two literals and an operator they are added to the top-most stack item. 
The next token is a closing bracket which matches the next logical token in our top-most stack item. As such, it's 
position is increased to the next logical token. In this case though as there are only 3 pattern tokens that form the
OperatorToken, the position actually exceeds the number of tokens. This triggers the token to be flagged as complete.
The current state of the stack matches the following:
```
[== Stack ==]
OperationToken(position = 3, tokens = [
    TokenGroup(tokens = [      
        IntegerToken(1),
        OperatorToken(-),
        IntegerToken(2)
    ])
])
OperationToken(position = 1, tokens = [])
```
Prior to the next token being read, a check is made to check the state of the current top-most stack item. In this case
it is found to be complete and as such it is removed from the stack and because the stack is not empty added as a child
of the next stack item:
```
[== Stack ==]
OperationToken(position = 1, tokens = [
    TokenGroup(tokens = [      
        OperationToken(position = 3, tokens = [
            TokenGroup(tokens = [                  
                IntegerToken(1),
                OperatorToken(-),
                IntegerToken(2)
            ])
        ])
    ])    
])
```
Two more tokens are then read which are an OperatorToken(*) and an IntegerToken(4). These are added to the top-most stack
item and a final closing brace is recorded which causes the last remaining item on the stack to be marked as complete:
```
[== Stack ==]
OperationToken(position = 3, tokens = [
    TokenGroup(tokens = [      
        OperationToken(position = 3, tokens = [
            TokenGroup(tokens = [                  
                IntegerToken(1),
                OperatorToken(-),
                IntegerToken(2)
            ]),            
        ]),
        OperatorToken(*),
        IntegerToken(3)
    ]),    
])
```
The OperationToken as the last remaining token is popped from the top of the stack and added to the resulting list of tokens.
Two more tokens are read and added to the token list which are an OperatorToken(/) and an IntegerToken(4). The list of
tokens looks like the following:
```
[== Resulting Tokens ==]
OperationToken(position = 3, tokens = [
    TokenGroup(tokens = [  
        OperationToken(position = 3, tokens = [
            TokenGroup(tokens = [              
                IntegerToken(1),
                OperatorToken(-),
                IntegerToken(2)
            ]),            
        ]),
        OperatorToken(*),
        IntegerToken(3)
    ]),    
]),
OperatorToken(/),
IntegerToken(4)
```
Something then unexpected happens where we find a '?' token. This is part of a token called a Conditional which has the
following grammar pattern:
```
expr '?' expr ':' expr
```
What is strange about this is that we had no prior warning that the previously lexed tokens were part of a statement. You
may also notice that the '?' is not the first token in the pattern. Since that was an expression capture group, the first which 
can be matched is actually the second token which says something about the statement's nature. The conditional is greedy and 
scoops up tokens immediately before and after as it has no strict opening and closing syantax tags. The start and end of the
statement can be identified by looking at those which share the same level / scope as the statement itself. For this 
example a match is made against the ConditionalToken and a new instance added onto the stack with all prior tokens added. 
The new state of the stack looks like the following:
```
[== Stack ==]
ConditionalToken(position = 2, tokens = [
    TokenGroup(tokens = [    
        OperationToken(position = 3, tokens = [
            TokenGroup(tokens = [
                OperationToken(position = 3, tokens = [
                    IntegerToken(1),
                    OperatorToken(-),
                    IntegerToken(2)
                ])
            ]),
            OperatorToken(*),
            IntegerToken(3)
        ]),
        OperatorToken(/),
        IntegerToken(4)
    ]),    
])
```
To be continued... (Don't forget about repeating grammar groups!)