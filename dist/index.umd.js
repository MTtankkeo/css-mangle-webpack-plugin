!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).CSSMangleWebpackPlugin={})}(this,(function(e){"use strict";var t;class n{constructor(){this.count=0,this.cache=new Map}createIdentifierName(e=this.count++){let n="",r=t.letterCases.length;for(;e>=0&&(n=t.letterCases[e%r]+n,e>0);)e=Math.floor(e/r)-1;return n}transform(e){let t=this.cache.get(e);return t?(t.referenceCount+=1,t.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createIdentifierName(),referenceCount:0}),this.cache.get(e).identifierName)}get unused(){return Array.from(this.cache.values()).filter((e=>0==e.referenceCount))}CSSVariableOf(e,t=!1){return this.cache.get(e)||t?`--${this.transform(e)}`:null}CSSPropertyOf(e,t){return this.cache.get(e=t+e)?`${t}${this.transform(e)}`:null}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.unused)console.log(`${e.originalName} is not referenced.`)}}t=n,n.lowerCases="abcdefghijklmnopqrstuvwxyz",n.upperCases="ABCDEFGHIJKLMNOPQRSTUVWXYZ",n.letterCases=t.lowerCases+t.upperCases;class r{constructor(e,t){this.options=e,this.parent=t}}class s{static replaceRange(e,t,n,r){return e.substring(0,t)+r+e.substring(n)}static replacedLength(e,t){return t.length-e.length}}class o{}class a extends o{transform(e,t){const n=[...e.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g),...e.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g)];let r=0;for(const o of n){const n=o[0],a=o.index+r,l=t.parent.transform(n),i=s.replaceRange(e,a,a+n.length,`--${l}`);r+=s.replacedLength(e,i),e=i}return e}}class l extends o{transform(e,t){const n=/((:|::)(?!function\b)[\w-]+([\(\[][\w-]+([~|^$*]?=((".*?")|('.*?')|\d+)(\s[is])?)?[\)\]])?)?/.source,r=`${/([\w-]*(\.|#)?[a-zA-Z0-9_-]+|\*)/.source}${n}`,o=`${`${/(\.|#)[a-zA-Z0-9_-]+/.source}${n}`}(?=\\s*?{|${`((\\s+?${r})|(\\s*?${/[>+~,]/.source}\\s*?${r}))+?`}\\s*?{)`,a=e.matchAll(/(\.|\#)\w+[^]*?{/g);let l=0;for(const n of a){const r=n[0].matchAll(new RegExp(o,"g"));for(const o of r){const r=o[0],a=/^\./.test(r),i=t.parent,c=(a?i.classMangler:i.idMangler).transform(r),d=r.length,u=a?".":"#",p=n.index+o.index+l,f=s.replaceRange(e,p,p+d,u+c);l+=s.replacedLength(e,f),e=f}}return e}}class i{}class c extends i{constructor(e){super(),this.options=e}transform(e,t){const n=this.options.literals?this.transformLiteral(e,t):e;return this.options.property?this.transformProperty(n,t):n}transformLiteral(e,t){const n=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);let r=0;for(const o of n){const n=o.index+r,a=t.parent,l=o[0],i=a.CSSVariableOf(l,t.options.canUndeclared);if(i){const t=s.replaceRange(e,n,n+l.length,i);r+=s.replacedLength(e,t),e=t}}return e}transformProperty(e,t){const n=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let r=0;for(const o of n){const n=o[0].matchAll(/--[\w-]+/g),a=o.index;for(const o of n){const n=a+o.index+r,l=t.parent,i=o[0],c=l.CSSVariableOf(i,t.options.canUndeclared);if(c){const t=s.replaceRange(e,n,n+i.length,c);r+=s.replacedLength(e,t),e=t}}}return e}}class d extends i{transform(e,t){const n=this.transformHTML(e,t);return this.transformObject(n,t)}transformHTML(e,t){const n=e=>new RegExp(`(?<=<[\\w-]+ .*${e}\\s*=\\s*")[\\w\\s-]+(?=".*>)`,"g"),r=e.matchAll(n("class")),o=e.matchAll(n("id")),a=t.parent,l=(e,t,n)=>({name:e[0],index:e.index,prefix:t,mangler:n}),i=[...Array.from(r).map((e=>l(e,".",a.classMangler))),...Array.from(o).map((e=>l(e,"#",a.idMangler)))];for(const t of i){const n=t.name.matchAll(/[\w-]+/g),r=t.index;let o=0;for(const a of n){const n=a[0],l=t.mangler.CSSPropertyOf(n,t.prefix),i=n.length,c=r+a.index+o;if(l){const n=s.replaceRange(e,c,c+i,l.replace(t.prefix,""));o+=s.replacedLength(e,n),e=n}}}return e}transformObject(e,t){const n=e=>new RegExp(`(?<=\\{.*${e}:\\s*['"])[\\w\\s-]+(?=['"].*\\})`,"g"),r=e.matchAll(n("className"));e.matchAll(n("id"));for(const e of r)console.log(e[0]);return e}}class u{}class p extends u{createMangler(){return new n}}class f extends p{constructor(e){super(),this.options=e}createManglerDeclaration(){return new a}createManglerReference(){return new c(this.options)}createContext(){return new r(this.options,this.createMangler())}transform(e){var t;const n=null!==(t=this.context)&&void 0!==t?t:this.createContext(),r=this.createManglerDeclaration().transform(e,n);return this.createManglerReference().transform(r,n)}}class h extends p{createManglerDeclaration(){return new l}createManglerReference(){return new d}createContext(){return new r({reversed:[],canUndeclared:!1},{classMangler:this.createMangler(),idMangler:this.createMangler()})}transform(e){var t;const n=null!==(t=this.context)&&void 0!==t?t:this.createContext(),r=this.createManglerDeclaration().transform(e,n);return this.createManglerReference().transform(r,n)}}e.CSSVariableDeclaration=a,e.CSSVariableReference=c,e.Mangler=n,e.ManglerDeclaration=o,e.ManglerReference=i,e.ManglerTranspiler=u,e.default=class{constructor(e){var t,n,r,s,o,a,l,i,c,d,u,p;if(this.options=e,this.transpilers=[],null!==(t=null==e?void 0:e.mangle)&&void 0!==t&&!t)return;const g=null===(r=null===(n=null==e?void 0:e.mangle)||void 0===n?void 0:n.variableName)||void 0===r||r,m=null!==(o=null===(s=null==e?void 0:e.mangle)||void 0===s?void 0:s.className)&&void 0!==o&&o,v=null!==(l=null===(a=null==e?void 0:e.mangle)||void 0===a?void 0:a.idName)&&void 0!==l&&l,S=null!==(d=null===(c=null===(i=null==e?void 0:e.mangle)||void 0===i?void 0:i.options)||void 0===c?void 0:c.undeclared)&&void 0!==d&&d;!0!==g&&null==g.property&&null==g.literals||this.transpilers.push(new f({reversed:[],canUndeclared:S,property:null===(u=g.property)||void 0===u||u,literals:null===(p=g.literals)||void 0===p||p})),(null!=m&&m||null!=v&&v)&&this.transpilers.push(new h)}apply(e){var t,n,r,s,o,a;const l=!(null!==(n=null===(t=this.options)||void 0===t?void 0:t.ignoreScript)&&void 0!==n&&n),i=null!==(s=null===(r=this.options)||void 0===r?void 0:r.processStage)&&void 0!==s?s:"OPTIMIZE_INLINE",c=null!==(a=null===(o=this.options)||void 0===o?void 0:o.reserved)&&void 0!==a?a:[];e.hooks.compilation.tap("CSSMangleWebpackPlugin",(t=>{t.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:"OPTIMIZE_INLINE"==i?e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE},(n=>{var r,s,o,a;for(const r in n){if(c.find((e=>e==r)))return;if(r.endsWith(".html")||r.endsWith(".js")&&l||r.endsWith(".jsx")&&l||r.endsWith(".css"))for(const s of this.transpilers){const o=n[r].source().toString();t.updateAsset(r,new e.webpack.sources.RawSource(s.transform(o)))}}null!==(s="ALL"==(null===(r=this.options)||void 0===r?void 0:r.printLogs))&&void 0!==s&&s&&this.transpilers.forEach((e=>e.context.parent.forEach((e=>e.printLogs())))),null!==(a="WARNING"==(null===(o=this.options)||void 0===o?void 0:o.printLogs))&&void 0!==a&&a&&this.transpilers.forEach((e=>e.context.parent.forEach((e=>e.printLogsUnused()))))}))}))}},Object.defineProperty(e,"__esModule",{value:!0})}));
