!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).CSSMangleWebpackPlugin={})}(this,(function(e){"use strict";class n{static replaceRange(e,n,t,s){return e.substring(0,n)+s+e.substring(t)}}class t{}class s extends t{transform(e,t){const s=[...e.matchAll(/--[\w-]+(?=\s*: ?.+;)/g),...e.matchAll(/(?<=@property )--[a-zA-Z0-9_-]+(?=\s*{[^{}]*})/g)];let r=0;for(const o of s){const s=o[0],a=o.index-r,l=t.transform(s),i=n.replaceRange(e,a,a+s.length,`--${l}`);r+=e.length-i.length,e=i}return e}}class r extends t{constructor(e){super()}transform(e,n){const t=/((:|::)\w+(\([\w='"]+\))?)?/.source,s=`${`${/(\.|.#)[a-zA-Z0-9_-]+/.source}${t}`}(?=(${`\\s+(\\w*(${`${/(\.|.#)?[a-zA-Z0-0_-]+/.source}${t}`})?)\\s*`})*\\{)`,r=e.matchAll(new RegExp(s,"g"));console.log(s);for(const e of r)console.log(e[0]);return e}transformId(){}transformClass(){}}class o{}class a extends o{transform(e,t){const s=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g),r=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let o=0;for(const r of s){const s=r[0],a=r.index-o,l=n.replaceRange(e,a,a+s.length,t.CSSVariableOf(s));o+=e.length-l.length,e=l}for(const s of r){const r=s[0].matchAll(/--[\w-]+/g),a=s.index;for(const s of r){const r=s[0],l=a+s.index-o,i=n.replaceRange(e,l,l+r.length,t.CSSVariableOf(r));o+=e.length-i.length,e=i}}return e}}class l extends o{transform(e,n){return e}}class i{constructor(){this.count=0,this.cache=new Map}createName(e=this.count++){let n="",t=i.chars.length;for(;e>=0&&(n=i.chars[e%t]+n,e>0);)e=Math.floor(e/t)-1;return n}transform(e){let n=this.cache.get(e);return n?(n.referenceCount+=1,n.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createName(),referenceCount:0}),this.cache.get(e).identifierName)}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:e}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.cache.values())0==e.referenceCount&&console.log(`${e.originalName} is not referenced.`)}}i.chars="abcdefghijklmnopqrstuvwxyz";e.CSSVariableDeclaration=s,e.CSSVariableReference=a,e.Mangler=i,e.ManglerDeclaration=t,e.ManglerReference=o,e.default=class{constructor(e){var n,t,o,c,g,h;this.options=e,this.transpilers=[],(null===(t=null===(n=null==e?void 0:e.mangle)||void 0===n?void 0:n.variableName)||void 0===t||t)&&this.transpilers.push({declaration:new s,reference:new a,mangler:new i});const f=null!==(c=null===(o=null==e?void 0:e.mangle)||void 0===o?void 0:o.className)&&void 0!==c&&c,u=null!==(h=null===(g=null==e?void 0:e.mangle)||void 0===g?void 0:g.idName)&&void 0!==h&&h;(f||u)&&this.transpilers.push({declaration:new r({className:f,idName:u}),reference:new l,mangler:new i})}apply(e){var n,t;const s=!(null!==(t=null===(n=this.options)||void 0===n?void 0:n.ignoreScript)&&void 0!==t&&t);e.hooks.compilation.tap("CSSMangleWebpackPlugin",(n=>{n.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:e.webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS},(t=>{var r,o,a,l;for(const r in t)if(r.endsWith(".html")||r.endsWith(".js")&&s||r.endsWith(".jsx")&&s||r.endsWith(".css"))for(const s of this.transpilers){const o=t[r].source().toString(),a=s.declaration.transform(o,s.mangler),l=s.reference.transform(a,s.mangler);n.updateAsset(r,new e.webpack.sources.RawSource(l))}null!==(o="all"==(null===(r=this.options)||void 0===r?void 0:r.printLogs))&&void 0!==o&&o&&this.transpilers.forEach((e=>e.mangler.printLogs())),null!==(l="warning"==(null===(a=this.options)||void 0===a?void 0:a.printLogs))&&void 0!==l&&l&&this.transpilers.forEach((e=>e.mangler.printLogsUnused()))}))}))}},Object.defineProperty(e,"__esModule",{value:!0})}));
