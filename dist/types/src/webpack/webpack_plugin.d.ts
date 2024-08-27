import { Compiler } from "webpack";
import { CSSVariableManglerOptions, DrivenManglerTranspiler } from "../core/mangler_transpiler";
import { CSSMangleReserved } from "../types";
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
    reserved?: CSSMangleReserved;
    mangle?: boolean | {
        variableName?: boolean | CSSVariableManglerOptions;
        className?: boolean;
        idName?: boolean;
        options?: {
            /**
             * Whether an undeclared identifier in this webpack plugin would
             * still be considered for minification.
             */
            undeclared: boolean;
        };
    };
}
export declare class CSSMangleWebpackPlugin {
    options: CSSMangleWebpackPluginOptions;
    transpilers: DrivenManglerTranspiler<any>[];
    constructor(options: CSSMangleWebpackPluginOptions);
    apply(compiler: Compiler): void;
}
