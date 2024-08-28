import { Compiler } from "webpack";
import { CSSMinificationManglerOptions, CSSMinificationManglerTranspiler, CSSQueryManglerTranspiler, CSSVariableManglerOptions, CSSVariableManglerTranspiler, DrivenManglerTranspiler } from "../core/mangler_transpiler";
import { CSSMangleReserved } from "../types";
import { ManglerUtil } from "../utils/mangler";
import "colors";

export interface CSSMangleWebpackPluginOptions {
    /**
     * Whether unique identifiers in JavaScript and JSX should not be
     * targets for transpilation.
     */
    ignoreScript?: boolean;
    /**
     * This option value defines which bundle process stage of Webpack
     * to proceed with optimization task.
     */
    processStage?: "OPTIMIZE" | "OPTIMIZE_INLINE";
    printLogs?: "ALL" | "WARNING" | "NONE";
    debugLogs?: "ALL" | "TIMEOUT" | "NONE";
    reserved?: CSSMangleReserved;
    minify?: boolean | Partial<CSSMinificationManglerOptions>;
    mangle?: boolean | {
        variableName?: boolean | CSSVariableManglerOptions;
        className?: boolean;
        idName?: boolean;
        options?: {
            /**
             * Whether an undeclared identifier in this webpack plugin would
             * still be considered for minification.
             */
            undeclared: boolean;
        }
    }
}

export class CSSMangleWebpackPlugin {
    transpilers: DrivenManglerTranspiler<any>[] = [];

    constructor(public options: CSSMangleWebpackPluginOptions) {
        if (options?.minify ?? false) {
            const minifyOptions = options.minify as CSSMinificationManglerOptions;

            this.transpilers.push(new CSSMinificationManglerTranspiler({
                rgbToHex: minifyOptions?.rgbToHex ?? true,
                comments: minifyOptions?.comments ?? true,
                // escapeSequence: minifyOptions?.escapeSequence ?? true
            }));
        }

        // When is not active to compress about the identifiers of CSS.
        if (!(options?.mangle ?? true)) return

        /** @ts-ignore */
        const variableName: boolean = options?.mangle?.variableName ?? true;

        /** @ts-ignore */
        const className: boolean = options?.mangle?.className ?? false;

        /** @ts-ignore */
        const idName: boolean = options?.mangle?.idName ?? false;

        /** @ts-ignore */
        const canUndeclared: boolean = options?.mangle?.options?.undeclared ?? false;

        // When a developer want to compress a variable names of CSS.
        if (variableName === true
         || variableName["property"] != null
         || variableName["literals"] != null) {
            this.transpilers.push(new CSSVariableManglerTranspiler({
                reversed: [],
                canUndeclared: canUndeclared,
                property: variableName["property"] ?? true,
                literals: variableName["literals"] ?? true
            }));
        }

        // When a developer want to compress a class-names of CSS.
        if ((className ?? false) || (idName ?? false)) {
            this.transpilers.push(new CSSQueryManglerTranspiler());
        }
    }

    apply(compiler: Compiler) {
        const useMangleScript = !(this.options?.ignoreScript ?? false);
        const processStage = this.options?.processStage ?? "OPTIMIZE_INLINE";
        const debugLogs = this.options?.debugLogs ?? "TIMEOUT";
        const reversed = this.options?.reserved ?? [];

        compiler.hooks.compilation.tap("CSSMangleWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: "CSSMangleWebpackPlugin",
                    stage: processStage == "OPTIMIZE_INLINE"
                        ? compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
                        : compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
                },
                (assets) => {
                    for (const assetName in assets) {
                        // When a given assets name and reversed assets names matched.
                        if (reversed.find(name => name == assetName)) {
                            return;
                        }

                        if (assetName.endsWith(".html")
                         || assetName.endsWith(".js")  && useMangleScript
                         || assetName.endsWith(".jsx") && useMangleScript
                         || assetName.endsWith(".css")) {
                            const startTime = performance.now();

                            for (const transpiler of this.transpilers) {
                                const source = assets[assetName].source().toString();
                                const result = transpiler.transform({
                                    syntaxText: source,
                                    syntaxType: ManglerUtil.assetTypeOf(assetName)
                                });
;
                                compilation.updateAsset(
                                    assetName,
                                    new compiler.webpack.sources.RawSource(result)
                                );
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
                }
            );
        });
    }
}