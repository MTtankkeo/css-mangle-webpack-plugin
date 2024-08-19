import { Compiler } from "webpack";

export class CSSMangleWebpackPlugin {
    constructor() {}

    apply(compiler: Compiler) {
        compiler.hooks.done.tap("CSSMangleWebpackPlugin", (states) => {
            console.log("Hello, World!");
        });
    }
}