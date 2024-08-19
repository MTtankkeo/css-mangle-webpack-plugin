export declare abstract class ManglerReference {
    abstract transform(syntexText: string): string;
}
export declare class CSSVariableReference extends ManglerReference {
    transform(syntexText: string): string;
}
