(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../utils/string", "./mangler_asset"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSSQueryDeclaration = exports.CSSVariableDeclaration = exports.ManglerDeclaration = void 0;
    const string_1 = require("../utils/string");
    const mangler_asset_1 = require("./mangler_asset");
    class ManglerDeclaration {
    }
    exports.ManglerDeclaration = ManglerDeclaration;
    class CSSVariableDeclaration extends ManglerDeclaration {
        /**
         * Parse a given syntex strings and based on declare identifier
         * name to [Mangler].
         */
        transform(asset, context) {
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
                const result = string_1.StringUtil.replaceRange(syntaxText, index, index + oldName.length, `--${newName}`);
                replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
            return syntaxText;
        }
    }
    exports.CSSVariableDeclaration = CSSVariableDeclaration;
    class CSSQueryDeclaration extends ManglerDeclaration {
        transform(asset, context) {
            let syntaxText = asset.syntaxText;
            let syntaxType = asset.syntaxType;
            if (syntaxType != mangler_asset_1.ManglerAssetType.STYLE) {
                return syntaxText;
            }
            return this.transformStyle(syntaxText, context);
        }
        transformStyle(syntaxText, context) {
            const syntaxInst = /[.#][\w-]+(?=[^}]+?{[^]*?})/g;
            const syntaxList = syntaxText.matchAll(syntaxInst);
            let replacedLength = 0;
            for (const global of syntaxList) {
                const index = global.index + replacedLength;
                const oldName = global[0];
                const newName = oldName.startsWith("#")
                    ? "#" + context.parent.idMangler.transform(oldName)
                    : "." + context.parent.classMangler.transform(oldName);
                const result = string_1.StringUtil.replaceRange(syntaxText, index, index + oldName.length, newName);
                replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
            return syntaxText;
        }
    }
    exports.CSSQueryDeclaration = CSSQueryDeclaration;
});
