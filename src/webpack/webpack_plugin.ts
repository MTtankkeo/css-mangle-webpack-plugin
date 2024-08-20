import { Compiler } from "webpack";
import { ManglerTranspiler } from "../core/mangler_transpiler";
import { CSSQueryDeclaration, CSSVariableDeclaration } from "../core/mangler_declaration";
import { CSSQueryReference, CSSVariableReference } from "../core/mangler_reference";
import { Mangler } from "../core/mangler";

export interface CSSMangleWebpackPluginOptions {
    /**
     * Whether unique identifiers in JavaScript and JSX should not be
     * targets for transpilation.
     */
    ignoreScript?: boolean;
    printLogs?: "all" | "warning" | "none",
    mangle?: {
        variableName?: boolean
        className?: boolean
    }
}

export class CSSMangleWebpackPlugin {
    transpilers: ManglerTranspiler[] = [];

    constructor(public options: CSSMangleWebpackPluginOptions) {
        // When a user want to compress a variable names of CSS.
        if (options?.mangle?.variableName ?? true) {
            this.transpilers.push({
                declaration: new CSSVariableDeclaration(),
                reference: new CSSVariableReference(),
                mangler: new Mangler(),
            })
        }

        // When a user want to compress a class-names of CSS.
        if (options?.mangle?.className ?? false) {
            this.transpilers.push({
                declaration: new CSSQueryDeclaration(),
                reference: new CSSQueryReference(),
                mangler: new Mangler(),
            });
        }
    }

    apply(compiler: Compiler) {
        const useMangleScript = !(this.options?.ignoreScript ?? false);

        compiler.hooks.compilation.tap("CSSMangleWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: "CSSMangleWebpackPlugin",
                    stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
                },
                (assets) => {
                    for (const assetName in assets) {
                        if (assetName.endsWith(".html")
                         || assetName.endsWith(".js")  && useMangleScript
                         || assetName.endsWith(".jsx") && useMangleScript
                         || assetName.endsWith(".css")) {
                            for (const transpiler of this.transpilers) {
                                const source = assets[assetName].source().toString();
                                const t1 = transpiler.declaration.transform(source, transpiler.mangler);
                                const t2 = transpiler.reference.transform(t1, transpiler.mangler);

                                compilation.updateAsset(
                                    assetName,
                                    new compiler.webpack.sources.RawSource(t2)
                                );
                            }
                        }
                    }

                    if (this.options?.printLogs == "all" ?? false) {
                        this.transpilers.forEach(e => e.mangler.printLogs());
                    }
                    if (this.options?.printLogs == "warning" ?? false) {
                        this.transpilers.forEach(e => e.mangler.printLogsUnused());
                    }
                }
            );
        });
    }
}