---
sidebar_position: 1
---

# Design Approach
All literals and statements must extend the Token class in order for it to be used by SLOP. Let's take a look at an 
example with the LongToken class:
```java
@NoArgsConstructor
public class LongToken extends Token<Long> {
    public LongToken(Long value) {
        super("Long", value);
    }

    @Override
    public PatternType getPatternType() {
        return PatternType.REGEX;
    }

    @Override
    public String getPattern() {
        return "^(-?[0-9]+)L";
    }

    @Override
    public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {
        return Collections.singletonList(this);
    }

    @Override
    public Token<Long> createToken(String value) {
        return new LongToken(Long.parseLong(value));
    }
}
```
The first thing to notice is that the Token class takes a type. This represents the type that the token is going to 
store. For literals this will be the underlying language type matching the one we want to represent e.g. Long,
Integer, String, Float, Double etc. In this case we pass it 'Long' which will determine the type of the value to
which a value (read from the expression String) gets stored. This can be retrieved at any time using the Token.getValue()
method.

Each token class must implement several methods which are getPatternType, getPattern, process and createToken. These
are described below:
- **getPatternType**: Returns a PatternType to determine whether to match against a regular expression or a Grammar 
  expression pattern.
- **getPattern**: Defines the pattern as determined by the value given in the getPatternType method. This could either 
  be a regular expression or Grammar expression pattern. For more information on grammar patterns please see the 
  [Grammar](#grammar) section for more information.
- **process**: This method returns the resulting value for the token which is returned to the Parser. In the case of a 
  literal this is simply the token itself as all values must be returned in a Collection of Token<?>. For statements, 
  this method would contain code to evaluate conditions, process child tokens and calculate the result to return (See
  [Adding Statements](#adding-statements)).
- **createToken**: This method gets invoked by the Lexer when the pattern (either regular expression or grammar) is
  matched. The method parameter value extracted directly from the expression String and will need to be cast to the 
  relevant type. This is then passed to the new instance of the Token via the constructor.

Another important aspect is the definition of the Token's constructor which must call the superclass constructor 
with the passed parameter value. This is so that upon creation, the internal value variable is set and all relevant 
resources are initialised. 

**NOTE**: This documentation will not go into any detail on how to write regular expressions. There are however many 
helpful guides and tools on the web to get started. One I can recommend and use frequently myself is 
[regexr](https://www.regexr.com 'Learn Regular Expressions') but am not in any way affiliated with this site.