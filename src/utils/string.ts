
export class StringUtil {
    static replaceRange(str: string, start: number, end: number, replaceValue: string) {
        return str.substring(0, start) + replaceValue + str.substring(end);
    }
}