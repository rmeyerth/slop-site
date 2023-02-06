"use strict";(self.webpackChunkslop_site=self.webpackChunkslop_site||[]).push([[1924],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=s(n),d=a,f=u["".concat(c,".").concat(d)]||u[d]||m[d]||o;return n?r.createElement(f,l(l({ref:t},p),{},{components:n})):r.createElement(f,l({ref:t},p))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i[u]="string"==typeof e?e:a,l[1]=i;for(var s=2;s<o;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3292:(e,t,n)=>{n.r(t),n.d(t,{contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={hide_table_of_contents:!0},l=void 0,i={type:"mdx",permalink:"/quick-start",source:"@site/src/pages/quick-start.md",description:"Quick Start",frontMatter:{hide_table_of_contents:!0}},c=[{value:"Quick Start",id:"quick-start",level:2}],s={toc:c};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"quick-start"},"Quick Start"),(0,a.kt)("p",null,"Create a new project declaring the following dependency in maven:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n  <groupId>dev.slop</groupId>\n  <artifactId>slop-core</artifactId>\n  <version>1.35</version>\n</dependency>\n")),(0,a.kt)("p",null,"or gradle:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-groovy"},"implementation 'dev.slop:slop-core:1.35'\n")),(0,a.kt)("p",null,"Add a new Java class with the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"public static void main(String[] args) {\n    int result = SLOPProcessor.processStatic('(1 + 1) * 4').getValue(Integer.class);\n    System.out.println(\"Result: \" + result);\n}\n")),(0,a.kt)("p",null,"Run the application:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"Result: 8\n")),(0,a.kt)("p",null,"Alternatively for something a bit more ambitious:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'public static void main(String[] args) {\n    List<Integer> result = SLOPProcessor.processStatic(\n            "[a = 0,b = 1] + repeat(i++,0,<10) result = a + b; a = b; b = result;"\n        ).getValue(List.class);\n    System.out.println(String.format("Result: [%s]",\n        result.stream().map(Object::toString).collect(Collectors.joining(", "))));\n}\n')),(0,a.kt)("p",null,"This will print the fibonacci sequence up to 12 places:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"Result: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]\n")),(0,a.kt)("p",null,"...and that's it! If you'd like to see a detailed breakdown of this expression, please look ",(0,a.kt)("a",{parentName:"p",href:"/docs/Language/Statements/variables#fibonacci-example-breakdown"},"here"),". "),(0,a.kt)("p",null,"These are a couple of simple examples to get you started, but please take a look at the documentation section to\ndiscover more of SLOP's features, sample projects and even how to extend it yourself. If however you're new to expression\nlanguages or have a nagging question running through your head, please check out the ",(0,a.kt)("a",{parentName:"p",href:"/why"},"why?")," page."))}p.isMDXComponent=!0}}]);