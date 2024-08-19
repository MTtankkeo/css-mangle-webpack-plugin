import { Mangler } from "./mangler";
import { ManglerDeclaration } from "./mangler_declaration";
import { ManglerReference } from "./mangler_reference";

export interface ManglerTranspiler {
    declaration: ManglerDeclaration;
    reference: ManglerReference;
    mangler: Mangler;
}