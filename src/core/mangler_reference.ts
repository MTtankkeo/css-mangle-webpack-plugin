import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";
import { CSSVariableManglerOptions } from "./mangler_transpiler";

export abstract class ManglerReference {
    abstract transform(syntaxText: string, mangler: Mangler): string;
}

export class CSSVariableReference extends ManglerReference {
    constructor(public options: CSSVariableManglerOptions) {
        super();
    }

    transform(syntaxText: string, mangler: Mangler) {
        const t1 = this.options.literals ? this.transformLiteral(syntaxText, mangler) : syntaxText;
        const t2 = this.options.property ? this.transformProperty(t1, mangler) : t1;
        return t2;
    }

    transformLiteral(syntaxText: string, mangler: Mangler) {
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
        const regexps = syntaxText.matchAll(/(?<="|')--[\w-]+(?=\\?\"|')/g);

        let replacedLength = 0;

        for (const regexp of regexps) {
            const name = regexp[0];
            const index = regexp.index + replacedLength;
            const identifier = mangler.CSSVariableOf(name);

            if (identifier) {
                const result = StringUtil.replaceRange(
                    syntaxText,
                    index,
                    index + name.length,
                    identifier
                );

                replacedLength -= StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
        }

        return syntaxText;
    }

    transformProperty(syntaxText: string, mangler: Mangler) {
        // This patterns matched by the following are:
        //
        // - var(--background, rgb(255, 255, 255))
        // - var(--foreground)
        //
        const regexps = syntaxText.matchAll(/(?<=var\()[^()]*(?:\([^\)]*\)[^()]*)*(?=\))/g);

        let replacedLength = 0;

        for (const global of regexps) {
            const locals = global[0].matchAll(/--[\w-]+/g); // split
            const globalIndex = global.index;

            for (const local of locals) {
                const name = local[0];
                const index = (globalIndex + local.index) + replacedLength;
                const identifier = mangler.CSSVariableOf(name);

                if (identifier) {
                    const result = StringUtil.replaceRange(
                        syntaxText,
                        index,
                        index + name.length,
                        identifier
                    );

                    replacedLength -= StringUtil.replacedLength(syntaxText, result);
                    syntaxText = result;
                }
            }
        }

        return syntaxText;
    }
}

export class CSSQueryReference extends ManglerReference {
    transform(syntexText: string, mangler: Mangler): string {
        return syntexText;
    }
}