---
hide_table_of_contents: true
---

## Quick Start
Create a new project declaring the following dependency in maven:
```xml
<dependency>
  <groupId>dev.slop</groupId>
  <artifactId>slop-core</artifactId>
  <version>1.0</version>
</dependency>
``` 
or gradle:
```groovy
implementation 'dev.slop:slop-core:1.0'
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
    SLOPProcessor processor = new SLOPProcessor();
    SLOPContext context = new SLOPContext();
    context.set("first", 0);
    context.set("second", 1);
    List<?> result = processor.process(
        "[0,1] + repeat(i++,0,<10) result = {?first} + {?second}; first = {?second}; second = {?result};", 
            context).getValue(List.class);
    System.out.println(String.format("Result: [%s]",
            result.stream().map(Object::toString).collect(Collectors.joining(", "))));
}
```
This will print the fibonacci sequence up to 12 places:
```bash
Result: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```
...and that's it! These are simple examples to get you started, but please take a look at the documentation section to 
discover more of SLOP's features, sample projects and even how to extend it yourself. 