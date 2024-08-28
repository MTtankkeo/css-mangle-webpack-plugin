import { Compiler } from "webpack";
import { CSSMinificationManglerOptions, CSSVariableManglerOptions, DrivenManglerTranspiler } from "../core/mangler_transpiler";
import { CSSMangleReserved } from "../types";
import "colors";
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
    debugLogs?: "ALL" | "TIMEOUT" | "NONE";
    reserved?: CSSMangleReserved;
    minify?: boolean | Partial<CSSMinificationManglerOptions>;
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
