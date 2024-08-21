!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).CSSMangleWebpackPlugin={})}(this,(function(e){"use strict";class n{constructor(){this.count=0,this.cache=new Map}createName(e=this.count++){let r="",t=n.chars.length;for(;e>=0&&(r=n.chars[e%t]+r,e>0);)e=Math.floor(e/t)-1;return r}transform(e){let n=this.cache.get(e);return n?(n.referenceCount+=1,n.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createName(),referenceCount:0}),this.cache.get(e).identifierName)}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:null}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.cache.values())0==e.referenceCount&&console.log(`${e.originalName} is not referenced.`)}}n.chars="abcdefghijklmnopqrstuvwxyz";class r{static replaceRange(e,n,r,t){return e.substring(0,n)+t+e.substring(r)}}class t{}class s extends t{transform(e,n){const t=[...e.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g),...e.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g)];let s=0;for(const a of t){const t=a[0],o=a.index-s,l=n.transform(t),i=r.replaceRange(e,o,o+t.length,`--${l}`);s+=e.length-i.length,e=i}return e}}class a extends t{transform(e,n){const r=/((:|::)\w+(\([\w='"]+\))?)?/.source,t=`${`${/(\.|.#)[a-zA-Z0-9_-]+/.source}${r}`}(?=(${`\\s+(\\w*(${`${/(\.|.#)?[a-zA-Z0-0_-]+/.source}${r}`})?)\\s*`})*\\{)`,s=e.matchAll(new RegExp(t,"g"));console.log(t);for(const e of s)console.log(e[0]);return e}transformId(){}transformClass(){}}class o{}class l extends o{transform(e,n){const r=this.transformLiteral(e,n);return this.transformProperty(r,n)}transformLiteral(e,n){const t=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);let s=0;for(const a of t){const t=a[0],o=a.index-s,l=n.CSSVariableOf(t);if(l){const n=r.replaceRange(e,o,o+t.length,l);s+=e.length-n.length,e=n}}return e}transformProperty(e,n){const t=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let s=0;for(const a of t){const t=a[0].matchAll(/--[\w-]+/g),o=a.index;for(const a of t){const t=a[0],l=o+a.index-s,i=n.CSSVariableOf(t);if(i){const n=r.replaceRange(e,l,l+t.length,i);s+=e.length-n.length,e=n}}}return e}}class i extends o{transform(e,n){return e}}class c{}class h extends c{constructor(){super(...arguments),this.manglers=[]}createMangler(){const e=new n;return this.manglers.push(e),e}}class f extends h{createManglerDeclaration(){return new s}createManglerReference(){return new l}transform(e){var n;const r=null!==(n=this.manglers[0])&&void 0!==n?n:this.createMangler(),t=this.createManglerDeclaration().transform(e,r);return this.createManglerReference().transform(t,r)}}class g extends h{createManglerDeclaration(){return new a}createManglerReference(){return new i}transform(e){var n;const r=null!==(n=this.manglers[0])&&void 0!==n?n:this.createMangler(),t=this.createManglerDeclaration().transform(e,r);return this.createManglerReference().transform(t,r)}}e.CSSVariableDeclaration=s,e.CSSVariableReference=l,e.Mangler=n,e.ManglerDeclaration=t,e.ManglerReference=o,e.ManglerTranspiler=c,e.default=class{constructor(e){var n,r,t,s;if(this.options=e,this.transpilers=[],null!==(n=null==e?void 0:e.mangle)&&void 0!==n&&!n)return;const a=null===(r=null==e?void 0:e.mangle)||void 0===r?void 0:r.variableName,o=null===(t=null==e?void 0:e.mangle)||void 0===t?void 0:t.className,l=null===(s=null==e?void 0:e.mangle)||void 0===s?void 0:s.idName;(null==a||a)&&this.transpilers.push(new f),(null!=o&&o||null!=l&&l)&&this.transpilers.push(new g)}apply(e){var n,r;const t=!(null!==(r=null===(n=this.options)||void 0===n?void 0:n.ignoreScript)&&void 0!==r&&r);e.hooks.compilation.tap("CSSMangleWebpackPlugin",(n=>{n.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE},(r=>{var s,a,o,l;for(const s in r)if(s.endsWith(".html")||s.endsWith(".js")&&t||s.endsWith(".jsx")&&t||s.endsWith(".css"))for(const t of this.transpilers){const a=r[s].source().toString();n.updateAsset(s,new e.webpack.sources.RawSource(t.transform(a)))}null!==(a="all"==(null===(s=this.options)||void 0===s?void 0:s.printLogs))&&void 0!==a&&a&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogs())))),null!==(l="warning"==(null===(o=this.options)||void 0===o?void 0:o.printLogs))&&void 0!==l&&l&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogsUnused()))))}))}))}},Object.defineProperty(e,"__esModule",{value:!0})}));
