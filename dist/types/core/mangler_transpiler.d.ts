import { Mangler } from "./mangler";
import { ManglerDeclaration } from "./mangler_declaration";
import { ManglerReference } from "./mangler_reference";
export declare abstract class ManglerTranspiler {
    abstract createManglerDeclaration(): ManglerDeclaration;
    abstract createManglerReference(): ManglerReference;
    abstract createMangler(): Mangler;
    abstract transform(syntaxText: string): string;
}
/** This class provides functions in general use for the foundation of this package. */
export declare abstract class DrivenManglerTranspiler extends ManglerTranspiler {
    manglers: Mangler[];
    createMangler(): Mangler;
}
export interface CSSVariableManglerOptions {
    property: boolean;
    literals: boolean;
}
export declare class CSSVariableManglerTranspiler extends DrivenManglerTranspiler {
    options: CSSVariableManglerOptions;
    constructor(options: CSSVariableManglerOptions);
    createManglerDeclaration(): ManglerDeclaration;
    createManglerReference(): ManglerReference;
    transform(syntaxText: string): string;
}
export declare class CSSQueryManglerTranspiler extends DrivenManglerTranspiler {
    createManglerDeclaration(): ManglerDeclaration;
    createManglerReference(): ManglerReference;
    transform(syntaxText: string): string;
}
