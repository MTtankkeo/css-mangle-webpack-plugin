import { Mangler } from "./mangler";
import { ManglerAsset } from "./mangler_asset";
import { ManglerContext } from "./mangler_context";
import { CSSQueryManglerContext, CSSVariableManglerOptions } from "./mangler_transpiler";
export declare abstract class ManglerReference<T = Mangler> {
    abstract transform(asset: ManglerAsset, context: ManglerContext<T>): string;
}
export declare class CSSVariableReference extends ManglerReference {
    options: CSSVariableManglerOptions;
    constructor(options: CSSVariableManglerOptions);
    transform(asset: ManglerAsset, mangler: ManglerContext<Mangler>): string;
    transformLiteral(syntaxText: string, context: ManglerContext<Mangler>): string;
    transformProperty(syntaxText: string, context: ManglerContext<Mangler>): string;
}
export declare class CSSQueryReference extends ManglerReference<CSSQueryManglerContext> {
    transform(asset: ManglerAsset, context: ManglerContext<CSSQueryManglerContext>): string;
    transformHTML(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
    /** TODO: It should be considered about dereference for variables. */
    transformScript(sources: string, context: ManglerContext<CSSQueryManglerContext>): string;
    transformSingleQuery(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
    transformMultplQuery(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
}
