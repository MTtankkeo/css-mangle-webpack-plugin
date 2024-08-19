import { Compiler } from "webpack";

export class CSSMangleWebpackPlugin {
    apply(compiler: Compiler) {
        compiler.hooks.done.tap("CSSMangleWebpackPlugin", (states) => {
            
        });
    }
}