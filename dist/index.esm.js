var e;class t{constructor(){this.count=0,this.cache=new Map}createIdentifierName(t=this.count++){let r="",n=e.letterCases.length;for(;t>=0&&(r=e.letterCases[t%n]+r,t>0);)t=Math.floor(t/n)-1;return r}transform(e){let t=this.cache.get(e);return t?(t.referenceCount+=1,t.identifierName):(this.cache.set(e,{originalName:e,identifierName:this.createIdentifierName(),referenceCount:0}),this.cache.get(e).identifierName)}get unused(){return Array.from(this.cache.values()).filter((e=>0==e.referenceCount))}CSSVariableOf(e,t=!1){return this.cache.get(e)||t?`--${this.transform(e)}`:null}CSSPropertyOf(e,t){return this.cache.get(e=t+e)?`${t}${this.transform(e)}`:null}printLogs(){console.log(this.cache)}printLogsUnused(){for(const e of this.unused)console.log(`${e.originalName} is not referenced.`)}}e=t,t.lowerCases="abcdefghijklmnopqrstuvwxyz",t.upperCases="ABCDEFGHIJKLMNOPQRSTUVWXYZ",t.letterCases=e.lowerCases+e.upperCases;class r{constructor(e,t){this.options=e,this.parent=t}}class n{static replaceRange(e,t,r,n){return e.substring(0,t)+n+e.substring(r)}static replacedLength(e,t){return t.length-e.length}}class s{}class o extends s{transform(e,t){const r=[...e.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g),...e.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g)];let s=0;for(const o of r){const r=o[0],a=o.index+s,l=t.parent.transform(r),i=n.replaceRange(e,a,a+r.length,`--${l}`);s+=n.replacedLength(e,i),e=i}return e}}class a extends s{transform(e,t){const r=/((:|::)(?!function\b)[\w-]+([\(\[][\w-]+([~|^$*]?=((".*?")|('.*?')|\d+)(\s[is])?)?[\)\]])?)?/.source,s=`${/([\w-]*(\.|#)?[a-zA-Z0-9_-]+|\*)/.source}${r}`,o=`${`${/(\.|#)[a-zA-Z0-9_-]+/.source}${r}`}(?=\\s*?{|${`((\\s+?${s})|(\\s*?${/[>+~,]/.source}\\s*?${s}))+?`}\\s*?{)`,a=e.matchAll(/(\.|\#)\w+[^]*?{/g);let l=0;for(const r of a){const s=r[0].matchAll(new RegExp(o,"g"));for(const o of s){const s=o[0],a=/^\./.test(s),i=t.parent,c=(a?i.classMangler:i.idMangler).transform(s),d=s.length,u=a?".":"#",h=r.index+o.index+l,p=n.replaceRange(e,h,h+d,u+c);l+=n.replacedLength(e,p),e=p}}return e}}class l{}class i extends l{constructor(e){super(),this.options=e}transform(e,t){const r=this.options.literals?this.transformLiteral(e,t):e;return this.options.property?this.transformProperty(r,t):r}transformLiteral(e,t){const r=e.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);let s=0;for(const o of r){const r=o.index+s,a=t.parent,l=o[0],i=a.CSSVariableOf(l,t.options.canUndeclared);if(i){const t=n.replaceRange(e,r,r+l.length,i);s+=n.replacedLength(e,t),e=t}}return e}transformProperty(e,t){const r=e.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);let s=0;for(const o of r){const r=o[0].matchAll(/--[\w-]+/g),a=o.index;for(const o of r){const r=a+o.index+s,l=t.parent,i=o[0],c=l.CSSVariableOf(i,t.options.canUndeclared);if(c){const t=n.replaceRange(e,r,r+i.length,c);s+=n.replacedLength(e,t),e=t}}}return e}}class c extends l{transform(e,t){const r=this.transformHTML(e,t);return this.transformObject(r,t)}transformHTML(e,t){const r=e=>new RegExp(`(?<=<[\\w-]+ .*${e}\\s*=\\s*")[\\w\\s-]+(?=".*>)`,"g"),s=e.matchAll(r("class")),o=e.matchAll(r("id")),a=t.parent,l=(e,t,r)=>({name:e[0],index:e.index,prefix:t,mangler:r}),i=[...Array.from(s).map((e=>l(e,".",a.classMangler))),...Array.from(o).map((e=>l(e,"#",a.idMangler)))];for(const t of i){const r=t.name.matchAll(/[\w-]+/g),s=t.index;let o=0;for(const a of r){const r=a[0],l=t.mangler.CSSPropertyOf(r,t.prefix),i=r.length,c=s+a.index+o;if(l){const r=n.replaceRange(e,c,c+i,l.replace(t.prefix,""));o+=n.replacedLength(e,r),e=r}}}return e}transformObject(e,t){const r=e=>new RegExp(`(?<=\\{.*${e}:\\s*['"])[\\w\\s-]+(?=['"].*\\})`,"g"),n=e.matchAll(r("className"));e.matchAll(r("id"));for(const e of n)console.log(e[0]);return e}}class d{}class u extends d{createMangler(){return new t}}class h extends u{constructor(e){super(),this.options=e}createManglerDeclaration(){return new o}createManglerReference(){return new i(this.options)}createContext(){return new r(this.options,this.createMangler())}transform(e){var t;const r=null!==(t=this.context)&&void 0!==t?t:this.createContext(),n=this.createManglerDeclaration().transform(e,r);return this.createManglerReference().transform(n,r)}}class p extends u{createManglerDeclaration(){return new a}createManglerReference(){return new c}createContext(){return new r({reversed:[],canUndeclared:!1},{classMangler:this.createMangler(),idMangler:this.createMangler()})}transform(e){var t;const r=null!==(t=this.context)&&void 0!==t?t:this.createContext(),n=this.createManglerDeclaration().transform(e,r);return this.createManglerReference().transform(n,r)}}class f{constructor(e){var t,r,n,s,o,a,l,i,c,d,u,f;if(this.options=e,this.transpilers=[],null!==(t=null==e?void 0:e.mangle)&&void 0!==t&&!t)return;const g=null===(n=null===(r=null==e?void 0:e.mangle)||void 0===r?void 0:r.variableName)||void 0===n||n,m=null!==(o=null===(s=null==e?void 0:e.mangle)||void 0===s?void 0:s.className)&&void 0!==o&&o,v=null!==(l=null===(a=null==e?void 0:e.mangle)||void 0===a?void 0:a.idName)&&void 0!==l&&l,x=null!==(d=null===(c=null===(i=null==e?void 0:e.mangle)||void 0===i?void 0:i.options)||void 0===c?void 0:c.undeclared)&&void 0!==d&&d;!0!==g&&null==g.property&&null==g.literals||this.transpilers.push(new h({reversed:[],canUndeclared:x,property:null===(u=g.property)||void 0===u||u,literals:null===(f=g.literals)||void 0===f||f})),(null!=m&&m||null!=v&&v)&&this.transpilers.push(new p)}apply(e){var t,r,n,s,o,a;const l=!(null!==(r=null===(t=this.options)||void 0===t?void 0:t.ignoreScript)&&void 0!==r&&r),i=null!==(s=null===(n=this.options)||void 0===n?void 0:n.processStage)&&void 0!==s?s:"OPTIMIZE_INLINE",c=null!==(a=null===(o=this.options)||void 0===o?void 0:o.reserved)&&void 0!==a?a:[];e.hooks.compilation.tap("CSSMangleWebpackPlugin",(t=>{t.hooks.processAssets.tap({name:"CSSMangleWebpackPlugin",stage:"OPTIMIZE_INLINE"==i?e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE:e.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE},(r=>{var n,s,o,a;for(const n in r){if(c.find((e=>e==n)))return;if(n.endsWith(".html")||n.endsWith(".js")&&l||n.endsWith(".jsx")&&l||n.endsWith(".css"))for(const s of this.transpilers){const o=r[n].source().toString();t.updateAsset(n,new e.webpack.sources.RawSource(s.transform(o)))}}null!==(s="ALL"==(null===(n=this.options)||void 0===n?void 0:n.printLogs))&&void 0!==s&&s&&this.transpilers.forEach((e=>e.context.parent.forEach((e=>e.printLogs())))),null!==(a="WARNING"==(null===(o=this.options)||void 0===o?void 0:o.printLogs))&&void 0!==a&&a&&this.transpilers.forEach((e=>e.context.parent.forEach((e=>e.printLogsUnused()))))}))}))}}export{o as CSSVariableDeclaration,i as CSSVariableReference,t as Mangler,s as ManglerDeclaration,l as ManglerReference,d as ManglerTranspiler,f as default};
