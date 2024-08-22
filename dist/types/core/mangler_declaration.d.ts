import { Mangler } from "./mangler";
import { CSSQueryManglerContext } from "./mangler_transpiler";
export declare abstract class ManglerDeclaration<T = Mangler> {
    abstract transform(syntaxText: string, context: T): string;
}
export declare class CSSVariableDeclaration extends ManglerDeclaration {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    transform(syntaxText: string, mangler: Mangler): string;
}
export declare class CSSQueryDeclaration extends ManglerDeclaration<CSSQueryManglerContext> {
    transform(syntaxText: string, context: CSSQueryManglerContext): string;
}
