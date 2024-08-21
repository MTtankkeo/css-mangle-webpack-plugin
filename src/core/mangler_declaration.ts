import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export abstract class ManglerDeclaration {
    abstract transform(syntaxText: string, mangler: Mangler): string;
}

export class CSSVariableDeclaration extends ManglerDeclaration {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    transform(syntaxText: string, mangler: Mangler): string {
        // In CSS variable declarations, a unique syntax is generally used,
        // making identification relatively straightforward.
        //
        // This patterns matched by the following are:
        //
        // --background: white;
        // --rearground: rgb(240, 242, 246);
        // --foreground: black;
        //
        // @property --logo-color { ... }
        //
        // See Also, where "background" is a unique identifier,
        // so any character form is acceptable.
        //
        const result1 = syntaxText.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g);
        const result2 = syntaxText.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g);
        const result = [...result1, ...result2];
        let replacedLength = 0;

        for (const global of result) {
            const name = global[0];
            const index = global.index - replacedLength;
            const identifier = mangler.transform(name);
            const result = StringUtil.replaceRange(
                syntaxText,
                index,
                index + name.length,
                `--${identifier}`
            );

            replacedLength += syntaxText.length - result.length;
            syntaxText = result;
        }

        return syntaxText;
    }
}

export class CSSQueryDeclaration extends ManglerDeclaration {
    transform(syntaxText: string, mangler: Mangler): string {
        // this syntex is a pseudo-class of CSS.
        const pesudoClass = /((:|::)\w+(\([\w='"]+\))?)?/.source;

        // This syntax matches className IdName that is a selector identifier that is like .a and #b
        const selectorCIPart = /(\.|.#)[a-zA-Z0-9_-]+/.source;
        const selectorCI = `${selectorCIPart}${pesudoClass}`;

        const selectorIdPart = /(\.|.#)?[a-zA-Z0-0_-]+/.source;
        const selectorId = `${selectorIdPart}${pesudoClass}`;

        const contextBehind = `\\s+(\\w*(${selectorId})?)\\s*`;

        // This patterns matched by the following are:
        //
        // .a {}
        // #a {}
        // .a #b {}
        // .a:hover {}
        // .a:hover #b {}
        const regexpText = `${selectorCI}(?=(${contextBehind})*\\{)`;
        const regexpList = syntaxText.matchAll(new RegExp(regexpText, "g"));

        console.log(regexpText);

        for (const global of regexpList) {
            console.log(global[0])
        }

        return syntaxText;
    }

    transformId() {

    }

    transformClass() {

    }
}