import { Compiler } from "webpack";
import { CSSQueryManglerTranspiler, CSSVariableManglerOptions, CSSVariableManglerTranspiler, DrivenManglerTranspiler } from "../core/mangler_transpiler";

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
    reserved?: string[],
    mangle?: boolean | {
        variableName?: boolean | CSSVariableManglerOptions;
        className?: boolean;
        idName?: boolean;
    };
}

export class CSSMangleWebpackPlugin {
    transpilers: DrivenManglerTranspiler[] = [];

    constructor(public options: CSSMangleWebpackPluginOptions) {
        // When is not active to compress about the identifiers of CSS.
        if (!(options?.mangle ?? true)) return;

        /** @ts-ignore */
        const variableName: boolean = options?.mangle?.variableName ?? true;

        /** @ts-ignore */
        const className: boolean = options?.mangle?.className ?? false;

        /** @ts-ignore */
        const idName: boolean = options?.mangle?.idName ?? false;

        // When a developer want to compress a variable names of CSS.
        if (variableName === true
         || variableName["property"] != null
         || variableName["literals"] != null) {
            this.transpilers.push(new CSSVariableManglerTranspiler({
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
                            for (const transpiler of this.transpilers) {
                                const source = assets[assetName].source().toString();

                                compilation.updateAsset(
                                    assetName,
                                    new compiler.webpack.sources.RawSource(transpiler.transform(source))
                                );
                            }
                        }
                    }

                    if (this.options?.printLogs == "ALL" ?? false) {
                        this.transpilers.forEach(e => e.manglers.forEach(m => m.printLogs()));
                    }

                    if (this.options?.printLogs == "WARNING" ?? false) {
                        this.transpilers.forEach(e => e.manglers.forEach(m => m.printLogsUnused()));
                    }
                }
            );
        });
    }
}