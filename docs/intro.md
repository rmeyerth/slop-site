---
sidebar_position: 1
---

# Introduction
The idea for SLOP came from a need to create a cost effective method of generating documents from templates. These 
templates would hold field references and logic. When run through a processor class it would resolve all known values. 
Initially the concept was simple but soon functionality was added to handle collections, maps and eventually basic 
conditionals. The implementation for this used regular expressions and an on-the-fly tokenization to resolve values. 
A big shift however came a request to add the ability to calculate values together. Due to the restrictive nature of 
the implementation, this split the project into two parts or processing classes. This is where the idea for SLOP first 
came about by firstly the idea of unifying both parts but also adapting the best aspects of each. Work soon commenced 
on this personal project and I gave the project the following goals:
1. Expressions will be restricted to a single line (hence the name) and stored as Strings
2. Every aspect of SLOP must be configurable
3. Facilitate the use of the underlying language through functions and native calls
4. Implement an easy to use grammar system to define statements
5. Extensions to the language must exist in a single easy to define class

I won't go into too much depth about the process I went through to achieve this, but suffice to say the project went
through 7 or 8 re-writes to reach its present form. The total project time has taken 6 months from inception to what 
I now consider to be functionally complete. As a Java developer, I always find myself asking the question "why is 
this statement limited to just this?" or "why can't it do that?". Now with the ability to write my own statements, 
that restriction has been somewhat lifted. With statements like the switch I find I'm even using the SLOP alternatives 
to avoid lengthy Java conditionals!

The project is far from being done as at the time of writing I am still looking to write the sample projects and
finish off writing the documentation. I have split this into several different sections covering the basics all the 
way through to adding your own statements. I always find it difficult to strike a balance between being too technical 
and simple. As such, if you do have any feedback, questions or issues I would more than welcome them.