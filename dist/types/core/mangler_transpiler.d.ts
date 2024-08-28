import { Mangler } from "./mangler";
import { ManglerAsset } from "./mangler_asset";
import { ManglerContext, ManglerContextOptions } from "./mangler_context";
import { CSSQueryDeclaration, ManglerDeclaration } from "./mangler_declaration";
import { CSSQueryReference, ManglerReference } from "./mangler_reference";
export declare abstract class ManglerTranspiler<T = Mangler> {
    abstract createMangler(): Mangler;
    abstract createContext(): ManglerContext<T>;
    abstract transform(asset: ManglerAsset): string;
}
/** This class provides functions in general use for the foundation of this package. */
export declare abstract class DrivenManglerTranspiler<T = Mangler> extends ManglerTranspiler<T> {
    context: ManglerContext<T>;
    createMangler(): Mangler;
}
export interface CSSVariableManglerOptions extends ManglerContextOptions {
    property: boolean;
    literals: boolean;
}
export declare class CSSVariableManglerTranspiler extends DrivenManglerTranspiler {
    options: CSSVariableManglerOptions;
    constructor(options: CSSVariableManglerOptions);
    createManglerDeclaration(): ManglerDeclaration;
    createManglerReference(): ManglerReference;
    createContext(): ManglerContext<Mangler>;
    transform(asset: ManglerAsset): string;
}
export interface CSSQueryManglerContext {
    classMangler: Mangler;
    idMangler: Mangler;
}
export declare class CSSQueryManglerTranspiler extends DrivenManglerTranspiler<CSSQueryManglerContext> {
    createManglerDeclaration(): CSSQueryDeclaration;
    createManglerReference(): CSSQueryReference;
    createContext(): ManglerContext<CSSQueryManglerContext>;
    transform(asset: ManglerAsset): string;
}
export interface CSSMinificationManglerOptions {
    rgbToHex: boolean;
    comments: boolean;
}
export declare class CSSMinificationManglerTranspiler extends DrivenManglerTranspiler<undefined> {
    options: CSSMinificationManglerOptions;
    constructor(options: CSSMinificationManglerOptions);
    createContext(): ManglerContext<undefined>;
    transform(asset: ManglerAsset): string;
    transformRGB(syntaxText: string): string;
    transformComments(syntaxText: string): string;
}
