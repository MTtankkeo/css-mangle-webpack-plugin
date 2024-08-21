import { Mangler } from "./mangler";
export declare abstract class ManglerReference {
    abstract transform(syntaxText: string, mangler: Mangler): string;
}
export declare class CSSVariableReference extends ManglerReference {
    transform(syntaxText: string, mangler: Mangler): string;
}
export declare class CSSQueryReference extends ManglerReference {
    transform(syntexText: string, mangler: Mangler): string;
}
