"use strict";(self.webpackChunkslop_site=self.webpackChunkslop_site||[]).push([[6895],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>b});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=r.createContext({}),u=function(e){var t=r.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=u(a),m=n,b=c["".concat(s,".").concat(m)]||c[m]||d[m]||i;return a?r.createElement(b,l(l({ref:t},p),{},{components:a})):r.createElement(b,l({ref:t},p))}));function b(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,l=new Array(i);l[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[c]="string"==typeof e?e:n,l[1]=o;for(var u=2;u<i;u++)l[u]=a[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},8292:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>c,frontMatter:()=>i,metadata:()=>o,toc:()=>u});var r=a(7462),n=(a(7294),a(3905));const i={sidebar_position:7},l="Variables",o={unversionedId:"Language/Statements/variables",id:"Language/Statements/variables",title:"Variables",description:"Variables at present are classified as statements because they are matched and processed using the Grammar system.",source:"@site/docs/Language/Statements/variables.md",sourceDirName:"Language/Statements",slug:"/Language/Statements/variables",permalink:"/docs/Language/Statements/variables",draft:!1,editUrl:"https://gitlab.com/tronied/slop/docs/Language/Statements/variables.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"Field",permalink:"/docs/Language/Statements/field"},next:{title:"Saving / Loading Lexer Output",permalink:"/docs/Language/Extra Features/save-load-lexer-output"}},s={},u=[{value:"Fibonacci Example Breakdown",id:"fibonacci-example-breakdown",level:4}],p={toc:u};function c(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"variables"},"Variables"),(0,n.kt)("p",null,"Variables at present are classified as statements because they are matched and processed using the Grammar system.\nThey currently have limited ability aside from being set and read from the context. To set a value you simply define\na name with an equals and the value e.g."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"myValue = 12\n")),(0,n.kt)("p",null,"To reference that value, you wrap it in curly brackets with a question mark prefix before the name e.g."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"result = myValue * 4\n")),(0,n.kt)("p",null,"At previously mentioned, the increment (++) and decrement (--) operators are not currently supported for modifying\nvariable values. This is because it needs Parser support to be added to modify context values directly. Support will\nbe added for this in a future release. If you do want to increment the value of a variable, you will need to reference\nit in the operation and store it back to itself e.g."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"myValue = myValue + 1\n")),(0,n.kt)("p",null,"Variables can be used in Chained Expressions or statements which support multiple expressions. For example, when\nusing the repeat statement you can declare and share values between them in a left-to-right direction. "),(0,n.kt)("h4",{id:"fibonacci-example-breakdown"},"Fibonacci Example Breakdown"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"[a = 0,b = 1] + repeat(i++,0,<10) result = a + b; a = b; b = result;\n")),(0,n.kt)("p",null,"This may appear confusing upon first reading, but let's break it down. Firstly an initial array of ","[0,1]"," is\ndeclared, but each array item value is assigned to two variables (a and b). This is because when you assign something\nto a variable, it's value is also returned. We add this array to the result of the next statement (repeat loop) which\nalso returns an array of values. The repeat statement loops 10 times and has 3 sections separated by a ';' character."),(0,n.kt)("p",null,"If you're familiar with the fibonacci sequence then this will be fairly explanatory, but if not I'll describe each\nsection below:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("inlineCode",{parentName:"li"},"result = a + b")," - Stores the result of the a and b variables into the result variable. On the first pass\nit will be 0 + 1"),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("inlineCode",{parentName:"li"},"a = b")," - Sets what is in the b variable (1 on first pass) to the a variable. At this state both a and b are 1"),(0,n.kt)("li",{parentName:"ol"},(0,n.kt)("inlineCode",{parentName:"li"},"b = result")," - b variable becomes the value of result (1)")),(0,n.kt)("p",null,"With each pass we can see the following values assigned:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"a = 0, b = 1, result = 1"),(0,n.kt)("li",{parentName:"ol"},"a = 1, b = 1, result = 2"),(0,n.kt)("li",{parentName:"ol"},"a = 1, b = 2, result = 3"),(0,n.kt)("li",{parentName:"ol"},"a = 2, b = 3, result = 5"),(0,n.kt)("li",{parentName:"ol"},"a = 3, b = 5, result = 8"),(0,n.kt)("li",{parentName:"ol"},"etc...")),(0,n.kt)("p",null,"The repeat loop uses each result variable from each iteration to return in an array of values. If we append those to the\ninitial array we then get ",(0,n.kt)("inlineCode",{parentName:"p"},"[0,1,1,2,3,5,8...]")))}c.isMDXComponent=!0}}]);