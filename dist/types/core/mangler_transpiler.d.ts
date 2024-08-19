import { ManglerDeclaration } from "./mangler_declaration";
import { ManglerDefinition } from "./mangler_definition";
export interface ManglerTranspiler {
    declaration: ManglerDeclaration;
    definition: ManglerDefinition;
}
