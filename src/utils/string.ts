
/** This class provides additional functionality for `String` value type. */
export class StringUtil {

    /**
     * Replaces a given range(start, end) with the given string value,
     * and returns it.
     */
    static replaceRange(
        str: string,
        start: number,
        end: number,
        replaceValue: string
    ) {
        return str.substring(0, start) + replaceValue + str.substring(end);
    }

    /**
     * Returns the length difference between a given old string
     * and a given new string.
     */
    static replacedLength(oldStr: string, newStr: string) {
        return oldStr.length - newStr.length;
    }
}