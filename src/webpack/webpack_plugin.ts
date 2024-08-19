import { Compiler } from "webpack";
import { ManglerTranspiler } from "../core/mangler_transpiler";
import { CSSVariableDeclaration } from "../core/mangler_declaration";
import { CSSVariableReference } from "../core/mangler_reference";
import { Mangler } from "../core/mangler";

export interface CSSMangleWebpackPluginOptions {
    // ignoreScript?: boolean;
    printLogs?: "all" | "warning" | "none",
    mangle?: {
        variable?: boolean
    }
}

export class CSSMangleWebpackPlugin {
    transpilers: ManglerTranspiler[] = [];

    constructor(public options: CSSMangleWebpackPluginOptions) {

        // When a user want to mangle a static variables of CSS.
        if (options?.mangle?.variable ?? true) {
            this.transpilers.push({
                declaration: new CSSVariableDeclaration(),
                reference: new CSSVariableReference(),
                mangler: new Mangler(),
            })
        }
    }

    apply(compiler: Compiler) {
        compiler.hooks.compilation.tap("CSSMangleWebpackPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: "CSSMangleWebpackPlugin",
                    stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
                },
                (assets) => {
                    for (const assetName in assets) {
                        if (assetName.endsWith(".html")
                         || assetName.endsWith(".js")
                         || assetName.endsWith(".jsx")
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