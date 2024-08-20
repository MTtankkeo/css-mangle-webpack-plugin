/**
 * Signature for the interface that is an object with original and
 * transformed names and a reference count.
 */
export interface ManglerObject {
    originalName: string;
    identifierName: string;
    referenceCount: number;
}
/** Manages the transformation of strings into unique identifiers for compressing. */
export declare class Mangler {
    /** This static value that is defining chars of about a base-26. */
    static chars: string;
    /**
     * This value that is defining a value that increases each when
     * a unique name is generated.
     */
    count: number;
    cache: Map<string, ManglerObject>;
    /**
     * Generates a unique name using a base-26 system based on
     * a given a unique count number.
     */
    createName(count?: number): string;
    /** Transforms input string to a unique identifier, caching the result. */
    transform(from: string): string;
    /** Converts input to CSS variable format if it exists in cache. */
    CSSVariableOf(value: string): string;
    /**
     * Prints the informations of all about this mangler.
     * i.e. this is just printing for debugging.
     */
    printLogs(): void;
    /**
     * Prints the informations of unreferenced unique identifier.
     * i.e. this is just printing for warning.
     */
    printLogsUnused(): void;
}
