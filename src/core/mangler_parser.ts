import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export class ManglerParser {
    static variable(syntexText: string): string {
        const regexps = syntexText.matchAll(/--\w+(?=\s*:)/g);

        for (const regexp of regexps) {
            const name = regexp[0];
            const index = regexp.index;
            const newName = Mangler.instance.transform(name);

            StringUtil.replaceRange(syntexText, index, index + name.length, newName);
        }

        return syntexText;
    }
}