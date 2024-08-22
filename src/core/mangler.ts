
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
export class Mangler {
    /** This static value that is defining lower-case alphabets of about a base-26. */
    static lowerCases = "abcdefghijklmnopqrstuvwxyz";

    /** This static value that is defining upper-case alphabets of about a base-26. */
    static upperCases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
     * This static value that is defining lower-case and upper-case
     * alphabets of about a base-26.
     */
    static letterCases = this.lowerCases + this.upperCases;

    /**
     * This value that is defining a value that increases each when
     * a unique name is generated.
     */
    count: number = 0;
    cache = new Map<string, ManglerObject>();

    /**
     * Generates a unique name using a base-26 system based on
     * a given a unique count number.
     */
    createIdentifierName(count = this.count++): string {
        let result = "";
        let length = Mangler.letterCases.length;

        while (count >= 0) {
            result = Mangler.letterCases[count % length] + result;

            if (count > 0) {
                count = Math.floor(count / length) - 1;
            } else {
                break;
            }
        }

        return result;
    }

    /**
     * Transforms input string to a new unique identifier,
     * caching the result, and returns it.
     */
    transform(from: string): string {
        let object = this.cache.get(from);
        if (object) {
            return object.referenceCount += 1, object.identifierName;
        }

        this.cache.set(from, {
            originalName: from,
            identifierName: this.createIdentifierName(),
            referenceCount: 0, // initial count must be zero.
        })

        return this.cache.get(from).identifierName;
    }

    get unused(): ManglerObject[] {
        return Array.from(this.cache.values()).filter(c => c.referenceCount == 0);
    }

    /**
     * Returns a short unique identifier if a short unique identifier for
     * a given unique identifier has already been created and exists.
    */
    CSSVariableOf(value: string): string {
        return this.cache.get(value) ? `--${this.transform(value)}` : null;
    }

    CSSPropertyOf(value: string, prefix: string): string {
        return this.cache.get(value = prefix + value) ? `${prefix}${this.transform(value)}` : null;
    }

    /**
     * Prints the informations of all about this mangler.
     * i.e. this is just printing for debugging.
     */
    printLogs() {
        console.log(this.cache);
    }

    /**
     * Prints the informations of unreferenced unique identifier.
     * i.e. this is just printing for warning.
     */
    printLogsUnused() {
        for (const object of this.unused) {
            console.log(`${object.originalName} is not referenced.`);
        }
    }
}