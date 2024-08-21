import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";

export abstract class ManglerDeclaration {
    abstract transform(syntexText: string, mangler: Mangler): string;
}

export class CSSVariableDeclaration extends ManglerDeclaration {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    transform(syntexText: string, mangler: Mangler): string {
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
        const syntax1 = syntexText.matchAll(/--[\w-]+(?=\s*: ?.+;)/g);
        const syntax2 = syntexText.matchAll(/(?<=@property )--[a-zA-Z0-9_-]+(?=\s*{[^{}]*})/g);
        const syntaxs = [...syntax1, ...syntax2];
        let replacedLength = 0;

        for (const regexp of syntaxs) {
            const name = regexp[0];
            const index = regexp.index - replacedLength;
            const newName = mangler.transform(name);
            const result = StringUtil.replaceRange(syntexText, index, index + name.length, `--${newName}`);

            replacedLength += syntexText.length - result.length;
            syntexText = result;
        }

        return syntexText;
    }
}

export class CSSQueryDeclaration extends ManglerDeclaration {
    transform(syntexText: string, mangler: Mangler): string {
        // this syntex is a pseudo-class of CSS.
        const pesudoClass = /((:|::)?[\w]+(\([\w='"]+\))?)?/.source;

        // This syntax is a selector identifier that is like .a and #b
        const selectorId = /[a-zA-Z0-9_-]+/.source;

        // This syntax is a selector identifier that is like:
        // .a
        // #b
        // .a:hover
        // #b:hover
        const ids = `${selectorId}`;

        const ctx = `(\\s+(\\w*(\\.|\\#)${ids})?\\s*)*\\{`;

        // This patterns matched by the following are:
        //
        // .a {}
        // #a {}
        // .a #b {}
        // .a:hover {}
        // .a:hover #b {}
        const syntaxText = `(?<=(\\.|\\#))${ids}(?=${ctx})`;
        const syntaxList = syntexText.matchAll(new RegExp(syntaxText, "g"));

        console.log(syntaxText);

        for (const global of syntaxList) {
            console.log(global[0])
        }

        return syntexText;
    }
}