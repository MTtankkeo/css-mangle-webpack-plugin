"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtil = void 0;
/** This class provides additional functionality for `String` value type. */
class StringUtil {
    /**
     * Replaces a given range(start, end) with the given string value,
     * and returns it.
     */
    static replaceRange(str, start, end, replaceValue) {
        return str.substring(0, start) + replaceValue + str.substring(end);
    }
    /**
     * Returns the length difference between a given old string
     * and a given new string.
     */
    static replacedLength(oldStr, newStr) {
        return newStr.length - oldStr.length;
    }
    /** Returns the bytes size of a given string value. */
    static BytesOf(str) {
        return new TextEncoder().encode(str).length;
    }
}
exports.StringUtil = StringUtil;
