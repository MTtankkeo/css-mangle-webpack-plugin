import { Compiler } from "webpack";
import { CSSVariableManglerOptions, DrivenManglerTranspiler } from "../core/mangler_transpiler";
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
    reserved?: string[];
    mangle?: boolean | {
        variableName?: boolean | CSSVariableManglerOptions;
        className?: boolean;
        idName?: boolean;
    };
}
export declare class CSSMangleWebpackPlugin {
    options: CSSMangleWebpackPluginOptions;
    transpilers: DrivenManglerTranspiler[];
    constructor(options: CSSMangleWebpackPluginOptions);
    apply(compiler: Compiler): void;
}
