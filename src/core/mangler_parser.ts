import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export class ManglerParser {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    static variable(syntexText: string): string {
        // In CSS variable declarations, a unique syntax is generally used,
        // making identification relatively straightforward.
        //
        // This patterns matched by the following regular expression are:
        //
        // * --background: white;
        // * --rearground: rgb(240, 242, 246);
        // * --foreground: black;
        //
        // See Also, where "background" is a unique identifier,
        // so any character form is acceptable.
        //
        const regexps = syntexText.matchAll(/--[\w-]+(?=\s*: ?\w+;)/g);
        let replacedLength = 0;

        for (const regexp of regexps) {
            const name = regexp[0];
            const index = regexp.index - replacedLength;
            const newName = Mangler.instance.transform(name);
            const result = StringUtil.replaceRange(syntexText, index, index + name.length, `--${newName}`);

            replacedLength += syntexText.length - result.length;
            syntexText = result;
        }

        return syntexText;
    }
}