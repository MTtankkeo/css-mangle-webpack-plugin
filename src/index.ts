import { CSSMangleWebpackPlugin } from "./webpack/webpack_plugin";

export { Mangler } from "./core/mangler";
export { ManglerParser } from "./core/mangler_parser";
export { ManglerTranspiler } from "./core/mangler_transpiler";

export default CSSMangleWebpackPlugin;