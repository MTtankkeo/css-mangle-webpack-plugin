import { Mangler } from "./mangler";
export declare abstract class ManglerDeclaration {
    abstract transform(syntaxText: string, mangler: Mangler): string;
}
export declare class CSSVariableDeclaration extends ManglerDeclaration {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    transform(syntaxText: string, mangler: Mangler): string;
}
export declare class CSSQueryDeclaration extends ManglerDeclaration {
    transform(syntaxText: string, mangler: Mangler): string;
}
