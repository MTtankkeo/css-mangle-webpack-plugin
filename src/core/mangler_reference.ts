import { StringUtil } from "../utils/string";
import { Mangler } from "./mangler";
import { ManglerContext } from "./mangler_context";
import { CSSQueryManglerContext, CSSVariableManglerOptions } from "./mangler_transpiler";

export abstract class ManglerReference<T = Mangler> {
    abstract transform(syntaxText: string, context: ManglerContext<T>): string;
}

export class CSSVariableReference extends ManglerReference {
    constructor(public options: CSSVariableManglerOptions) {
        super();
    }

    transform(syntaxText: string, mangler: ManglerContext<Mangler>) {
        const t1 = this.options.literals ? this.transformLiteral(syntaxText, mangler) : syntaxText;
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
        syntaxText: string,
        context: ManglerContext<CSSQueryManglerContext>
    ): string {
        const t1 = this.transformHTML(syntaxText, context);
        const t2 = this.transformObject(t1, context);
        return t2;
    }

    transformHTML(
        syntaxText: string,
        context: ManglerContext<CSSQueryManglerContext>
    ): string {
        const getPropertyRegexps = (name: string) => {
            return new RegExp(`(?<=<[\\w-]+ .*${name}\\s*=\\s*")[\\w\\s-]+(?=".*>)`, "g");
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
                const index = propertyIndex + propertyValue.index + replacedLength;
                if (newName) {
                    const result = StringUtil.replaceRange(
                        syntaxText,
                        index,
                        index + length,
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
    transformObject(
        syntaxText: string,
        context: ManglerContext<CSSQueryManglerContext>
    ): string { // for JSX
        const getPropertyRegexps = (name: string) => {
            return new RegExp(`(?<=\\{.*${name}:\\s*['"])[\\w\\s-]+(?=['"].*\\})`, "g");
        }

        const cProperties = syntaxText.matchAll(getPropertyRegexps("className"));
        const iProperties = syntaxText.matchAll(getPropertyRegexps("id"));

        for (const property of cProperties) {
            console.log(property[0]);
        }

        return syntaxText;
    }
}