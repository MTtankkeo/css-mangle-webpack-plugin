import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";
import { ManglerAsset, ManglerAssetType } from "./mangler_asset";
import { ManglerScript } from "./mangler_script";
import { ManglerContext } from "./mangler_context";
import { CSSQueryManglerContext, CSSVariableManglerOptions } from "./mangler_transpiler";

export abstract class ManglerReference<T = Mangler> {
    abstract transform(asset: ManglerAsset, context: ManglerContext<T>): string;
}

export class CSSVariableReference extends ManglerReference {
    constructor(public options: CSSVariableManglerOptions) {
        super();
    }

    transform(asset: ManglerAsset, mangler: ManglerContext<Mangler>) {
        const t1 = this.options.literals ? this.transformLiteral(asset.syntaxText, mangler) : asset.syntaxText;
        const t2 = this.options.property ? this.transformProperty(t1, mangler) : t1;
        return t2;
    }

    transformLiteral(syntaxText: string, context: ManglerContext<Mangler>) {
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
                const result = StringUtil.replaceRange(
                    syntaxText,
                    index,
                    index + oldName.length,
                    newName
                );

                replacedLength += StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
        }

        return syntaxText;
    }

    transformProperty(syntaxText: string, context: ManglerContext<Mangler>) {
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
                    const result = StringUtil.replaceRange(
                        syntaxText,
                        index,
                        index + oldName.length,
                        newName
                    );

                    replacedLength += StringUtil.replacedLength(syntaxText, result);
                    syntaxText = result;
                }
            }
        }

        return syntaxText;
    }
}

export class CSSQueryReference extends ManglerReference<CSSQueryManglerContext> {
    transform(
        asset: ManglerAsset,
        context: ManglerContext<CSSQueryManglerContext>
    ): string {
        const t1 = this.transformHTML(asset.syntaxText, context);

        if (asset.syntaxType == ManglerAssetType.SCRIPT) {
            const t2 = this.transformScript(t1, context);
            const t3 = this.transformSingleQuery(t2, context);
            const t4 = this.transformMultplQuery(t3, context);
            return t4;
        } else {
            return t1;
        }
    }

    transformHTML(
        syntaxText: string,
        context: ManglerContext<CSSQueryManglerContext>
    ): string {
        const getPropertyRegexps = (name: string) => {
            return new RegExp(`(?<=<[\\w-]+ .*${name}\\s*=\\s*")[\\w\\s-]+?(?=".*>)`, "g");
        }

        const cRegexps = syntaxText.matchAll(getPropertyRegexps("class"));
        const iRegexps = syntaxText.matchAll(getPropertyRegexps("id"));
        const manglers = context.parent;

        const createPropertyObject = (regexp: RegExpExecArray, prefix: string, mangler: Mangler) => {
            return {name: regexp[0], index: regexp.index, prefix, mangler};
        }

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
                const gIndex = propertyIndex + propertyValue.index + replacedLength;
                if (newName) {
                    const result = StringUtil.replaceRange(
                        syntaxText,
                        gIndex,
                        gIndex + length,
                        newName.replace(property.prefix, "")
                    );

                    replacedLength += StringUtil.replacedLength(syntaxText, result);
                    syntaxText = result;
                }
            }
        }

        return syntaxText;
    }

    /** TODO: It should be considered about dereference for variables. */
    transformScript(
        sources: string,
        context: ManglerContext<CSSQueryManglerContext>
    ): string { // for JSX
        const parser = new ManglerScript(sources);
        const getIdentifier = (prefix: string, mangler: Mangler, value: string) => {
            const identifiers = [];

            // Splitting given identifier values by "\s"
            value.split(" ").forEach(name => {
                identifiers.push(mangler.cache.get(prefix + name).identifierName);
            });

            return identifiers.filter(Boolean).join(" ");
        }

        const classNameBuilder = (oldName: string) => {
            return getIdentifier(".", context.parent.classMangler, oldName);
        }

        const idNameBuilder = (oldName: string) => {
            return getIdentifier("#", context.parent.idMangler, oldName);
        }

        parser.setPropertyByName("className", classNameBuilder);
        parser.setPropertyByName("id", idNameBuilder);

        return parser.code;
    }

    transformSingleQuery(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string {
        const iRegexpInst = /(?<=\w.(getElementById)\(["'])\s*[\w-]+?\s*(?=["'])/g;
        const cRegexpInst = /(?<=\w.(getElementsByClassName)\(["'])\s*[\w-]+?\s*(?=["'])/g;
        const iRegexpList = Array.from(syntaxText.matchAll(iRegexpInst));
        const cRegexpList = Array.from(syntaxText.matchAll(cRegexpInst));
        const objectList = [
            ...iRegexpList.map(r => {return {type: "id", instance: r}}),
            ...cRegexpList.map(r => {return {type: "class", instance: r}}),
        ];

        let replacedLength = 0;

        for (const object of objectList) {
            const global = object.instance;
            const gIndex = global.index + replacedLength;
            const length = global[0].length;
            const oldName = global[0];
            const newName = object.type == "id"
                ? context.parent.idMangler.CSSPropertyOf(oldName, "#")
                : context.parent.classMangler.CSSPropertyOf(oldName, ".");

            if (newName) {
                const result = StringUtil.replaceRange(
                    syntaxText,
                    gIndex,
                    gIndex + length,
                    newName.replace("#", "").replace(".", "")
                );

                replacedLength += StringUtil.replacedLength(syntaxText, result);
                syntaxText = result;
            }
        }

        return syntaxText;
    }

    transformMultplQuery(syntaxText: string, context: ManglerContext<CSSQueryManglerContext>): string {
        const regexpInst = /(?<=\w.querySelector(All)?\(["'])[^]+?(?=["'])/g;
        const regexpList = syntaxText.matchAll(regexpInst);

        let replacedLength = 0;

        for (const global of regexpList) {
            const gIndex = global.index;
            const localId = Array.from(global[0].matchAll(/(?<=\#)[\w-]+/g)); // id
            const localCl = Array.from(global[0].matchAll(/(?<=\.)[\w-]+/g)); // class
            const objects = [
                ...localId.map(r => {return {type: "id", instance: r}}),
                ...localCl.map(r => {return {type: "class", instance: r}}),
            ];

            for (const object of objects) {
                const localI = object.instance;
                const lIndex = (gIndex + localI.index);
                const length = localI[0].length;
                const oldName = localI[0];
                const newName = object.type == "id"
                    ? context.parent.idMangler.CSSPropertyOf(oldName, "#")
                    : context.parent.classMangler.CSSPropertyOf(oldName, ".");

                if (newName) {
                    const result = StringUtil.replaceRange(
                        syntaxText,
                        lIndex,
                        lIndex + length,
                        newName.replace("#", "").replace(".", "")
                    );

                    replacedLength += StringUtil.replacedLength(syntaxText, result);
                    syntaxText = result;
                }
            }
        }

        return syntaxText;
    }
}