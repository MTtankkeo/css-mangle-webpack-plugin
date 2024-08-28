import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";
import { ManglerAsset, ManglerAssetType } from "./mangler_asset";
import { ManglerContext, ManglerContextOptions } from "./mangler_context";
import { CSSQueryDeclaration, CSSVariableDeclaration, ManglerDeclaration } from "./mangler_declaration";
import { CSSQueryReference, CSSVariableReference, ManglerReference } from "./mangler_reference";

export abstract class ManglerTranspiler<T = Mangler> {
    abstract createMangler(): Mangler;
    abstract createContext(): ManglerContext<T>;
    abstract transform(asset: ManglerAsset): string;
}

/** This class provides functions in general use for the foundation of this package. */
export abstract class DrivenManglerTranspiler<T = Mangler> extends ManglerTranspiler<T> {
    context: ManglerContext<T>;

    createMangler(): Mangler {
        return new Mangler();
    }
}

export interface CSSVariableManglerOptions extends ManglerContextOptions {
    property: boolean;
    literals: boolean;
}

export class CSSVariableManglerTranspiler extends DrivenManglerTranspiler {
    constructor(public options: CSSVariableManglerOptions) {
        super();
    }

    createManglerDeclaration(): ManglerDeclaration {
        return new CSSVariableDeclaration();
    }

    createManglerReference(): ManglerReference {
        return new CSSVariableReference(this.options);
    }

    createContext(): ManglerContext<Mangler> {
        return new ManglerContext(this.options, this.createMangler());
    }

    transform(asset: ManglerAsset): string {
        const context = this.context ??= this.createContext();
        const t1 = this.createManglerDeclaration().transform(asset, context);
        const t2 = this.createManglerReference().transform(((asset.syntaxText = t1), asset), context);
        return t2;
    }
}

export interface CSSQueryManglerContext {
    classMangler: Mangler;
    idMangler: Mangler;
}

export class CSSQueryManglerTranspiler extends DrivenManglerTranspiler<CSSQueryManglerContext> {
    createManglerDeclaration(): CSSQueryDeclaration {
        return new CSSQueryDeclaration();
    }

    createManglerReference(): CSSQueryReference {
        return new CSSQueryReference();
    }

    createContext(): ManglerContext<CSSQueryManglerContext> {
        return new ManglerContext({reversed: [], canUndeclared: false}, {
            classMangler: this.createMangler(),
            idMangler: this.createMangler()
        });
    }

    transform(asset: ManglerAsset): string {
        const context = this.context ??= this.createContext();
        const t1 = this.createManglerDeclaration().transform(asset, context);
        const t2 = this.createManglerReference().transform(((asset.syntaxText = t1), asset), context);
        return t2;
    }
}

export interface CSSMinificationManglerOptions {
    rgbToHex: boolean;
    comments: boolean;
    // escapeSequence: boolean;
}

export class CSSMinificationManglerTranspiler extends DrivenManglerTranspiler<undefined> {
    constructor(public options: CSSMinificationManglerOptions) {
        super();
    }

    createContext(): ManglerContext<undefined> {
        return undefined;
    }

    transform(asset: ManglerAsset): string {
        if (asset.syntaxType != ManglerAssetType.STYLE) {
            return asset.syntaxText;
        }

        const t1 = this.options.rgbToHex ? this.transformRGB(asset.syntaxText) : asset.syntaxText;
        const t2 = this.options.comments ? this.transformComments(t1) : t1;
        // const t3 = this.options.escapeSequence ? this.transformEscapeSequence(t2) : t2;
        return t2;
    }

    transformRGB(syntaxText: string): string {
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

            const result = StringUtil.replaceRange(
                syntaxText,
                index,
                index + length,
                rgbHexStr
            );

            replacedLength += StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }

        return syntaxText;
    }

    transformComments(syntaxText: string): string {
        const regexpInst = /\n?\/\*[^]+?\*\//g;
        const regexpList = syntaxText.matchAll(regexpInst);

        let replacedLength = 0;

        for (const global of regexpList) {
            const inner = global[0];
            const index = global.index + replacedLength;
            const length = inner.length;
            const result = StringUtil.replaceRange(
                syntaxText,
                index,
                index + length,
                "" // to empty string.
            );

            replacedLength += StringUtil.replacedLength(syntaxText, result);
            syntaxText = result;
        }

        return syntaxText;
    }

    transformEscapeSequence(syntaxText: string): string {
        const ignoreRegexpInst = /".+?"|'.+?'|\/\*.+?\*\//g; // Refer to safe-area.
        const ignoreRegexpList = syntaxText.matchAll(ignoreRegexpInst);
        const ignoreRanges: {start: number, end: number}[] = [];

        for (const global of ignoreRegexpList) {
            ignoreRanges.push({start: global.index, end: global.index + global[0].length});
        }

        const regexpInst = /[\n\s]+?/g;
        const regexpList = syntaxText.matchAll(regexpInst);

        let replacedLength = 0;
        
        for (const global of regexpList) {
            const inner = global[0];
            const index = global.index + replacedLength;
            const length = inner.length;
            const inRange = ignoreRanges.find(r => r.start <= index && r.end >= index);
            const isIgnore = inRange != null;
            if (!isIgnore) {
                const result = StringUtil.replaceRange(
                    syntaxText,
                    index,
                    index + length,
                    "" // to empty string.
                );

                replacedLength += StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
        }

        return syntaxText;
    }
}