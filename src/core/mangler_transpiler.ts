import { Mangler } from "./mangler";
import { CSSQueryDeclaration, CSSVariableDeclaration, ManglerDeclaration } from "./mangler_declaration";
import { CSSQueryReference, CSSVariableReference, ManglerReference } from "./mangler_reference";

export abstract class ManglerTranspiler {
    abstract createManglerDeclaration(): ManglerDeclaration;
    abstract createManglerReference(): ManglerReference;
    abstract createMangler(): Mangler;
    abstract transform(syntaxText: string): string;
}

/** This class provides functions in general use for the foundation of this package. */
export abstract class DrivenManglerTranspiler extends ManglerTranspiler {
    manglers: Mangler[] = [];

    createMangler(): Mangler {
        const instance = new Mangler();
        return this.manglers.push(instance), instance;
    }
}

export interface CSSVariableManglerOptions {
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

    transform(syntaxText: string): string {
        const mangler = this.manglers[0] ?? this.createMangler();
        const t1 = this.createManglerDeclaration().transform(syntaxText, mangler);
        const t2 = this.createManglerReference().transform(t1, mangler);
        return t2;
    }
}

export class CSSQueryManglerTranspiler extends DrivenManglerTranspiler {
    createManglerDeclaration(): ManglerDeclaration {
        return new CSSQueryDeclaration();
    }

    createManglerReference(): ManglerReference {
        return new CSSQueryReference();
    }

    transform(syntaxText: string): string {
        const mangler = this.manglers[0] ?? this.createMangler();
        const t1 = this.createManglerDeclaration().transform(syntaxText, mangler);
        const t2 = this.createManglerReference().transform(t1, mangler);
        return t2;
    }
}