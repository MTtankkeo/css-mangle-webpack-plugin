!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).CSSMangleWebpackPlugin={})}(this,(function(e){"use strict";class n{static replaceRange(e,n,t,s){return e.substring(0,n)+s+e.substring(t)}}class t{}class s extends t{transform(e,t){const s=e.matchAll(/--[\w-]+(?=\s*: ?.+;)/g);let r=0;for(const o of s){const s=o[0],a=o.index-r,i=t.transform(s),l=n.replaceRange(e,a,a+s.length,`--${i}`);r+=e.length-l.length,e=l}return e}}class r{}class o extends r{transform(e,t){const s=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g),r=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let o=0;for(const r of s){const s=r[0],a=r.index-o,i=n.replaceRange(e,a,a+s.length,t.CSSVariableOf(s));o+=e.length-i.length,e=i}for(const s of r){const r=s[0].matchAll(/--[\w-]+/g),a=s.index;for(const s of r){const r=s[0],i=a+s.index-o,l=n.replaceRange(e,i,i+r.length,t.CSSVariableOf(r));o+=e.length-l.length,e=l}}return e}}class a{constructor(){this.count=0,this.cache=new Map}createName(e=this.count++){let n="",t=a.chars.length;for(;e>=0&&(n=a.chars[e%t]+n,e>0);)e=Math.floor(e/t)-1;return n}transform(e){let n=this.cache.get(e);return n?(n.referenceCount+=1,n.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createName(),referenceCount:0}),this.cache.get(e).identifierName)}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:e}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.cache.values())0==e.referenceCount&&console.log(`${e.originalName} is not referenced.`)}}a.chars="abcdefghijklmnopqrstuvwxyz";e.CSSVariableDeclaration=s,e.CSSVariableReference=o,e.Mangler=a,e.ManglerDeclaration=t,e.ManglerReference=r,e.default=class{constructor(e){var n,t;this.options=e,this.transpilers=[],(null===(t=null===(n=null==e?void 0:e.mangle)||void 0===n?void 0:n.variable)||void 0===t||t)&&this.transpilers.push({declaration:new s,reference:new o,mangler:new a})}apply(e){var n,t;const s=!(null!==(t=null===(n=this.options)||void 0===n?void 0:n.ignoreScript)&&void 0!==t&&t);e.hooks.compilation.tap("CSSMangleWebpackPlugin",(n=>{n.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE},(t=>{var r,o,a,i;for(const r in t)if(r.endsWith(".html")||r.endsWith(".js")&&s||r.endsWith(".jsx")&&s||r.endsWith(".css"))for(const s of this.transpilers){const o=t[r].source().toString(),a=s.declaration.transform(o,s.mangler),i=s.reference.transform(a,s.mangler);n.updateAsset(r,new e.webpack.sources.RawSource(i))}null!==(o="all"==(null===(r=this.options)||void 0===r?void 0:r.printLogs))&&void 0!==o&&o&&this.transpilers.forEach((e=>e.mangler.printLogs())),null!==(i="warning"==(null===(a=this.options)||void 0===a?void 0:a.printLogs))&&void 0!==i&&i&&this.transpilers.forEach((e=>e.mangler.printLogsUnused()))}))}))}},Object.defineProperty(e,"__esModule",{value:!0})}));
