import { Compiler } from "webpack";
import { CSSQueryManglerTranspiler, CSSVariableManglerTranspiler, DrivenManglerTranspiler } from "../core/mangler_transpiler";

export interface CSSMangleWebpackPluginOptions {
    /**
     * Whether unique identifiers in JavaScript and JSX should not be
     * targets for transpilation.
     */
    ignoreScript?: boolean;
    bundleStage?: "before" | "behind";
    printLogs?: "all" | "warning" | "none";
    // useStrict?: boolean,
    reserved?: string[] | RegExp[],
    mangle?: {
        variableName?: boolean;
        className?: boolean;
        idName?: boolean;
    } | boolean;
}

export class CSSMangleWebpackPlugin {
    transpilers: DrivenManglerTranspiler[] = [];

    constructor(public options: CSSMangleWebpackPluginOptions) {
        // When is not active to compress about the identifiers of CSS.
        if (!(options?.mangle ?? true)) return;

        /** @ts-ignore */
        const variableName: boolean = options?.mangle?.variableName;

        /** @ts-ignore */
        const className: boolean = options?.mangle?.className;

        /** @ts-ignore */
        const idName: boolean = options?.mangle?.idName;

        // When a developer want to compress a variable names of CSS.
        if (variableName ?? true) {
            this.transpilers.push(new CSSVariableManglerTranspiler());
        }

        // When a developer want to compress a class-names of CSS.
        if ((className ?? false) || (idName ?? false)) {
            this.transpilers.push(new CSSQueryManglerTranspiler());
        }
    }

    apply(compiler: Compiler) {
        const useMangleScript = !(this.options?.ignoreScript ?? false);
        const bundleStage = this.options?.bundleStage ?? "behind";
        const reversed = this.options?.reserved ?? [];

        compiler.hooks.compilation.tap("CSSMangleWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: "CSSMangleWebpackPlugin",
                    stage: bundleStage == "behind"
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

                    if (this.options?.printLogs == "all" ?? false) {
                        this.transpilers.forEach(e => e.manglers.forEach(m => m.printLogs()));
                    }

                    if (this.options?.printLogs == "warning" ?? false) {
                        this.transpilers.forEach(e => e.manglers.forEach(m => m.printLogsUnused()));
                    }
                }
            );
        });
    }
}