import { Compiler } from "webpack";
export interface CSSMangleWebpackPluginOptions {
    useStrict: boolean;
}
export declare class CSSMangleWebpackPlugin {
    options: CSSMangleWebpackPluginOptions;
    constructor(options: CSSMangleWebpackPluginOptions);
    apply(compiler: Compiler): void;
}
