
/** This class provides additional functionality for `String` value type. */
export class StringUtil {

    /** Replaces a given range(start, end) with the given string value, returns it. */
    static replaceRange(
        str: string,
        start: number,
        end: number,
        replaceValue: string
    ) {
        return str.substring(0, start) + replaceValue + str.substring(end);
    }
}