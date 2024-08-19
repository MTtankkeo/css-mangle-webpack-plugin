import { Compiler } from "webpack";
import { ManglerTranspiler } from "../core/mangler_transpiler";
export interface CSSMangleWebpackPluginOptions {
    mangle?: {
        staticVariable?: boolean;
    };
}
export declare class CSSMangleWebpackPlugin {
    options: CSSMangleWebpackPluginOptions;
    transpilers: ManglerTranspiler[];
    constructor(options: CSSMangleWebpackPluginOptions);
    apply(compiler: Compiler): void;
}
