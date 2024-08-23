import { Mangler } from "./mangler";
import { ManglerContext, ManglerContextOptions } from "./mangler_context";
import { CSSQueryDeclaration, CSSVariableDeclaration, ManglerDeclaration } from "./mangler_declaration";
import { CSSQueryReference, CSSVariableReference, ManglerReference } from "./mangler_reference";

export abstract class ManglerTranspiler<T = Mangler> {
    abstract createManglerDeclaration(): ManglerDeclaration<T>;
    abstract createManglerReference(): ManglerReference<T>;
    abstract createMangler(): Mangler;
    abstract createContext(): ManglerContext<T>;
    abstract transform(syntaxText: string): string;
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

    transform(syntaxText: string): string {
        const context = this.context ?? this.createContext();
        const t1 = this.createManglerDeclaration().transform(syntaxText, context);
        const t2 = this.createManglerReference().transform(t1, context);
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

    transform(syntaxText: string): string {
        const context = this.context ?? this.createContext();
        const t1 = this.createManglerDeclaration().transform(syntaxText, context);
        const t2 = this.createManglerReference().transform(t1, context);
        return t2;
    }
}