import { ManglerDeclaration } from "./mangler_declaration";
import { ManglerDefinition } from "./mangler_reference";
export interface ManglerTranspiler {
    declaration: ManglerDeclaration;
    reference: ManglerDefinition;
}
