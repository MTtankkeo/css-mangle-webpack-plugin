/**
 * Signature for the interface that is an object about mangler
 * with original and transformed names and a reference count.
 */
export interface ManglerObject {
    originalName: string;
    identifierName: string;
    referenceCount: number;
}
/**
 * This class declared to replace long unique identifiers
 * with short identifier names in general.
*/
export declare class Mangler {
    /** This static value that is defining lower-case alphabets of about a base-26. */
    static lowerCases: string;
    /** This static value that is defining upper-case alphabets of about a base-26. */
    static upperCases: string;
    /**
     * This static value that is defining lower-case and upper-case
     * alphabets of about a base-26.
     */
    static letterCases: string;
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
    createIdentifierName(count?: number): string;
    /**
     * Transforms input string to a new unique identifier,
     * caching the result, and returns it.
     */
    transform(from: string): string;
    get unused(): ManglerObject[];
    /**
     * Returns a short unique identifier if a short unique identifier for
     * a given unique identifier has already been created and exists.
    */
    CSSVariableOf(value: string, canMangle?: boolean): string;
    CSSPropertyOf(value: string, prefix: string, isRaw?: boolean): string;
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
