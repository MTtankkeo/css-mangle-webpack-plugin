export declare class Mangler {
    private static _instance;
    private constructor();
    count: number;
    chars: string;
    cache: Map<any, any>;
    /** Gets a unique instance of the [Mangler] class. */
    static get instance(): Mangler;
    createName(count?: number): string;
    transform(from: string): string;
    CSSVariableOf(value: string): string;
}
