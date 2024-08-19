import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export class ManglerParser {
    static variable(syntexText: string): string {
        const regexps = syntexText.matchAll(/--\w+(?=\s*:)/g);
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