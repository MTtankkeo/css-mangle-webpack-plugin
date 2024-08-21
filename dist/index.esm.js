class e{constructor(){this.count=0,this.cache=new Map}createIdentifierName(r=this.count++){let t="",n=e.chars.length;for(;r>=0&&(t=e.chars[r%n]+t,r>0);)r=Math.floor(r/n)-1;return t}transform(e){let r=this.cache.get(e);return r?(r.referenceCount+=1,r.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createIdentifierName(),referenceCount:0}),this.cache.get(e).identifierName)}get unused(){return Array.from(this.cache.values()).filter((e=>0==e.referenceCount))}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:null}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.unused)console.log(`${e.originalName} is not referenced.`)}}e.chars="abcdefghijklmnopqrstuvwxyz";class r{static replaceRange(e,r,t,n){return e.substring(0,r)+n+e.substring(t)}static replacedLength(e,r){return e.length-r.length}}class t{updateReplacedLength(e,r,t){return e+(r.length-t.length)}}class n extends t{transform(e,t){const n=[...e.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g),...e.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g)];let s=0;for(const a of n){const n=a[0],o=a.index+s,l=t.transform(n),i=r.replaceRange(e,o,o+n.length,`--${l}`);s-=r.replacedLength(e,i),e=i}return e}}class s extends t{transform(e,r){const t=/((:|::)\w+(\([\w='"]+\))?)?/.source,n=`${`${/(\.|.#)[a-zA-Z0-9_-]+/.source}${t}`}(?=(${`\\s+(\\w*(${`${/(\.|.#)?[a-zA-Z0-0_-]+/.source}${t}`})?)\\s*`})*\\{)`,s=e.matchAll(new RegExp(n,"g"));console.log(n);for(const e of s)console.log(e[0]);return e}transformId(){}transformClass(){}}class a{}class o extends a{transform(e,r){const t=this.transformLiteral(e,r);return this.transformProperty(t,r)}transformLiteral(e,t){const n=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);let s=0;for(const a of n){const n=a[0],o=a.index+s,l=t.CSSVariableOf(n);if(l){const t=r.replaceRange(e,o,o+n.length,l);s-=r.replacedLength(e,t),e=t}}return e}transformProperty(e,t){const n=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let s=0;for(const a of n){const n=a[0].matchAll(/--[\w-]+/g),o=a.index;for(const a of n){const n=a[0],l=o+a.index+s,i=t.CSSVariableOf(n);if(i){const t=r.replaceRange(e,l,l+n.length,i);s-=r.replacedLength(e,t),e=t}}}return e}}class l extends a{transform(e,r){return e}}class i{}class c extends i{constructor(){super(...arguments),this.manglers=[]}createMangler(){const r=new e;return this.manglers.push(r),r}}class h extends c{createManglerDeclaration(){return new n}createManglerReference(){return new o}transform(e){var r;const t=null!==(r=this.manglers[0])&&void 0!==r?r:this.createMangler(),n=this.createManglerDeclaration().transform(e,t);return this.createManglerReference().transform(n,t)}}class u extends c{createManglerDeclaration(){return new s}createManglerReference(){return new l}transform(e){var r;const t=null!==(r=this.manglers[0])&&void 0!==r?r:this.createMangler(),n=this.createManglerDeclaration().transform(e,t);return this.createManglerReference().transform(n,t)}}class g{constructor(e){var r,t,n,s;if(this.options=e,this.transpilers=[],null!==(r=null==e?void 0:e.mangle)&&void 0!==r&&!r)return;const a=null===(t=null==e?void 0:e.mangle)||void 0===t?void 0:t.variableName,o=null===(n=null==e?void 0:e.mangle)||void 0===n?void 0:n.className,l=null===(s=null==e?void 0:e.mangle)||void 0===s?void 0:s.idName;(null==a||a)&&this.transpilers.push(new h),(null!=o&&o||null!=l&&l)&&this.transpilers.push(new u)}apply(e){var r,t;const n=!(null!==(t=null===(r=this.options)||void 0===r?void 0:r.ignoreScript)&&void 0!==t&&t);e.hooks.compilation.tap("CSSMangleWebpackPlugin",(r=>{r.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE},(t=>{var s,a,o,l;for(const s in t)if(s.endsWith(".html")||s.endsWith(".js")&&n||s.endsWith(".jsx")&&n||s.endsWith(".css"))for(const n of this.transpilers){const a=t[s].source().toString();r.updateAsset(s,new e.webpack.sources.RawSource(n.transform(a)))}null!==(a="all"==(null===(s=this.options)||void 0===s?void 0:s.printLogs))&&void 0!==a&&a&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogs())))),null!==(l="warning"==(null===(o=this.options)||void 0===o?void 0:o.printLogs))&&void 0!==l&&l&&this.transpilers.forEach((e=>e.manglers.forEach((e=>e.printLogsUnused()))))}))}))}}export{n as CSSVariableDeclaration,o as CSSVariableReference,e as Mangler,t as ManglerDeclaration,a as ManglerReference,i as ManglerTranspiler,g as default};
