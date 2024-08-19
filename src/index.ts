import { Mangler } from "./core/mangler";
import { ManglerParser } from "./core/mangler_parser";
import { ManglerTranspiler } from "./core/mangler_transpiler";

console.log(Mangler.instance.transform("background"));
console.log(Mangler.instance.transform("rearground"));
console.log(Mangler.instance.transform("foreground"));
console.log(Mangler.instance.transform("background"));

const variable = ManglerParser.variable(`
    :root {
        --background: red;
        --foreground: blue;
    }
`)

console.log(variable);

const result = ManglerTranspiler.transform(`
    var(--background)
    var(--foreground)
`);

console.log(result);