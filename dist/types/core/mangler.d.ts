export declare class Mangler {
    count: number;
    chars: string;
    cache: Map<any, any>;
    createName(count?: number): string;
    transform(from: string): string;
    CSSVariableOf(value: string): string;
}
