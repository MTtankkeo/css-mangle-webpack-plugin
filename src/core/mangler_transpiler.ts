import { Mangler } from "./mangler";
import { ManglerDeclaration } from "./mangler_declaration";
import { ManglerReference } from "./mangler_reference";

/**
 * Defines the structure for a Mangler transpiler,
 * including declaration and reference handlers.
 */
export interface ManglerTranspiler {
    /** Handles the declaration of mangled identifiers */
    declaration: ManglerDeclaration;
    /** Manages references to mangled identifiers */
    reference: ManglerReference;
    /** The Mangler instance for string transformation. */
    mangler: Mangler;
}