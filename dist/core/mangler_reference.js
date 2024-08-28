"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSQueryReference = exports.CSSVariableReference = exports.ManglerReference = void 0;
const string_1 = require("../utils/string");
const mangler_asset_1 = require("./mangler_asset");
const mangler_backrefer_1 = require("./mangler_backrefer");
class ManglerReference {
}
exports.ManglerReference = ManglerReference;
class CSSVariableReference extends ManglerReference {
    options;
    constructor(options) {
        super();
        this.options = options;
    }
    transform(asset, mangler) {
        const t1 = this.options.literals ? this.transformLiteral(asset.syntaxText, mangler) : asset.syntaxText;
        const t2 = this.options.property ? this.transformProperty(t1, mangler) : t1;
        return t2;
    }
    transformLiteral(syntaxText, context) {
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
            const index = regexp.index + replacedLength;
            const mangler = context.parent;
            const oldName = regexp[0];
            const newName = mangler.CSSVariableOf(oldName, context.options.canUndeclared);
            if (newName) {
                const result = string_1.StringUtil.replaceRange(syntaxText, index, index + oldName.length, newName);
                replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
        }
        return syntaxText;
    }
    transformProperty(syntaxText, context) {
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
                const index = (globalIndex + local.index) + replacedLength;
                const mangler = context.parent;
                const oldName = local[0];
                const newName = mangler.CSSVariableOf(oldName, context.options.canUndeclared);
                if (newName) {
                    const result = string_1.StringUtil.replaceRange(syntaxText, index, index + oldName.length, newName);
                    replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
                    syntaxText = result;
                }
            }
        }
        return syntaxText;
    }
}
exports.CSSVariableReference = CSSVariableReference;
class CSSQueryReference extends ManglerReference {
    transform(asset, context) {
        const t1 = this.transformHTML(asset.syntaxText, context);
        if (asset.syntaxType == mangler_asset_1.ManglerAssetType.SCRIPT) {
            return this.transformScript(t1, context);
        }
        else {
            return t1;
        }
    }
    transformHTML(syntaxText, context) {
        const getPropertyRegexps = (name) => {
            return new RegExp(`(?<=<[\\w-]+ .*${name}\\s*=\\s*")[\\w\\s-]+?(?=".*>)`, "g");
        };
        const cRegexps = syntaxText.matchAll(getPropertyRegexps("class"));
        const iRegexps = syntaxText.matchAll(getPropertyRegexps("id"));
        const manglers = context.parent;
        const createPropertyObject = (regexp, prefix, mangler) => {
            return { name: regexp[0], index: regexp.index, prefix, mangler };
        };
        const cProperties = Array.from(cRegexps).map(r => createPropertyObject(r, ".", manglers.classMangler));
        const iProperties = Array.from(iRegexps).map(r => createPropertyObject(r, "#", manglers.idMangler));
        const properties = [...cProperties, ...iProperties];
        for (const property of properties) {
            const propertyValues = property.name.matchAll(/[\w-]+/g);
            const propertyIndex = property.index;
            let replacedLength = 0;
            for (const propertyValue of propertyValues) {
                const oldName = propertyValue[0];
                const newName = property.mangler.CSSPropertyOf(oldName, property.prefix);
                const length = oldName.length;
                const index = propertyIndex + propertyValue.index + replacedLength;
                if (newName) {
                    const result = string_1.StringUtil.replaceRange(syntaxText, index, index + length, newName.replace(property.prefix, ""));
                    replacedLength += string_1.StringUtil.replacedLength(syntaxText, result);
                    syntaxText = result;
                }
            }
        }
        return syntaxText;
    }
    /** TODO: It should be considered about dereference for variables. */
    transformScript(sources, context) {
        const parser = new mangler_backrefer_1.ManglerBackrefer(sources);
        const getIdentifier = (prefix, mangler, value) => {
            const identifiers = [];
            value.split(" ").forEach(name => {
                identifiers.push(mangler.cache.get(prefix + name).identifierName);
            });
            return identifiers.filter(Boolean).join(" ");
        };
        parser.setPropertyByName("className", (oldName) => getIdentifier(".", context.parent.classMangler, oldName));
        parser.setPropertyByName("id", (oldName) => getIdentifier("#", context.parent.idMangler, oldName));
        return parser.code;
    }
}
exports.CSSQueryReference = CSSQueryReference;
