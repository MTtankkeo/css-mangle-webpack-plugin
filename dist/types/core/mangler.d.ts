export declare class ManglerObject {
    originName: string;
    identifierName: string;
    referenceCount: number;
}
export declare class Mangler {
    count: number;
    chars: string;
    cache: Map<string, ManglerObject>;
    createName(count?: number): string;
    transform(from: string): string;
    CSSVariableOf(value: string): string;
    printLogs(): void;
    printLogsUnused(): void;
}
