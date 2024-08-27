"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSMangleWebpackPlugin = void 0;
const mangler_transpiler_1 = require("../core/mangler_transpiler");
const mangler_1 = require("../utils/mangler");
require("colors");
class CSSMangleWebpackPlugin {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        this.options = options;
        this.transpilers = [];
        if ((_a = options === null || options === void 0 ? void 0 : options.minify) !== null && _a !== void 0 ? _a : false) {
            this.transpilers.push(new mangler_transpiler_1.CSSMinificationManglerTranspiler());
        }
        // When is not active to compress about the identifiers of CSS.
        if (!((_b = options === null || options === void 0 ? void 0 : options.mangle) !== null && _b !== void 0 ? _b : true))
            return;
        /** @ts-ignore */
        const variableName = (_d = (_c = options === null || options === void 0 ? void 0 : options.mangle) === null || _c === void 0 ? void 0 : _c.variableName) !== null && _d !== void 0 ? _d : true;
        /** @ts-ignore */
        const className = (_f = (_e = options === null || options === void 0 ? void 0 : options.mangle) === null || _e === void 0 ? void 0 : _e.className) !== null && _f !== void 0 ? _f : false;
        /** @ts-ignore */
        const idName = (_h = (_g = options === null || options === void 0 ? void 0 : options.mangle) === null || _g === void 0 ? void 0 : _g.idName) !== null && _h !== void 0 ? _h : false;
        /** @ts-ignore */
        const canUndeclared = (_l = (_k = (_j = options === null || options === void 0 ? void 0 : options.mangle) === null || _j === void 0 ? void 0 : _j.options) === null || _k === void 0 ? void 0 : _k.undeclared) !== null && _l !== void 0 ? _l : false;
        // When a developer want to compress a variable names of CSS.
        if (variableName === true
            || variableName["property"] != null
            || variableName["literals"] != null) {
            this.transpilers.push(new mangler_transpiler_1.CSSVariableManglerTranspiler({
                reversed: [],
                canUndeclared: canUndeclared,
                property: (_m = variableName["property"]) !== null && _m !== void 0 ? _m : true,
                literals: (_o = variableName["literals"]) !== null && _o !== void 0 ? _o : true
            }));
        }
        // When a developer want to compress a class-names of CSS.
        if ((className !== null && className !== void 0 ? className : false) || (idName !== null && idName !== void 0 ? idName : false)) {
            this.transpilers.push(new mangler_transpiler_1.CSSQueryManglerTranspiler());
        }
    }
    apply(compiler) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const useMangleScript = !((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.ignoreScript) !== null && _b !== void 0 ? _b : false);
        const processStage = (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.processStage) !== null && _d !== void 0 ? _d : "OPTIMIZE_INLINE";
        const debugLogs = (_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.debugLogs) !== null && _f !== void 0 ? _f : "TIMEOUT";
        const reversed = (_h = (_g = this.options) === null || _g === void 0 ? void 0 : _g.reserved) !== null && _h !== void 0 ? _h : [];
        compiler.hooks.compilation.tap("CSSMangleWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tap({
                name: "CSSMangleWebpackPlugin",
                stage: processStage == "OPTIMIZE_INLINE"
                    ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                    : compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, (assets) => {
                var _a, _b, _c, _d;
                for (const assetName in assets) {
                    // When a given assets name and reversed assets names matched.
                    if (reversed.find(name => name == assetName)) {
                        return;
                    }
                    if (assetName.endsWith(".html")
                        || assetName.endsWith(".js") && useMangleScript
                        || assetName.endsWith(".jsx") && useMangleScript
                        || assetName.endsWith(".css")) {
                        const startTime = performance.now();
                        for (const transpiler of this.transpilers) {
                            const source = assets[assetName].source().toString();
                            const result = transpiler.transform({
                                syntaxText: source,
                                syntaxType: mangler_1.ManglerUtil.assetTypeOf(assetName)
                            });
                            ;
                            compilation.updateAsset(assetName, new compiler.webpack.sources.RawSource(result));
                        }
                        if (debugLogs == "ALL" || debugLogs == "TIMEOUT") {
                            const timeout = Math.round(performance.now() - startTime); // ms
                            const message = "is minimized by (css-mangle-webpack-plugin)";
                            // Notifies a developer the current asset-name and timeout to microseconds format.
                            console.log("asset " + assetName.green.bold + ` ${message} ` + `[${timeout}ms]`.yellow.bold);
                        }
                    }
                }
                if ((_b = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.printLogs) == "ALL") !== null && _b !== void 0 ? _b : false) {
                    this.transpilers.forEach(e => e.context.parent.forEach(m => m.printLogs()));
                }
                if ((_d = ((_c = this.options) === null || _c === void 0 ? void 0 : _c.printLogs) == "WARNING") !== null && _d !== void 0 ? _d : false) {
                    this.transpilers.forEach(e => e.context.parent.forEach(m => m.printLogsUnused()));
                }
            });
        });
    }
}
exports.CSSMangleWebpackPlugin = CSSMangleWebpackPlugin;
