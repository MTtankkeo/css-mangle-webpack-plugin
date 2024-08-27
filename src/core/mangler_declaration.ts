import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";
import { ManglerAsset } from "./mangler_asset";
import { ManglerContext } from "./mangler_context";
import { CSSQueryManglerContext } from "./mangler_transpiler";

export abstract class ManglerDeclaration<T = Mangler> {
    abstract transform(asset: ManglerAsset, context: ManglerContext<T>): string;
}

export class CSSVariableDeclaration extends ManglerDeclaration {
    /**
     * Parse a given syntex strings and based on declare identifier
     * name to [Mangler].
     */
    transform(asset: ManglerAsset, context: ManglerContext<Mangler>): string {
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
        const result1 = asset.syntaxText.matchAll(/--[\w-]+(?=\s*: *.+(;|[\n\s]*}))/g);
        const result2 = asset.syntaxText.matchAll(/(?<=@property )--[\w-]+(?=\s*{[^{}]*})/g);
        const result = [...result1, ...result2];
        let replacedLength = 0;
        let syntaxText = asset.syntaxText;

        for (const global of result) {
            const name = global[0];
            const index = global.index + replacedLength;
            const mangler = context.parent;
            const identifier = mangler.transform(name);
            const result = StringUtil.replaceRange(
                syntaxText,
                index,
                index + name.length,
                `--${identifier}`
            );

            replacedLength += StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }

        return syntaxText;
    }
}

export class CSSQueryDeclaration extends ManglerDeclaration<CSSQueryManglerContext> {
    transform(
        asset: ManglerAsset,
        context: ManglerContext<CSSQueryManglerContext>
    ): string {
        // this syntex is a pseudo-class of CSS.
        //
        // If you want details about it,
        // You can refer to https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors
        //
        // Support attribute operators:
        // - =
        // - ~=
        // - |=
        // - ^=
        // - $=
        // - *=
        //
        // See Also, A pattern such as .name:function(e) may defined from js.
        // (e.g. .clz32:function(e) in React)
        const pesudoClass = /((:|::)(?!function\b)[\w-]+([\(\[][\w-]+([~|^$*]?=((".*?")|('.*?')|\d+)(\s[is])?)?[\)\]])?)?/.source;

        // This syntax matches className IdName that is a selector identifier that is like .a and #b
        const selectorCIPart = /(\.|#)[a-zA-Z0-9_-]+/.source;
        const selectorCI = `${selectorCIPart}${pesudoClass}`;

        // This syntax matches tag-names that is a selector identifier that is like div, *, .a, #b
        const selectorIdPart = /([\w-]*(\.|#)?[a-zA-Z0-9_-]+|\*)/.source;
        const selectorId = `${selectorIdPart}${pesudoClass}`;

        // If you want details about combinators selector of CSS,
        // You can refer to https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Combinators
        const contextCombinators = /[>+~,]/.source;
        const contextBehind = `((\\s+?${selectorId})|(\\s*?${contextCombinators}\\s*?${selectorId}))+?`;

        // This patterns matched by the following are:
        //
        // .a {}
        // #a {}
        // .a #b {}
        // .a:hover {}
        // .a:hover #b {}
        const regexpText = `${selectorCI}(?=\\s*?{|${contextBehind}\\s*?{)`;
        const regexpList = asset.syntaxText.matchAll(/(\.|\#)\w+[^]*?{/g);

        let replacedLength = 0;
        let syntaxText = asset.syntaxText;

        for (const global of regexpList) {
            const estimatedSyntax = global[0]; // wrapped to code block {}.
            const estimatedQuerys = estimatedSyntax.matchAll(new RegExp(regexpText, "g"));

            for (const local of estimatedQuerys) {
                const oldName = local[0];
                const isClass = /^\./.test(oldName);
                const manglers = context.parent;
                const mangler = isClass ? manglers.classMangler : manglers.idMangler;
                const newName = mangler.transform(oldName);
                const length = oldName.length;
                const prefix = isClass ? "." : "#";
                const index = (global.index + local.index) + replacedLength;

                const result = StringUtil.replaceRange(
                    syntaxText,
                    index,
                    index + length,
                    prefix + newName
                );

                replacedLength += StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
        }

        return syntaxText;
    }
}