class e{constructor(){this.count=0,this.cache=new Map}createIdentifierName(n=this.count++){let r="",t=e.chars.length;for(;n>=0&&(r=e.chars[n%t]+r,n>0);)n=Math.floor(n/t)-1;return r}transform(e){let n=this.cache.get(e);return n?(n.referenceCount+=1,n.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createIdentifierName(),referenceCount:0}),this.cache.get(e).identifierName)}get unused(){return Array.from(this.cache.values()).filter((e=>0==e.referenceCount))}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:null}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.unused)console.log(`${e.originalName} is not referenced.`)}}e.chars="abcdefghijklmnopqrstuvwxyz";class n{static replaceRange(e,n,r,t){return e.substring(0,n)+t+e.substring(r)}static replacedLength(e,n){return e.length-n.length}}class r{updateReplacedLength(e,n,r){return e+(n.length-r.length)}}class t extends r{transform(e,r){const t=[...e.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g),...e.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g)];let s=0;for(const a of t){const t=a[0],o=a.index+s,l=r.transform(t),i=n.replaceRange(e,o,o+t.length,`--${l}`);s-=n.replacedLength(e,i),e=i}return e}}class s extends r{transform(e,n){const r=/((:|::)\w+(\([\w='"]+\))?)?/.source,t=`${`${/(\.|.#)[a-zA-Z0-9_-]+/.source}${r}`}(?=(${`\\s+(\\w*(${`${/(\.|.#)?[a-zA-Z0-0_-]+/.source}${r}`})?)\\s*`})*\\{)`,s=e.matchAll(new RegExp(t,"g"));console.log(t);for(const e of s)console.log(e[0]);return e}transformId(){}transformClass(){}}class a{}class o extends a{transform(e,n){const r=this.transformLiteral(e,n);return this.transformProperty(r,n)}transformLiteral(e,r){const t=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);let s=0;for(const a of t){const t=a[0],o=a.index+s,l=r.CSSVariableOf(t);if(l){const r=n.replaceRange(e,o,o+t.length,l);s-=n.replacedLength(e,r),e=r}}return e}transformProperty(e,r){const t=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let s=0;for(const a of t){const t=a[0].matchAll(/--[\w-]+/g),o=a.index;for(const a of t){const t=a[0],l=o+a.index+s,i=r.CSSVariableOf(t);if(i){const r=n.replaceRange(e,l,l+t.length,i);s-=n.replacedLength(e,r),e=r}}}return e}}class l extends a{transform(e,n){return e}}class i{}class c extends i{constructor(){super(...arguments),this.manglers=[]}createMangler(){const n=new e;return this.manglers.push(n),n}}class h extends c{createManglerDeclaration(){return new t}createManglerReference(){return new o}transform(e){var n;const r=null!==(n=this.manglers[0])&&void 0!==n?n:this.createMangler(),t=this.createManglerDeclaration().transform(e,r);return this.createManglerReference().transform(t,r)}}class u extends c{createManglerDeclaration(){return new s}createManglerReference(){return new l}transform(e){var n;const r=null!==(n=this.manglers[0])&&void 0!==n?n:this.createMangler(),t=this.createManglerDeclaration().transform(e,r);return this.createManglerReference().transform(t,r)}}class g{constructor(e){var n,r,t,s;if(this.options=e,this.transpilers=[],null!==(n=null==e?void 0:e.mangle)&&void 0!==n&&!n)return;const a=null===(r=null==e?void 0:e.mangle)||void 0===r?void 0:r.variableName,o=null===(t=null==e?void 0:e.mangle)||void 0===t?void 0:t.className,l=null===(s=null==e?void 0:e.mangle)||void 0===s?void 0:s.idName;(null==a||a)&&this.transpilers.push(new h),(null!=o&&o||null!=l&&l)&&this.transpilers.push(new u)}apply(e){var n,r,t,s,a,o;const l=!(null!==(r=null===(n=this.options)||void 0===n?void 0:n.ignoreScript)&&void 0!==r&&r),i=null!==(s=null===(t=this.options)||void 0===t?void 0:t.bundleStage)&&void 0!==s?s:"behind",c=null!==(o=null===(a=this.options)||void 0===a?void 0:a.reserved)&&void 0!==o?o:[];e.hooks.compilation.tap("CSSMangleWebpackPlugin",(n=>{n.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:"behind"==i?e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE},(r=>{var t,s,a,o;for(const t in r){if(c.find((e=>e==t)))return;if(t.endsWith(".html")||t.endsWith(".js")&&l||t.endsWith(".jsx")&&l||t.endsWith(".css"))for(const s of this.transpilers){const a=r[t].source().toString();n.updateAsset(t,new e.webpack.sources.RawSource(s.transform(a)))}}null!==(s="all"==(null===(t=this.options)||void 0===t?void 0:t.printLogs))&&void 0!==s&&s&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogs())))),null!==(o="warning"==(null===(a=this.options)||void 0===a?void 0:a.printLogs))&&void 0!==o&&o&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogsUnused()))))}))}))}}export{t as CSSVariableDeclaration,o as CSSVariableReference,e as Mangler,r as ManglerDeclaration,a as ManglerReference,i as ManglerTranspiler,g as default};
