import { Compiler } from "webpack";
import { DrivenManglerTranspiler } from "../core/mangler_transpiler";
export interface CSSMangleWebpackPluginOptions {
    /**
     * Whether unique identifiers in JavaScript and JSX should not be
     * targets for transpilation.
     */
    ignoreScript?: boolean;
    bundleStage?: "before" | "behind";
    printLogs?: "all" | "warning" | "none";
    reserved?: string[] | RegExp[];
    mangle?: {
        variableName?: boolean;
        className?: boolean;
        idName?: boolean;
    } | boolean;
}
export declare class CSSMangleWebpackPlugin {
    options: CSSMangleWebpackPluginOptions;
    transpilers: DrivenManglerTranspiler[];
    constructor(options: CSSMangleWebpackPluginOptions);
    apply(compiler: Compiler): void;
}
