import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";
import { ManglerAsset, ManglerAssetType } from "./mangler_asset";
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
            const index = global.index + replacedLength;
            const mangler = context.parent;
            const oldName = global[0];
            const newName = mangler.transform(oldName);
            const result = StringUtil.replaceRange(
                syntaxText,
                index,
                index + oldName.length,
                `--${newName}`
            );

            replacedLength += StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }

        return syntaxText;
    }
}

export class CSSQueryDeclaration extends ManglerDeclaration<CSSQueryManglerContext> {
    transform(asset: ManglerAsset, context: ManglerContext<CSSQueryManglerContext>): string {
        let syntaxText = asset.syntaxText;
        let syntaxType = asset.syntaxType;
        if (syntaxType != ManglerAssetType.STYLE) {
            return syntaxText;
        }

        return this.transformStyle(syntaxText, context);
    }

    transformStyle(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string {
        const syntaxInst = /[.#][\w-]+(?=[^}]+?{[^]*?})/g;
        const syntaxList = syntaxText.matchAll(syntaxInst);

        let replacedLength = 0;

        for (const global of syntaxList) {
            const index = global.index + replacedLength;
            const oldName = global[0];
            const newName = oldName.startsWith("#")
                ? "#" + context.parent.idMangler.transform(oldName)
                : "." + context.parent.classMangler.transform(oldName);

            const result = StringUtil.replaceRange(
                syntaxText,
                index,
                index + oldName.length,
                newName
            );

            replacedLength += StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }

        return syntaxText;
    }
}