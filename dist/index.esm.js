class e{static replaceRange(e,n,s,t){return e.substring(0,n)+t+e.substring(s)}}class n{}class s extends n{transform(n,s){const t=[...n.matchAll(/--[\w-]+(?=\s*: ?.+;)/g),...n.matchAll(/(?<=@property )--[a-zA-Z0-9_-]+(?=\s*{[^{}]*})/g)];let r=0;for(const o of t){const t=o[0],a=o.index-r,l=s.transform(t),i=e.replaceRange(n,a,a+t.length,`--${l}`);r+=n.length-i.length,n=i}return n}}class t extends n{transform(e,n){const s=/((:|::)\w+(\([\w='"]+\))?)?/.source,t=`${`${/(\.|.#)[a-zA-Z0-9_-]+/.source}${s}`}(?=(${`\\s+(\\w*(${`${/(\.|.#)?[a-zA-Z0-0_-]+/.source}${s}`})?)\\s*`})*\\{)`;console.log(t);const r=e.matchAll(new RegExp(t,"g"));for(const e of r)console.log(e[0]);return e}}class r{}class o extends r{transform(n,s){const t=n.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g),r=n.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let o=0;for(const r of t){const t=r[0],a=r.index-o,l=e.replaceRange(n,a,a+t.length,s.CSSVariableOf(t));o+=n.length-l.length,n=l}for(const t of r){const r=t[0].matchAll(/--[\w-]+/g),a=t.index;for(const t of r){const r=t[0],l=a+t.index-o,i=e.replaceRange(n,l,l+r.length,s.CSSVariableOf(r));o+=n.length-i.length,n=i}}return n}}class a extends r{transform(e,n){return e}}class l{constructor(){this.count=0,this.cache=new Map}createName(e=this.count++){let n="",s=l.chars.length;for(;e>=0&&(n=l.chars[e%s]+n,e>0);)e=Math.floor(e/s)-1;return n}transform(e){let n=this.cache.get(e);return n?(n.referenceCount+=1,n.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createName(),referenceCount:0}),this.cache.get(e).identifierName)}CSSVariableOf(e){return this.cache.get(e)?`--${this.transform(e)}`:e}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.cache.values())0==e.referenceCount&&console.log(`${e.originalName} is not referenced.`)}}l.chars="abcdefghijklmnopqrstuvwxyz";class i{constructor(e){var n,r,i,c;this.options=e,this.transpilers=[],(null===(r=null===(n=null==e?void 0:e.mangle)||void 0===n?void 0:n.variableName)||void 0===r||r)&&this.transpilers.push({declaration:new s,reference:new o,mangler:new l}),null!==(c=null===(i=null==e?void 0:e.mangle)||void 0===i?void 0:i.className)&&void 0!==c&&c&&this.transpilers.push({declaration:new t,reference:new a,mangler:new l})}apply(e){var n,s;const t=!(null!==(s=null===(n=this.options)||void 0===n?void 0:n.ignoreScript)&&void 0!==s&&s);e.hooks.compilation.tap("CSSMangleWebpackPlugin",(n=>{n.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE},(s=>{var r,o,a,l;for(const r in s)if(r.endsWith(".html")||r.endsWith(".js")&&t||r.endsWith(".jsx")&&t||r.endsWith(".css"))for(const t of this.transpilers){const o=s[r].source().toString(),a=t.declaration.transform(o,t.mangler),l=t.reference.transform(a,t.mangler);n.updateAsset(r,new e.webpack.sources.RawSource(l))}null!==(o="all"==(null===(r=this.options)||void 0===r?void 0:r.printLogs))&&void 0!==o&&o&&this.transpilers.forEach((e=>e.mangler.printLogs())),null!==(l="warning"==(null===(a=this.options)||void 0===a?void 0:a.printLogs))&&void 0!==l&&l&&this.transpilers.forEach((e=>e.mangler.printLogsUnused()))}))}))}}export{s as CSSVariableDeclaration,o as CSSVariableReference,l as Mangler,n as ManglerDeclaration,r as ManglerReference,i as default};
