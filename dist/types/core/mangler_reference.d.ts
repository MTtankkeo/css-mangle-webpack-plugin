export declare abstract class ManglerDefinition {
    abstract transform(syntexText: string): string;
}
export declare class CSSVariableDefinition extends ManglerDefinition {
    transform(syntexText: string): string;
}
