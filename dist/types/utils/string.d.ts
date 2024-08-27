/** This class provides additional functionality for `String` value type. */
export declare class StringUtil {
    /**
     * Replaces a given range(start, end) with the given string value,
     * and returns it.
     */
    static replaceRange(str: string, start: number, end: number, replaceValue: string): string;
    /**
     * Returns the length difference between a given old string
     * and a given new string.
     */
    static replacedLength(oldStr: string, newStr: string): number;
    /** Returns the bytes size of a given string value. */
    static BytesOf(str: string): number;
}
