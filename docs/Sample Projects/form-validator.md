---
sidebar_position: 6
---


# Form Validation
By using a custom annotation on DTO object fields and by using a REST endpoint which accepts a payload from the F/E, complex
validation rules could be enforced. For example, you could have the following:

```java
@Data
public class Employee {
    
    private JobType title;

    @Validation("emp.dept != null and emp.dept == HUMAN_RESOURCES and " +
                "(emp.title != CONSTRUCTION_WORKER or emp.title != BUILDING_MAINTENANCE)")
    private Department dept;
}
```
This is a crude example, but you can validate the currently payload as it is entered into the F/E and if any of the rules 
evaluate to false, it could flag up the issue. We could even return a detailed message as to why it is not valid.