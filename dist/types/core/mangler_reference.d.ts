import { Mangler } from "./mangler";
import { ManglerContext } from "./mangler_context";
import { CSSQueryManglerContext, CSSVariableManglerOptions } from "./mangler_transpiler";
export declare abstract class ManglerReference<T = Mangler> {
    abstract transform(syntaxText: string, context: ManglerContext<T>): string;
}
export declare class CSSVariableReference extends ManglerReference {
    options: CSSVariableManglerOptions;
    constructor(options: CSSVariableManglerOptions);
    transform(syntaxText: string, mangler: ManglerContext<Mangler>): string;
    transformLiteral(syntaxText: string, context: ManglerContext<Mangler>): string;
    transformProperty(syntaxText: string, context: ManglerContext<Mangler>): string;
}
export declare class CSSQueryReference extends ManglerReference<CSSQueryManglerContext> {
    transform(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
    transformHTML(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
    /** TODO: It should be considered about dereference for variables. */
    transformObject(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
}
