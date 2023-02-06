"use strict";(self.webpackChunkslop_site=self.webpackChunkslop_site||[]).push([[1520],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>h});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var i=a.createContext({}),p=function(e){var n=a.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},u=function(e){var n=p(e.components);return a.createElement(i.Provider,{value:n},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,i=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(t),m=o,h=c["".concat(i,".").concat(m)]||c[m]||d[m]||r;return t?a.createElement(h,l(l({ref:n},u),{},{components:t})):a.createElement(h,l({ref:n},u))}));function h(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,l=new Array(r);l[0]=m;var s={};for(var i in n)hasOwnProperty.call(n,i)&&(s[i]=n[i]);s.originalType=e,s[c]="string"==typeof e?e:o,l[1]=s;for(var p=2;p<r;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8027:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>l,default:()=>c,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var a=t(7462),o=(t(7294),t(3905));const r={slug:"release",title:"SLOP 1.35 Release",authors:["tronied"],tags:["slop"]},l=void 0,s={permalink:"/slop-site/blog/release",editUrl:"https://gitlab.com/tronied/slop/blog/2023-01-27-release/index.md",source:"@site/blog/2023-01-27-release/index.md",title:"SLOP 1.35 Release",description:"After working hard for the last couple of weeks, I am pleased to announce that SLOP 1.35 has been",date:"2023-01-27T00:00:00.000Z",formattedDate:"January 27, 2023",tags:[{label:"slop",permalink:"/slop-site/blog/tags/slop"}],readingTime:6.245,hasTruncateMarker:!1,authors:[{name:"Robert Meyer",title:"Developer of SLOP",url:"https://gitlab.com/tronied",imageURL:"https://www.rllmukforum.com/uploads/av-90.png",key:"tronied"}],frontMatter:{slug:"release",title:"SLOP 1.35 Release",authors:["tronied"],tags:["slop"]}},i={authorsImageUrls:[void 0]},p=[{value:"Variables",id:"variables",level:3},{value:"Collection Filters",id:"collection-filters",level:3},{value:"Static Referencing",id:"static-referencing",level:3},{value:"Unary Operator",id:"unary-operator",level:3},{value:"Syntax Validation",id:"syntax-validation",level:3},{value:"LinkedHashMap Support",id:"linkedhashmap-support",level:3},{value:"Closing Comments",id:"closing-comments",level:3}],u={toc:p};function c(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"After working hard for the last couple of weeks, I am pleased to announce that SLOP 1.35 has been\nreleased. There have been numerous fixes and changes since the last version. I will list a few of\nthem below:"),(0,o.kt)("h3",{id:"variables"},"Variables"),(0,o.kt)("p",null,"Referencing variable tags i.e. ",(0,o.kt)("inlineCode",{parentName:"p"},"{?myVariable}")," has now been replaced with their regular name equivalents\ne.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"myVariable"),". As such, you can now perform assignments and references using the same tag:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"> myVariable = 12\nResult: 12\n> myVariable\nResult: 12\n> newVariable = myVariable - 4\nResult: 8\n")),(0,o.kt)("p",null,"For comparison, here is the original fibonacci example (see ",(0,o.kt)("a",{parentName:"p",href:"/docs/Language/Statements/variables#fibonacci-example-breakdown"},"here")," for more details):"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"[a = 0,b = 1] + repeat(i++,0,<10) result = {?a} + {?b}; a = {?b}; b = {?result};\n")),(0,o.kt)("p",null,"This is now replaced with the simpler definition:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"[a = 0,b = 1] + repeat(i++,0,<10) result = a + b; a = b; b = result;\n")),(0,o.kt)("p",null,"Please be aware that variables are case-sensitive, so you must use the same case when referencing. "),(0,o.kt)("h3",{id:"collection-filters"},"Collection Filters"),(0,o.kt)("p",null,"Conditional filtering can now be done using the collections index section. Using the following example,\nthe context is initialised with a sample company and employees. There is also an array of top earners\nthat we'll reference later:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'private static Company sampleCompany() {\n    Company company = new Company();\n    company.getEmployees().add(Employee.builder()\n            .employeeId("EMP1").payrollId(123).name("Bob").age(37).build());\n    company.getEmployees().add(Employee.builder()\n            .employeeId("EMP2").payrollId(321).name("Sharon").age(54).build());\n    company.getEmployees().add(Employee.builder()\n            .employeeId("EMP3").payrollId(789).name("Mike").age(49).build());\n    company.getEmployees().add(Employee.builder()\n            .employeeId("EMP4").payrollId(987).name("Anna").age(25).build());\n    company.getTopEarners().add(321);\n    company.getTopEarners().add(987);\n    return acme;\n}\n\npublic static void main(String[] args) {\n    //Create and initialise context\n    SLOPContext context = new SLOPContext();\n    context.set("acme", sampleCompany());\n    //Create config and allow unsafe operations\n    SLOPConfig config = new SLOPConfig();\n    config.setProperty(DefaultProperty.SAFE_OPERATIONS, false);    \n    SLOPProcessor processor = new SLOPProcessor(config);\n    //Use passed parameter to the app and print result\n    System.out.println(String.format("Result: %s", \n        processor.processStatic(args[0], context));\n}\n')),(0,o.kt)("p",null,"Traditionally, if you wanted to filter and map collection items, you would have to use a loop in your\nexpression:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"foreach (emp : acme.employees) if (emp.age < 40) result = emp.name;\n")),(0,o.kt)("p",null,"You can now remove the loop entirely by using the following:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"acme.employees[^~age < 40].name\n")),(0,o.kt)("p",null,"Both of the above provide the following result:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"Result: ['Bob', 'Anna']\n")),(0,o.kt)("p",null,"The initial '^' character flags up to the Parser that this is using condition criteria rather than\na standard integer index. The '~' character denotes that any field reference following it should be\ntaken from the item being iterated in the collection. You have free-reign over how you define conditions\nso long as they evaluate to booleans. This includes the use of logical operators, for example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"acme.employees[^acme.topEarners.contains(~payrollId) and ~name.startsWith('S')]\n")),(0,o.kt)("p",null,"As we're not defining a field, this would output the entire matched object:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"Result: Employee(employeeId='EMP2', payrollId=321, name='Sharon', age=54)\n")),(0,o.kt)("p",null,"In the expression above we're using the collection native call contains() on the topEarners list to filter to\nthose employees that have a matching payroll ID. Second to this, a second native call startsWith() is\nused to filter names beginning with an 'S'. This results in Sharons employee object being returned. If we wanted\nto fetch this object in its Java native form, we would use:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"Employee result = processor.process(args[0], context).getValue(Employee.class);\n")),(0,o.kt)("h3",{id:"static-referencing"},"Static Referencing"),(0,o.kt)("p",null,"You can now add references to enums and static class methods via a new include() method in the\nconfiguration object. Let's see this in action by adding an enum we want to reference:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'SLOPConfig config = new SLOPConfig();\nconfig.include("testEnum", "dev.slop.enums.TestEnum");\n')),(0,o.kt)("p",null,"For reference this enum has the following definition:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"package dev.slop.enums;\n\npublic enum TestEnum {\n    VALUE_A(1),\n    VALUE_B(2),\n    VALUE_C(3);\n\n    private int value;\n\n    TestEnum(int value) {\n        this.value = value;\n    }\n\n    public int getValue() {\n        return this.value;\n    }\n}\n")),(0,o.kt)("p",null,"We can now reference a value within the enum by using the '#' symbol. For example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"(#testEnum.VALUE_A.value + 124) / 4\n")),(0,o.kt)("p",null,"Would result in:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"Result: 31\n")),(0,o.kt)("p",null,"We can now also reference enums within another class by using the '$' character. For example, using\nthe same enum but located within another class, first we include the reference:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'config.include("testClass", "dev.slop.model.TestClass");\n')),(0,o.kt)("p",null,"With the following defined class but the same enum:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"package dev.slop.model;\n\npublic class TestClass {\n    public enum TestEnum {\n        ...\n    }\n}\n")),(0,o.kt)("p",null,"We can perform the following for the same result:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"(#testClass.$TestEnum.VALUE_A.value + 124) / 4\n")),(0,o.kt)("h3",{id:"unary-operator"},"Unary Operator"),(0,o.kt)("p",null,"This was an oversight on my part and now have happily added the ability to use '!' in front of a Boolean\nvalue or expression to negate it. This works in exactly the same way as other languages e.g."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"> !(3 > 4)\nResult: true\n> !!(3 > 4)\nResult: false\n> !(!(3 > 4) == 4 > 3)\nResult: false\n")),(0,o.kt)("h3",{id:"syntax-validation"},"Syntax Validation"),(0,o.kt)("p",null,"This has been included since the last version (1.32) but I did not document it. If you type a statement\nand make a mistake, it will show an error and highlight the problem and location:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"> repeat(i++;0;<10) result = i + 1;\n\ndev.slop.exception.LexerException: Expected token ',' in RepeatToken but expression ended prematurely. \n----------------------------------------------------------------\n- Guidance: A repeat statement requires 3 parts of the iteration to be defined and separated by a ',' \n            character e.g. repeat ( i++, 0, <10 ) ...\n- Last Read Tokens: 'result','=','i','+','1'\n- Expression: repeat(i++;0;<10) result = i + 1;\n----------------------------------------------------------------\n")),(0,o.kt)("p",null,"In the above example, we have mistakenly used semi-colons instead of commas when defining the repeat\nloop. It is showing that it expected the token ',' and will provide guidance where it thinks you have\ngone wrong. This is now implemented by all statements and in case you are looking to add this to your\nown tokens, this occurs by overriding the following method in your Token class:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'@Override\npublic Optional<String> getGuidance(String expected, List<Integer> groupsCount) {\n    if (expected.equalsIgnoreCase(","))\n        return Optional.of("A repeat statement requires 3 parts of the iteration to be defined and " +\n            "separated by a \',\' character e.g. repeat ( i++, 0, <10 ) ...");\n    ...\n}\n')),(0,o.kt)("h3",{id:"linkedhashmap-support"},"LinkedHashMap Support"),(0,o.kt)("p",null,"SLOP now supports the use of LinkedHashMap's. The reason for this may not be clear unless you are\nfamiliar with JSON and use it frequently in serialisation / de-serialisation. What this allows you\nto do for example is create a POST REST endpoint that allows unstructured JSON payloads to be pushed.\nThis can be serialised into a LinkedHashMap and passed directly into the SLOP context to act like a\nnormal model object. This means you don't have to have the class definition or DTO's on the classpath\nto use them in SLOP expressions. Once added they work in exactly the same way as normal objects allowing\nSLOP to work independently of additional code dependencies."),(0,o.kt)("h3",{id:"closing-comments"},"Closing Comments"),(0,o.kt)("p",null,"There are many other changes and bug fixes I have made, but without turning this into war and peace I\nwill end it here. I realise some of the documentation is now out of date now and will endeavour\nto update this in due course. I am still hard at work on my side project which uses SLOP, with many of\nthe changes and improvements coming from that. There is still so much I want to do and have a lot\nplanned in the coming months. One of these is the ability to assign values to tokens. The majority of\ntokens will remain immutable as it makes no sense to assign values to them, but certain ones like\nthe ability to modify values within the structure of a context object or collection are on my radar."),(0,o.kt)("p",null,"As always, if you have any feedback, questions or concerns please email me at ",(0,o.kt)("a",{parentName:"p",href:"mailto:rmeyer@hotmail.co.uk"},"rmeyer@hotmail.co.uk"),"\nor head on over to the board ",(0,o.kt)("a",{parentName:"p",href:"https://slop.boards.net"},"here"),"."))}c.isMDXComponent=!0}}]);