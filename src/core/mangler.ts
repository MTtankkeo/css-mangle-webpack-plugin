
/**
 * Signature for the interface that is an object with original and
 * transformed names and a reference count.
 */
export interface ManglerObject {
    originalName: string;
    identifierName: string;
    referenceCount: number;
}

export class Mangler {
    /** This static value that is defining chars of about a base64. */
    static chars = "abcdefghijklmnopqrstuvwxyz";

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
    createName(count = this.count++): string {
        let result = "";
        let length = Mangler.chars.length;

        while (count >= 0) {
            result = Mangler.chars[count % length] + result;

            if (count > 0) {
                count = Math.floor(count / length) - 1;
            } else {
                break;
            }
        }

        return result;
    }

    /** Transforms input string to a unique identifier, caching the result. */
    transform(from: string): string {
        let object = this.cache.get(from);
        if (object) {
            return object.referenceCount += 1, object.identifierName;
        }

        this.cache.set(from, {
            originalName: from,
            identifierName: this.createName(),
            referenceCount: 0,
        })

        return this.cache.get(from).identifierName;
    }

    /** Converts input to CSS variable format if it exists in cache. */
    CSSVariableOf(value: string): string {
        return this.cache.get(value) ? `--${this.transform(value)}` : value;
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
        for (const object of this.cache.values()) {
            if (object.referenceCount == 0) console.log(`${object.originalName} is not referenced.`);
        }
    }
}