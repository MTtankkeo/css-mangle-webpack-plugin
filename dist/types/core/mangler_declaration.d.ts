import { Mangler } from "./mangler";
import { ManglerAsset } from "./mangler_asset";
import { ManglerContext } from "./mangler_context";
import { CSSQueryManglerContext } from "./mangler_transpiler";
export declare abstract class ManglerDeclaration<T = Mangler> {
    abstract transform(asset: ManglerAsset, context: ManglerContext<T>): string;
}
export declare class CSSVariableDeclaration extends ManglerDeclaration {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    transform(asset: ManglerAsset, context: ManglerContext<Mangler>): string;
}
export declare class CSSQueryDeclaration extends ManglerDeclaration<CSSQueryManglerContext> {
    transform(asset: ManglerAsset, context: ManglerContext<CSSQueryManglerContext>): string;
    transformStyle(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string;
}
