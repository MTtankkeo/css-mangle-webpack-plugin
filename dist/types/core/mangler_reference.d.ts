import { Mangler } from "./mangler";
import { CSSQueryManglerContext, CSSVariableManglerOptions } from "./mangler_transpiler";
export declare abstract class ManglerReference<T = Mangler> {
    abstract transform(syntaxText: string, context: T): string;
}
export declare class CSSVariableReference extends ManglerReference {
    options: CSSVariableManglerOptions;
    constructor(options: CSSVariableManglerOptions);
    transform(syntaxText: string, mangler: Mangler): string;
    transformLiteral(syntaxText: string, mangler: Mangler): string;
    transformProperty(syntaxText: string, mangler: Mangler): string;
}
export declare class CSSQueryReference extends ManglerReference<CSSQueryManglerContext> {
    transform(syntaxText: string, context: CSSQueryManglerContext): string;
    transformHTML(syntaxText: string, context: CSSQueryManglerContext): string;
    transformObject(syntaxText: string, context: CSSQueryManglerContext): string;
}
