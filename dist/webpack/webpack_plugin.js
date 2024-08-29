(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../core/mangler_transpiler", "../utils/mangler", "colors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSSMangleWebpackPlugin = void 0;
    const mangler_transpiler_1 = require("../core/mangler_transpiler");
    const mangler_1 = require("../utils/mangler");
    require("colors");
    class CSSMangleWebpackPlugin {
        options;
        transpilers = [];
        constructor(options) {
            this.options = options;
            if (options?.minify ?? false) {
                const minifyOptions = options.minify;
                this.transpilers.push(new mangler_transpiler_1.CSSMinificationManglerTranspiler({
                    rgbToHex: minifyOptions?.rgbToHex ?? true,
                    comments: minifyOptions?.comments ?? true,
                    escapeSequence: minifyOptions?.escapeSequence ?? true
                }));
            }
            // When is not active to compress about the identifiers of CSS.
            if (!(options?.mangle ?? true))
                return;
            /** @ts-ignore */
            const variableName = options?.mangle?.variableName ?? true;
            /** @ts-ignore */
            const className = options?.mangle?.className ?? false;
            /** @ts-ignore */
            const idName = options?.mangle?.idName ?? false;
            /** @ts-ignore */
            const canUndeclared = options?.mangle?.options?.undeclared ?? false;
            // When a developer want to compress a variable names of CSS.
            if (variableName === true
                || variableName["property"] != null
                || variableName["literals"] != null) {
                this.transpilers.push(new mangler_transpiler_1.CSSVariableManglerTranspiler({
                    reversed: [],
                    canUndeclared: canUndeclared,
                    property: variableName["property"] ?? true,
                    literals: variableName["literals"] ?? true
                }));
            }
            // When a developer want to compress a class-names of CSS.
            if ((className ?? false) || (idName ?? false)) {
                this.transpilers.push(new mangler_transpiler_1.CSSQueryManglerTranspiler());
            }
        }
        apply(compiler) {
            const useMangleScript = !(this.options?.ignoreScript ?? false);
            const processStage = this.options?.processStage ?? "OPTIMIZE_INLINE";
            const debugLogs = this.options?.debugLogs ?? "TIMEOUT";
            const reversed = this.options?.reserved ?? [];
            compiler.hooks.compilation.tap("CSSMangleWebpackPlugin", (compilation) => {
                compilation.hooks.processAssets.tap({
                    name: "CSSMangleWebpackPlugin",
                    stage: processStage == "OPTIMIZE_INLINE"
                        ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                        : compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
                }, (assets) => {
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
                    if (this.options?.printLogs == "ALL" ?? false) {
                        this.transpilers.forEach(e => e.context.parent.forEach(m => m.printLogs()));
                    }
                    if (this.options?.printLogs == "WARNING" ?? false) {
                        this.transpilers.forEach(e => e.context.parent.forEach(m => m.printLogsUnused()));
                    }
                });
            });
        }
    }
    exports.CSSMangleWebpackPlugin = CSSMangleWebpackPlugin;
});
