"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSMinificationManglerTranspiler = exports.CSSQueryManglerTranspiler = exports.CSSVariableManglerTranspiler = exports.DrivenManglerTranspiler = exports.ManglerTranspiler = void 0;
const string_1 = require("../utils/string");
const mangler_1 = require("./mangler");
const mangler_asset_1 = require("./mangler_asset");
const mangler_context_1 = require("./mangler_context");
const mangler_declaration_1 = require("./mangler_declaration");
const mangler_reference_1 = require("./mangler_reference");
class ManglerTranspiler {
}
exports.ManglerTranspiler = ManglerTranspiler;
/** This class provides functions in general use for the foundation of this package. */
class DrivenManglerTranspiler extends ManglerTranspiler {
    context;
    createMangler() {
        return new mangler_1.Mangler();
    }
}
exports.DrivenManglerTranspiler = DrivenManglerTranspiler;
class CSSVariableManglerTranspiler extends DrivenManglerTranspiler {
    options;
    constructor(options) {
        super();
        this.options = options;
    }
    createManglerDeclaration() {
        return new mangler_declaration_1.CSSVariableDeclaration();
    }
    createManglerReference() {
        return new mangler_reference_1.CSSVariableReference(this.options);
    }
    createContext() {
        return new mangler_context_1.ManglerContext(this.options, this.createMangler());
    }
    transform(asset) {
        const context = this.context ?? this.createContext();
        const t1 = this.createManglerDeclaration().transform(asset, context);
        const t2 = this.createManglerReference().transform(((asset.syntaxText = t1), asset), context);
        return t2;
    }
}
exports.CSSVariableManglerTranspiler = CSSVariableManglerTranspiler;
class CSSQueryManglerTranspiler extends DrivenManglerTranspiler {
    createManglerDeclaration() {
        return new mangler_declaration_1.CSSQueryDeclaration();
    }
    createManglerReference() {
        return new mangler_reference_1.CSSQueryReference();
    }
    createContext() {
        return new mangler_context_1.ManglerContext({ reversed: [], canUndeclared: false }, {
            classMangler: this.createMangler(),
            idMangler: this.createMangler()
        });
    }
    transform(asset) {
        const context = this.context ?? this.createContext();
        const t1 = this.createManglerDeclaration().transform(asset, context);
        const t2 = this.createManglerReference().transform(((asset.syntaxText = t1), asset), context);
        return t2;
    }
}
exports.CSSQueryManglerTranspiler = CSSQueryManglerTranspiler;
class CSSMinificationManglerTranspiler extends DrivenManglerTranspiler {
    options;
    constructor(options) {
        super();
        this.options = options;
    }
    createContext() {
        return undefined;
    }
    transform(asset) {
        if (asset.syntaxType != mangler_asset_1.ManglerAssetType.STYLE) {
            return asset.syntaxText;
        }
        const t1 = this.options.rgbToHex ? this.transformRGB(asset.syntaxText) : asset.syntaxText;
        const t2 = this.options.comments ? this.transformComments(asset.syntaxText) : t1;
        return t2;
    }
    transformRGB(syntaxText) {
        const regexpInst = /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[0-1]+(\.\d+)?\s*)?\)/g;
        const syntaxList = syntaxText.matchAll(regexpInst);
        let replacedLength = 0;
        for (const global of syntaxList) {
            const rgbText = global[0].match(/(?<=\().+?(?=\))/g);
            const rgbStrs = rgbText[0].replaceAll(" ", "").split(",");
            const rgbNums = rgbStrs.map((str, index) => {
                if (index == 3) { // is opacity
                    return Math.round(parseFloat(str) * 255) % 255 || null;
                }
                return parseInt(str);
            });
            const rgbHexs = rgbNums.filter(v => v != null).map(val => val?.toString(16)); // to Hexadecimal
            const rgbHexStr = "#" + rgbHexs.join("");
            const index = global.index + replacedLength;
            const length = global[0].length;
            const result = string_1.StringUtil.replaceRange(syntaxText, index, index + length, rgbHexStr);
            replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }
        return syntaxText;
    }
    transformComments(syntaxText) {
        const regexpInst = /\n?\/\*[^]+?\*\//g;
        const regexpList = syntaxText.matchAll(regexpInst);
        let replacedLength = 0;
        for (const global of regexpList) {
            const inner = global[0];
            const index = global.index + replacedLength;
            const length = inner.length;
            const result = string_1.StringUtil.replaceRange(syntaxText, index, index + length, "" // to empty string.
            );
            replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }
        return syntaxText;
    }
}
exports.CSSMinificationManglerTranspiler = CSSMinificationManglerTranspiler;
