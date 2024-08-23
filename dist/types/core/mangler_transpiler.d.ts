import { Mangler } from "./mangler";
import { ManglerContext } from "./mangler_context";
import { CSSQueryDeclaration, ManglerDeclaration } from "./mangler_declaration";
import { CSSQueryReference, ManglerReference } from "./mangler_reference";
export declare abstract class ManglerTranspiler<T = Mangler> {
    abstract createManglerDeclaration(): ManglerDeclaration<T>;
    abstract createManglerReference(): ManglerReference<T>;
    abstract createMangler(): Mangler;
    abstract createContext(): ManglerContext<T>;
    abstract transform(syntaxText: string): string;
}
/** This class provides functions in general use for the foundation of this package. */
export declare abstract class DrivenManglerTranspiler<T = Mangler> extends ManglerTranspiler<T> {
    context: ManglerContext<T>;
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
    createContext(): ManglerContext<Mangler>;
    transform(syntaxText: string): string;
}
export interface CSSQueryManglerContext {
    classMangler: Mangler;
    idMangler: Mangler;
}
export declare class CSSQueryManglerTranspiler extends DrivenManglerTranspiler<CSSQueryManglerContext> {
    createManglerDeclaration(): CSSQueryDeclaration;
    createManglerReference(): CSSQueryReference;
    createContext(): ManglerContext<CSSQueryManglerContext>;
    transform(syntaxText: string): string;
}
