import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export abstract class ManglerReference {
    abstract transform(syntexText: string): string;
}

export class CSSVariableReference extends ManglerReference {
    transform(syntexText: string) {
        // References to CSS variables generally have a unique syntax,
        // but it can vary in different environments.
        //
        // Additionally, referencing variables is common not only in CSS-related files,
        // but also in script environments like `JS`, `JSX`, or bundled package scripts
        // where CSS variables might be declared or referenced.
        // 
        // This patterns matched by the following are:
        //
        // - var(--background)
        // - var(--foreground)
        // - "--background"
        // - "--foreground"
        //
        const regexps = syntexText.matchAll(/(?<=var\()--[\w-]+(?=\))|((?<="|')--[\w-]+(?="|'))/g);
        let replacedLength = 0;

        for (const regexp of regexps) {
            const name = regexp[0];
            const index = regexp.index - replacedLength;
            const result = StringUtil.replaceRange(
                syntexText,
                index,
                index + name.length,
                Mangler.instance.cache[name] ? `--${Mangler.instance.transform(name)}` : name
            );

            replacedLength += syntexText.length - result.length;
            syntexText = result;
        }

        return syntexText;
    }
}