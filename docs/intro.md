---
sidebar_position: 1
---

# Introduction
The idea for SLOP came from a need to create a cost effective method of generating documents from templates. These 
templates would hold field references which when run through a processor would resolve all known values. Initially 
the concept was simple but soon functionality was added to handle collections, maps and eventually basic conditionals. 
The implementation for this used regular expressions and a form of on-the-fly tokenization to resolve values. A big 
shift came when a request to calculate these values together was made. Due to the restrictive nature of the current 
implementation contained in a class called FieldProcessor, a second class was added called FieldCalculator but the two 
remained very much separate entities.

This is where the idea for SLOP first came about by firstly trying to merge both but also adapting the best aspects 
from each. Work soon commenced and I set the project the following goals:
1. Expressions will be restricted to a single line (hence the name) and stored as Strings
2. Every aspect of SLOP must be configurable
3. Facilitate the use of the underlying language through functions and native calls
4. Implement an easy to use grammar system to define own statements
5. Each extension to the language must exist in a single easy to define class

I won't go into too much depth about the process I went through to achieve this, but suffice to say the project went
through 7 or 8 re-writes to reach it's present form. The total project time has taken 6 months from inception to what 
I now consider it to be functionally complete. As a Java developer, I always find myself asking the question "why is 
this statement limited to just this?" or "why can't it do that?". Now with the ability to write my own statements, 
that restriction has been lifted and now yours can too. With statements like the switch I find I'm even writing them
in a SLOP statement to avoid lengthy Java conditionals!

The project is far from being done as at the time of writing I am still looking to write the sample projects and
finish off writing the documentation. I have split this into several different sections covering the basics all the 
way through to writing your own statements. I always find it difficult to strike a balance between being too technical 
and simple. As such, if you do have any feedback, questions or issues I would more than welcome them.