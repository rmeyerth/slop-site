---
hide_table_of_contents: true
---

## Quick Start
Create a new project declaring the following dependency in maven:
```xml
<dependency>
  <groupId>dev.slop</groupId>
  <artifactId>slop-core</artifactId>
  <version>1.2</version>
</dependency>
``` 
or gradle:
```groovy
implementation 'dev.slop:slop-core:1.2'
```
Add a new Java class with the following:
```java
public static void main(String[] args) {
    int result = SLOPProcessor.processStatic("(1 + 1) * 4").getValue(Integer.class);
    System.out.println("Result: " + result);
}
```
Run the application:
```bash
Result: 8
```
Alternatively for something a bit more ambitious:
```java
public static void main(String[] args) {
    List<Integer> result = SLOPProcessor.processStatic(
            "[a = 0,b = 1] + repeat(i++,0,<10) result = {?a} + {?b}; a = {?b}; b = {?result};"
        ).getValue(List.class);
    System.out.println(String.format("Result: [%s]",
        result.stream().map(Object::toString).collect(Collectors.joining(", "))));
}
```
This will print the fibonacci sequence up to 12 places:
```bash
Result: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```
...and that's it! If you'd like to see a detailed breakdown of this expression, please look [here](/docs/Language/Statements/variables#fibonacci-example-breakdown). 

These are a couple of simple examples to get you started, but please take a look at the documentation section to 
discover more of SLOP's features, sample projects and even how to extend it yourself. If however you're new to expression 
languages or have a nagging question running through your head, please check out the [why?](/why) page.