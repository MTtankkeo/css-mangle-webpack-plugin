import { Compiler } from "webpack";
import { ManglerTranspiler } from "../core/mangler_transpiler";
export interface CSSMangleWebpackPluginOptions {
    /**
     * Whether unique identifiers in JavaScript and JSX should not be
     * targets for transpilation.
     */
    ignoreScript?: boolean;
    printLogs?: "all" | "warning" | "none";
    mangle?: {
        variableName?: boolean;
        className?: boolean;
        idName?: boolean;
    };
}
export declare class CSSMangleWebpackPlugin {
    options: CSSMangleWebpackPluginOptions;
    transpilers: ManglerTranspiler[];
    constructor(options: CSSMangleWebpackPluginOptions);
    apply(compiler: Compiler): void;
}
