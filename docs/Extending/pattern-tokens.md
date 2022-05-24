---
sidebar_position: 6
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
])
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
Four more tokens are read and added to the token list which are the OperatorToken(/), IntegerToken(4), OperatorToken(<) and
finally an IntegerToken(-1). Without moving into the job of the Parser, if the expression ended here this would result in
a condition which would result in a Boolean. As it is, the list of tokens looks like the following:
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
IntegerToken(4),
OperatorToken(<),
IntegerToken(-1)
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
        IntegerToken(4),
        OperatorToken(<),
        IntegerToken(-1)
    ]),    
])
```
As the active token is now a different grammar expression, all captured tokens will be written to a new token group. As
there is only a single String token, that is added to that. The next token is a ':' which matches the next logical token 
of the head of the stack in the Conditional statement. The position is incremented again to the position past the last
token so that it now points to position 4 which is the last 'expr' capture group. As the last remaining token is a
solitary StringToken as well, the final picture of the stack prior to the ConditionalToken being removed looks like the
following:
```
[== Stack ==]
ConditionalToken(position = 4, tokens = [
    TokenGroup(tokens = [    
        OperationToken(position = 3, tokens = [
            ...
        ]),
        ...
        IntegerToken(-1)        
    ]),
    TokenGroup(tokens = [    
        StringToken("no")
    ]),
    TokenGroup(tokens = [    
        StringToken("yes")
    ]),        
])
```
As the lexer has now reached the end of the expression and there are no further tokens to be added, a finalizeExpression
method is called which removes any tokens still on the stack (in this case the ConditionalToken) and adds it to the 
resulting token list. These are then returned to the SLOPProcessor and can either be serialized to a String or File or
passed to the Parser for evaluation and resolution.

## Additional Grammar / Pattern Flags
In the above section we have covered how pattern tokens are used by the Lexer to keep track of where in the statement 
read tokens belong. There are several grammar flags which cause this flow to be disrupted or change. The first of these
is the '+' flag which can be applied to any Grammar Group in a String. For example, taking the FieldToken pattern we
can see this being used to represent a repeating pattern:
```bash
( val ( '[' expr ']' )? '.'? )+
```
The entire pattern is wrapped in a parent grammar group which can be repeated one or more times (denoted by the following 
'+' character). Inside is a 'val' representing a single value capture group with an optional following grammar group 
(denoted by the following '?') with a set of square brackets surrounding an expression capture group. Finally this is 
followed by an optional syntax period character ('.'). If we provide some examples it should become clear as to the
values it is trying to capture:
```
object.field
object.collection[0].field
object.map["value" + 1]
```
As can be seen some of the examples have index / key references whilst others do not. This is where the '?' tokens allows
optional values to be captured. Going further we can split the middle example up to the following:
```
object.
collection[0].
field
```
Each one represents an individual capture event of the repeated grammar group pattern defined above. Likewise, each one
will be captured in its own TokenGroup. Let's then start running over the above example and see how the pattern tokens
are structured and see how the Lexer handles them. The grammar lexer will output the following pattern tokens onto the
FieldToken when SLOP is initialised:
```
GrammarGroup(position = 0, multiple = true, tokens = [
    GrammarValue(capture = true),
    GrammarGroup(position = 0, optional = true, tokens = [
        GrammarValue('['),
        GrammarExpression(),
        GrammarValue(']'),
    ]),
    GrammarValue(value = '.', optional = true)
])
```
Reading the expression String 'object.collection[0].field', the first read token is a TokenValue('object') and so far
no match occurs is found in our pattern as it is too generic. Keep in mind that a match only happens if an identifying 
tag (typically syntax) is read. The next token however is a match for the '.' found following the optional grammar group.
This may seem a bit odd as we have skipped the entire second GrammarGroup, but keep in mind the Lexer will only apply 
strict matching if it is required. As this is optional, it skipped ahead and looked for a matching token which it found 
in the optional GrammarValue('.'). Upon finding this match, a new instance of the FieldToken is added to the top of the
stack and TokenValue('object') is added into a TokenGroup.

The position of the group is then set to the position after the '.' which in this case exceeds the number of pattern 
tokens in the group. A check is triggered and since the group supports multiple occurances, it's position and all
contained group positions are reset back to their initial positions. At this stage the state of the stack looks like
the following:
```
[== Stack ==]
FieldToken(tokens = [
    TokenGroup(tokens = [    
        TokenValue('object')  
    ])  
])
```
The next token is another TokenValue('collection') which gets added to the short term memory list of tokens. This is used
to store recently read tokens which we're not quite sure what to do with yet. The next token is a TokenValue('[') which
triggers a match in the FieldToken on the stack but for a different reason than the previous. On this occasion instead 
of skipping over the optional group it has found a match in the starting syntax token. Looking at the pattern tokens
again we can see how the positions are updated to reflect this:
```
GrammarGroup(position = 1, multiple = true, tokens = [
    GrammarValue(capture = true),
    GrammarGroup(position = 1, optional = true, tokens = [
        GrammarValue('['),
        GrammarExpression(),
        GrammarValue(']'),
    ]),
    GrammarValue(value = '.', optional = true)
])
```
The current active pattern token is a grammar expression and will be used to capture any tokens found within the square
brackets. In our case it is just a single IntegerToken(0) and after the subsequent closing TokenValue(']') is read, the
stack looks like the following:
```
[== Stack ==]
FieldToken(tokens = [
    TokenGroup(tokens = [
        TokenGroup(tokens = [    
            TokenValue('object')  
        ]),
        TokenGroup(tokens = [    
            TokenValue('collection'),
            TokenGroup(tokens = [
                IntegerToken(0)
            ])  
        ])
    ])        
])
```
The pattern tokens with their positions are the following:
```
[== Pattern Tokens ==]
GrammarGroup(position = 2, multiple = true, tokens = [
    GrammarValue(capture = true),
    GrammarGroup(position = 3, optional = true, tokens = [
        GrammarValue('['),
        GrammarExpression(),
        GrammarValue(']'),
    ]),
    GrammarValue(value = '.', optional = true)
])
```
The current active token is pointing to the GrammarValue('.') which is the next token read by the Lexer. Again the
position is updated and the group is marked as complete, a check is performed to determine whether it can be captured
multiple times (which it can) and again the position of the group reset.

Finally we are on the last iteration through the FieldToken with the last remaining token being read which is a 
GrammarValue('field'). In this case though we have no clear closing syntax as fields are not followed by a '.'. This
is where the Lexer has to use a bit of deductive reasoning which differs depending on the scenario. In our case we
have a single value and the end of the expression was met. As such, it is a safe bet to add it to the top stack 
item. If we had the following scenario however:
```
object.collection[0].field * 40
```
The Lexer would then look at the top item in the stack and the following tokens to make a best guess. In this situation
the FieldToken does support a single TokenValue and is a valid match against the tokens pattern. Since that has a higher
probability of a match rather than existing as a single TokenValue between the statement and an Operator / Integer token, 
again it is safe to assume that it can be added to that item.

This covers the process by which the Lexer matches tokens against statements using pattern tokens and how it deals with 
the different types of grammar flags. As mentioned previously, this information is not strictly required for writing your
own statements, but it is useful to understand why tokens are organised into the groups they are and the mechanism used
to facilitate this.

**NOTE**: Although not covered here, when a grammar group is marked to capture multiple sets of tokens (as above), if 
it is found that the group is in its reset state (complete) but a following token after that group triggers a match, 
the token position will be moved to that location to avoid being stuck in an endless cycle of repetitions. The lexer 
uses intelligent look ahead in this scenario.