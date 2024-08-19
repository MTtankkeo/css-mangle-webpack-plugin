import { CSSMangleWebpackPlugin } from "./webpack/webpack_plugin";

export { Mangler } from "./core/mangler";
export { ManglerDeclaration, CSSVariableDeclaration } from "./core/mangler_declaration";
export { ManglerReference, CSSVariableReference } from "./core/mangler_reference";
export { ManglerTranspiler } from "./core/mangler_transpiler";

export default CSSMangleWebpackPlugin;