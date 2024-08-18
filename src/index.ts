import { Mangler } from "./core/mangler";

console.log(Mangler.instance.transform("background"));
console.log(Mangler.instance.transform("rearground"));
console.log(Mangler.instance.transform("foreground"));
console.log(Mangler.instance.transform("background"));