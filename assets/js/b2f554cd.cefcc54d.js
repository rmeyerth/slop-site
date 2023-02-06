"use strict";(self.webpackChunkslop_site=self.webpackChunkslop_site||[]).push([[1477],{10:e=>{e.exports=JSON.parse('{"blogPosts":[{"id":"release","metadata":{"permalink":"/blog/release","editUrl":"https://gitlab.com/tronied/slop/blog/2023-01-27-release/index.md","source":"@site/blog/2023-01-27-release/index.md","title":"SLOP 1.35 Release","description":"After working hard for the last couple of weeks, I am pleased to announce that SLOP 1.35 has been","date":"2023-01-27T00:00:00.000Z","formattedDate":"January 27, 2023","tags":[{"label":"slop","permalink":"/blog/tags/slop"}],"readingTime":6.245,"hasTruncateMarker":false,"authors":[{"name":"Robert Meyer","title":"Developer of SLOP","url":"https://gitlab.com/tronied","imageURL":"https://www.rllmukforum.com/uploads/av-90.png","key":"tronied"}],"frontMatter":{"slug":"release","title":"SLOP 1.35 Release","authors":["tronied"],"tags":["slop"]}},"content":"After working hard for the last couple of weeks, I am pleased to announce that SLOP 1.35 has been\\nreleased. There have been numerous fixes and changes since the last version. I will list a few of \\nthem below:\\n### Variables\\nReferencing variable tags i.e. `{?myVariable}` has now been replaced with their regular name equivalents \\ne.g. `myVariable`. As such, you can now perform assignments and references using the same tag:\\n```java\\n> myVariable = 12\\nResult: 12\\n> myVariable\\nResult: 12\\n> newVariable = myVariable - 4\\nResult: 8\\n```\\nFor comparison, here is the original fibonacci example (see [here](/docs/Language/Statements/variables#fibonacci-example-breakdown) for more details):\\n```java\\n[a = 0,b = 1] + repeat(i++,0,<10) result = {?a} + {?b}; a = {?b}; b = {?result};\\n```\\nThis is now replaced with the simpler definition:\\n```java\\n[a = 0,b = 1] + repeat(i++,0,<10) result = a + b; a = b; b = result;\\n```\\nPlease be aware that variables are case-sensitive, so you must use the same case when referencing. \\n### Collection Filters\\nConditional filtering can now be done using the collections index section. Using the following example, \\nthe context is initialised with a sample company and employees. There is also an array of top earners \\nthat we\'ll reference later:\\n```java\\nprivate static Company sampleCompany() {\\n    Company company = new Company();\\n    company.getEmployees().add(Employee.builder()\\n            .employeeId(\\"EMP1\\").payrollId(123).name(\\"Bob\\").age(37).build());\\n    company.getEmployees().add(Employee.builder()\\n            .employeeId(\\"EMP2\\").payrollId(321).name(\\"Sharon\\").age(54).build());\\n    company.getEmployees().add(Employee.builder()\\n            .employeeId(\\"EMP3\\").payrollId(789).name(\\"Mike\\").age(49).build());\\n    company.getEmployees().add(Employee.builder()\\n            .employeeId(\\"EMP4\\").payrollId(987).name(\\"Anna\\").age(25).build());\\n    company.getTopEarners().add(321);\\n    company.getTopEarners().add(987);\\n    return acme;\\n}\\n\\npublic static void main(String[] args) {\\n    //Create and initialise context\\n    SLOPContext context = new SLOPContext();\\n    context.set(\\"acme\\", sampleCompany());\\n    //Create config and allow unsafe operations\\n    SLOPConfig config = new SLOPConfig();\\n    config.setProperty(DefaultProperty.SAFE_OPERATIONS, false);    \\n    SLOPProcessor processor = new SLOPProcessor(config);\\n    //Use passed parameter to the app and print result\\n    System.out.println(String.format(\\"Result: %s\\", \\n        processor.processStatic(args[0], context));\\n}\\n```\\nTraditionally, if you wanted to filter and map collection items, you would have to use a loop in your\\nexpression:\\n```bash\\nforeach (emp : acme.employees) if (emp.age < 40) result = emp.name;\\n```\\nYou can now remove the loop entirely by using the following:\\n```bash\\nacme.employees[^~age < 40].name\\n```\\nBoth of the above provide the following result:\\n```bash\\nResult: [\'Bob\', \'Anna\']\\n```\\nThe initial \'^\' character flags up to the Parser that this is using condition criteria rather than \\na standard integer index. The \'~\' character denotes that any field reference following it should be \\ntaken from the item being iterated in the collection. You have free-reign over how you define conditions\\nso long as they evaluate to booleans. This includes the use of logical operators, for example:\\n```bash\\nacme.employees[^acme.topEarners.contains(~payrollId) and ~name.startsWith(\'S\')]\\n```\\nAs we\'re not defining a field, this would output the entire matched object:\\n```bash\\nResult: Employee(employeeId=\'EMP2\', payrollId=321, name=\'Sharon\', age=54)\\n```\\nIn the expression above we\'re using the collection native call contains() on the topEarners list to filter to \\nthose employees that have a matching payroll ID. Second to this, a second native call startsWith() is \\nused to filter names beginning with an \'S\'. This results in Sharons employee object being returned. If we wanted \\nto fetch this object in its Java native form, we would use:\\n```java\\nEmployee result = processor.process(args[0], context).getValue(Employee.class);\\n```\\n### Static Referencing\\nYou can now add references to enums and static class methods via a new include() method in the \\nconfiguration object. Let\'s see this in action by adding an enum we want to reference:\\n```bash\\nSLOPConfig config = new SLOPConfig();\\nconfig.include(\\"testEnum\\", \\"dev.slop.enums.TestEnum\\");\\n```\\nFor reference this enum has the following definition:\\n```java\\npackage dev.slop.enums;\\n\\npublic enum TestEnum {\\n    VALUE_A(1),\\n    VALUE_B(2),\\n    VALUE_C(3);\\n\\n    private int value;\\n\\n    TestEnum(int value) {\\n        this.value = value;\\n    }\\n\\n    public int getValue() {\\n        return this.value;\\n    }\\n}\\n```\\nWe can now reference a value within the enum by using the \'#\' symbol. For example:\\n```\\n(#testEnum.VALUE_A.value + 124) / 4\\n```\\nWould result in:\\n```bash\\nResult: 31\\n```\\nWe can now also reference enums within another class by using the \'$\' character. For example, using\\nthe same enum but located within another class, first we include the reference:\\n```java\\nconfig.include(\\"testClass\\", \\"dev.slop.model.TestClass\\");\\n```\\nWith the following defined class but the same enum:\\n```java\\npackage dev.slop.model;\\n\\npublic class TestClass {\\n    public enum TestEnum {\\n        ...\\n    }\\n}\\n```\\nWe can perform the following for the same result:\\n```\\n(#testClass.$TestEnum.VALUE_A.value + 124) / 4\\n```\\n### Unary Operator\\nThis was an oversight on my part and now have happily added the ability to use \'!\' in front of a Boolean \\nvalue or expression to negate it. This works in exactly the same way as other languages e.g.\\n```java\\n> !(3 > 4)\\nResult: true\\n> !!(3 > 4)\\nResult: false\\n> !(!(3 > 4) == 4 > 3)\\nResult: false\\n```\\n### Syntax Validation\\nThis has been included since the last version (1.32) but I did not document it. If you type a statement\\nand make a mistake, it will show an error and highlight the problem and location:\\n```java\\n> repeat(i++;0;<10) result = i + 1;\\n\\ndev.slop.exception.LexerException: Expected token \',\' in RepeatToken but expression ended prematurely. \\n----------------------------------------------------------------\\n- Guidance: A repeat statement requires 3 parts of the iteration to be defined and separated by a \',\' \\n            character e.g. repeat ( i++, 0, <10 ) ...\\n- Last Read Tokens: \'result\',\'=\',\'i\',\'+\',\'1\'\\n- Expression: repeat(i++;0;<10) result = i + 1;\\n----------------------------------------------------------------\\n```\\nIn the above example, we have mistakenly used semi-colons instead of commas when defining the repeat\\nloop. It is showing that it expected the token \',\' and will provide guidance where it thinks you have\\ngone wrong. This is now implemented by all statements and in case you are looking to add this to your\\nown tokens, this occurs by overriding the following method in your Token class:\\n```java\\n@Override\\npublic Optional<String> getGuidance(String expected, List<Integer> groupsCount) {\\n    if (expected.equalsIgnoreCase(\\",\\"))\\n        return Optional.of(\\"A repeat statement requires 3 parts of the iteration to be defined and \\" +\\n            \\"separated by a \',\' character e.g. repeat ( i++, 0, <10 ) ...\\");\\n    ...\\n}\\n```\\n### LinkedHashMap Support\\nSLOP now supports the use of LinkedHashMap\'s. The reason for this may not be clear unless you are \\nfamiliar with JSON and use it frequently in serialisation / de-serialisation. What this allows you \\nto do for example is create a POST REST endpoint that allows unstructured JSON payloads to be pushed.\\nThis can be serialised into a LinkedHashMap and passed directly into the SLOP context to act like a \\nnormal model object. This means you don\'t have to have the class definition or DTO\'s on the classpath \\nto use them in SLOP expressions. Once added they work in exactly the same way as normal objects allowing \\nSLOP to work independently of additional code dependencies.\\n\\n### Closing Comments\\nThere are many other changes and bug fixes I have made, but without turning this into war and peace I \\nwill end it here. I realise some of the documentation is now out of date now and will endeavour \\nto update this in due course. I am still hard at work on my side project which uses SLOP, with many of\\nthe changes and improvements coming from that. There is still so much I want to do and have a lot\\nplanned in the coming months. One of these is the ability to assign values to tokens. The majority of \\ntokens will remain immutable as it makes no sense to assign values to them, but certain ones like \\nthe ability to modify values within the structure of a context object or collection are on my radar.\\n\\nAs always, if you have any feedback, questions or concerns please email me at rmeyer@hotmail.co.uk\\nor head on over to the board [here](https://slop.boards.net)."}]}')}}]);