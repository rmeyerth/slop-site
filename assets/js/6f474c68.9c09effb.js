"use strict";(self.webpackChunkslop_site=self.webpackChunkslop_site||[]).push([[5139],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(n),d=a,m=u["".concat(l,".").concat(d)]||u[d]||h[d]||o;return n?r.createElement(m,i(i({ref:t},c),{},{components:n})):r.createElement(m,i({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9278:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:1},i="Design Approach",s={unversionedId:"Extending/design-approach",id:"Extending/design-approach",title:"Design Approach",description:"All literals and statements must extend the Token class in order for it to be used by SLOP. Let's take a look at an",source:"@site/docs/Extending/design-approach.md",sourceDirName:"Extending",slug:"/Extending/design-approach",permalink:"/slop-site/docs/Extending/design-approach",draft:!1,editUrl:"https://gitlab.com/tronied/slop/docs/Extending/design-approach.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Chained Expressions",permalink:"/slop-site/docs/Language/Extra Features/chained-expressions"},next:{title:"Grammar",permalink:"/slop-site/docs/Extending/grammar"}},l={},p=[],c={toc:p};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"design-approach"},"Design Approach"),(0,a.kt)("p",null,"All literals and statements must extend the Token class in order for it to be used by SLOP. Let's take a look at an\nexample with the LongToken class:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},'@NoArgsConstructor\npublic class LongToken extends Token<Long> {\n    public LongToken(Long value) {\n        super("Long", value);\n    }\n\n    @Override\n    public PatternType getPatternType() {\n        return PatternType.REGEX;\n    }\n\n    @Override\n    public String getPattern() {\n        return "^(-?[0-9]+)L";\n    }\n\n    @Override\n    public List<Token<?>> process(SLOPParser parser, SLOPContext context, SLOPConfig config) {\n        return Collections.singletonList(this);\n    }\n\n    @Override\n    public Token<Long> createToken(String value) {\n        return new LongToken(Long.parseLong(value));\n    }\n}\n')),(0,a.kt)("p",null,"The first thing to notice is that the Token class takes a type. This represents the type that the token is going to\nstore. For literals this will be the underlying language type matching the one we want to represent e.g. Long,\nInteger, String, Float, Double etc. In this case we pass it 'Long' which will determine the type of the value to\nwhich a value (read from the expression String) gets stored. This can be retrieved at any time using the Token.getValue()\nmethod."),(0,a.kt)("p",null,"Each token class must implement several methods which are getPatternType, getPattern, process and createToken. These\nare described below:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"getPatternType"),": Returns a PatternType to determine whether to match against a regular expression or a Grammar\nexpression pattern."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"getPattern"),": Defines the pattern as determined by the value given in the getPatternType method. This could either\nbe a regular expression or Grammar expression pattern. For more information on grammar patterns please see the\n",(0,a.kt)("a",{parentName:"li",href:"#grammar"},"Grammar")," section for more information."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"process"),": This method returns the resulting value for the token which is returned to the Parser. In the case of a\nliteral this is simply the token itself as all values must be returned in a Collection of Token<?>. For statements,\nthis method would contain code to evaluate conditions, process child tokens and calculate the result to return (See\n",(0,a.kt)("a",{parentName:"li",href:"#adding-statements"},"Adding Statements"),")."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"createToken"),": This method gets invoked by the Lexer when the pattern (either regular expression or grammar) is\nmatched. The method parameter value extracted directly from the expression String and will need to be cast to the\nrelevant type. This is then passed to the new instance of the Token via the constructor.")),(0,a.kt)("p",null,"Another important aspect is the definition of the Token's constructor which must call the superclass constructor\nwith the passed parameter value. This is so that upon creation, the internal value variable is set and all relevant\nresources are initialised. "),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"NOTE"),": This documentation will not go into any detail on how to write regular expressions. There are however many\nhelpful guides and tools on the web to get started. One I can recommend and use frequently myself is\n",(0,a.kt)("a",{parentName:"p",href:"https://www.regexr.com",title:"Learn Regular Expressions"},"regexr")," but am not in any way affiliated with this site."))}u.isMDXComponent=!0}}]);