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
        // - "--background"
        // - '--foreground'
        //
        const regexps1 = syntexText.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);

        // This patterns matched by the following are:
        //
        // - var(--background, rgb(255, 255, 255))
        // - var(--foreground)
        //
        const regexps2 = syntexText.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);

        let replacedLength = 0;

        for (const regexp of regexps1) {
            const name = regexp[0];
            const index = regexp.index - replacedLength;
            const result = StringUtil.replaceRange(
                syntexText,
                index,
                index + name.length,
                Mangler.instance.CSSVariableOf(name)
            );

            replacedLength += syntexText.length - result.length;
            syntexText = result;
        }

        for (const global of regexps2) {
            const locals = global[0].matchAll(/--[\w-]+/g); // split
            const globalIndex = global.index;

            for (const local of locals) {
                const name = local[0];
                const index = (globalIndex + local.index) - replacedLength;
                const result = StringUtil.replaceRange(
                    syntexText,
                    index,
                    index + name.length,
                    Mangler.instance.CSSVariableOf(name)
                )

                replacedLength += syntexText.length - result.length;
                syntexText = result;
            }
        }

        return syntexText;
    }
}