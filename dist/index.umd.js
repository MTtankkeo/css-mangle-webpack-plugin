!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):r((e="undefined"!=typeof globalThis?globalThis:e||self).CSSMangleWebpackPlugin={})}(this,(function(e){"use strict";var r;class t{constructor(){this.count=0,this.cache=new Map}createIdentifierName(e=this.count++){let t="",n=r.letterCases.length;for(;e>=0&&(t=r.letterCases[e%n]+t,e>0);)e=Math.floor(e/n)-1;return t}transform(e){let r=this.cache.get(e);return r?(r.referenceCount+=1,r.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createIdentifierName(),referenceCount:0}),this.cache.get(e).identifierName)}get unused(){return Array.from(this.cache.values()).filter((e=>0==e.referenceCount))}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:null}CSSPropertyOf(e,r){return this.cache.get(e=r+e)?`${r}${this.transform(e)}`:null}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.unused)console.log(`${e.originalName} is not referenced.`)}}r=t,t.lowerCases="abcdefghijklmnopqrstuvwxyz",t.upperCases="ABCDEFGHIJKLMNOPQRSTUVWXYZ",t.letterCases=r.lowerCases+r.upperCases;class n{static replaceRange(e,r,t,n){return e.substring(0,r)+n+e.substring(t)}static replacedLength(e,r){return r.length-e.length}}class s{}class a extends s{transform(e,r){const t=[...e.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g),...e.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g)];let s=0;for(const a of t){const t=a[0],l=a.index+s,o=r.transform(t),i=n.replaceRange(e,l,l+t.length,`--${o}`);s+=n.replacedLength(e,i),e=i}return e}}class l extends s{transform(e,r){const t=/((:|::)\w+(\([\w='"]+\))?)?/.source,s=`${`${/(\.|#)[a-zA-Z0-9_-]+/.source}${t}`}(?=(${`\\s+(\\w*(${`${/(\.|#)?[a-zA-Z0-0_-]+/.source}${t}`})?)\\s*`})*\\{)`,a=e.matchAll(new RegExp(s,"g"));let l=0;for(const t of a){const s=t[0],a=/^\./.test(s),o=(a?r.classMangler:r.idMangler).transform(s),i=s.length,c=a?".":"#",u=t.index+l,f=n.replaceRange(e,u,u+i,c+o);l+=n.replacedLength(e,f),e=f}return e}}class o{}class i extends o{constructor(e){super(),this.options=e}transform(e,r){const t=this.options.literals?this.transformLiteral(e,r):e;return this.options.property?this.transformProperty(t,r):t}transformLiteral(e,r){const t=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);let s=0;for(const a of t){const t=a[0],l=a.index+s,o=r.CSSVariableOf(t);if(o){const r=n.replaceRange(e,l,l+t.length,o);s+=n.replacedLength(e,r),e=r}}return e}transformProperty(e,r){const t=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let s=0;for(const a of t){const t=a[0].matchAll(/--[\w-]+/g),l=a.index;for(const a of t){const t=a[0],o=l+a.index+s,i=r.CSSVariableOf(t);if(i){const r=n.replaceRange(e,o,o+t.length,i);s+=n.replacedLength(e,r),e=r}}}return e}}class c extends o{transform(e,r){const t=this.transformHTML(e,r);return this.transformObject(t,r)}transformHTML(e,r){const t=e=>new RegExp(`(?<=<[\\w-]+ .*${e}\\s*=\\s*")[\\w\\s-]+(?=".*>)`,"g"),s=e.matchAll(t("class")),a=e.matchAll(t("id")),l=(e,r,t)=>({name:e[0],index:e.index,prefix:r,mangler:t}),o=[...Array.from(s).map((e=>l(e,".",r.classMangler))),...Array.from(a).map((e=>l(e,"#",r.idMangler)))];for(const r of o){const t=r.name.matchAll(/[\w-]+/g),s=r.index;let a=0;for(const l of t){const t=l[0],o=r.mangler.CSSPropertyOf(t,r.prefix),i=t.length,c=s+l.index+a;if(o){const t=n.replaceRange(e,c,c+i,o.replace(r.prefix,""));a+=n.replacedLength(e,t),e=t}}}return e}transformObject(e,r){const t=e=>new RegExp(`(?<=\\{.*${e}:\\s*['"])[\\w\\s-]+(?=['"].*\\})`,"g");return e.matchAll(t("className")),e.matchAll(t("id")),e}}class u{}class f extends u{constructor(){super(...arguments),this.manglers=[]}createMangler(){const e=new t;return this.manglers.push(e),e}}class h extends f{constructor(e){super(),this.options=e}createManglerDeclaration(){return new a}createManglerReference(){return new i(this.options)}transform(e){var r;const t=null!==(r=this.manglers[0])&&void 0!==r?r:this.createMangler(),n=this.createManglerDeclaration().transform(e,t);return this.createManglerReference().transform(n,t)}}class g extends f{createManglerDeclaration(){return new l}createManglerReference(){return new c}transform(e){var r,t;const n={classMangler:null!==(r=this.manglers[0])&&void 0!==r?r:this.createMangler(),idMangler:null!==(t=this.manglers[1])&&void 0!==t?t:this.createMangler()},s=this.createManglerDeclaration().transform(e,n);return this.createManglerReference().transform(s,n)}}e.CSSVariableDeclaration=a,e.CSSVariableReference=i,e.Mangler=t,e.ManglerDeclaration=s,e.ManglerReference=o,e.ManglerTranspiler=u,e.default=class{constructor(e){var r,t,n,s,a,l,o,i,c;if(this.options=e,this.transpilers=[],null!==(r=null==e?void 0:e.mangle)&&void 0!==r&&!r)return;const u=null===(n=null===(t=null==e?void 0:e.mangle)||void 0===t?void 0:t.variableName)||void 0===n||n,f=null!==(a=null===(s=null==e?void 0:e.mangle)||void 0===s?void 0:s.className)&&void 0!==a&&a,p=null!==(o=null===(l=null==e?void 0:e.mangle)||void 0===l?void 0:l.idName)&&void 0!==o&&o;!0!==u&&null==u.property&&null==u.literals||this.transpilers.push(new h({property:null===(i=u.property)||void 0===i||i,literals:null===(c=u.literals)||void 0===c||c})),(null!=f&&f||null!=p&&p)&&this.transpilers.push(new g)}apply(e){var r,t,n,s,a,l;const o=!(null!==(t=null===(r=this.options)||void 0===r?void 0:r.ignoreScript)&&void 0!==t&&t),i=null!==(s=null===(n=this.options)||void 0===n?void 0:n.processStage)&&void 0!==s?s:"OPTIMIZE_INLINE",c=null!==(l=null===(a=this.options)||void 0===a?void 0:a.reserved)&&void 0!==l?l:[];e.hooks.compilation.tap("CSSMangleWebpackPlugin",(r=>{r.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:"OPTIMIZE_INLINE"==i?e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE},(t=>{var n,s,a,l;for(const n in t){if(c.find((e=>e==n)))return;if(n.endsWith(".html")||n.endsWith(".js")&&o||n.endsWith(".jsx")&&o||n.endsWith(".css"))for(const s of this.transpilers){const a=t[n].source().toString();r.updateAsset(n,new e.webpack.sources.RawSource(s.transform(a)))}}null!==(s="ALL"==(null===(n=this.options)||void 0===n?void 0:n.printLogs))&&void 0!==s&&s&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogs())))),null!==(l="WARNING"==(null===(a=this.options)||void 0===a?void 0:a.printLogs))&&void 0!==l&&l&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogsUnused()))))}))}))}},Object.defineProperty(e,"__esModule",{value:!0})}));
