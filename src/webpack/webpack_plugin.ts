import { Compiler } from "webpack";
import { ManglerTranspiler } from "../core/mangler_transpiler";
import { ManglerParser } from "../core/mangler_parser";

export class CSSMangleWebpackPlugin {
    constructor() {}

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
                            const source = assets[assetName].source().toString();
                            const parsed = ManglerParser.variable(source);
                            const transpiled = ManglerTranspiler.transform(parsed);

                            compilation.updateAsset(
                                assetName,
                                new compiler.webpack.sources.RawSource(transpiled)
                            );
                        }
                    }
                }
            );
        });
    }
}