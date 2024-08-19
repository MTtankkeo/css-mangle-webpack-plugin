import { Mangler } from "./mangler";
export declare abstract class ManglerReference {
    abstract transform(syntexText: string, mangler: Mangler): string;
}
export declare class CSSVariableReference extends ManglerReference {
    transform(syntexText: string, mangler: Mangler): string;
}
