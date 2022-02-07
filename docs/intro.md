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

This is where the idea for SLOP first came about by using the best aspects of each. Work was started on the project 
with the following goals:
1. Expressions will be defined as Strings which can be stored / executed anywhere
2. Make every aspect of SLOP configurable / changeable
3. Facilitate the use of the underlying language through functions and native calls
4. Implement an easy to use grammar system to define own statements
5. Each extension to the language must exist in a single easy to define class

The total project time so far has taken 6 months and would now consider it complete from a code perspective, but am 
always looking out for ways to improve it. As a Java developer, I always find myself asking the question "why is this 
statement limited to this?". Now with the ability to write my own statements that restriction has been lifted and
yours can too.

The project is far from being done as at the time of writing I am still looking to write the sample projects and
finish off the documentation. I have split this into several different sections covering the basics all the way 
through to writing your own statements. I always find it difficult to strike a balance between being too technical 
and too simple. In any case I would welcome any feedback, questions or issues you may have.