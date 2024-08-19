import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export class ManglerTranspiler {
    static transform(syntexText: string): string {
        return this.transformVariable(syntexText);
    }

    static transformVariable(syntexText: string): string {
        const regexps = syntexText.matchAll(/(?<=var\()--\w+(?=\))/g);
        let replacedLength = 0;

        for (const regexp of regexps) {
            const name = regexp[0];
            const index = regexp.index - replacedLength;
            const result = StringUtil.replaceRange(
                syntexText,
                index,
                index + name.length,
                `--${Mangler.instance.cache[name] ? Mangler.instance.transform(name) : name}`
            );

            replacedLength += syntexText.length - result.length;
            syntexText = result;
        }

        return syntexText;
    }
}