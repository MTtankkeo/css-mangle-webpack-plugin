import { CSSMangleReserved } from "../types";
export interface ManglerContextOptions {
    reversed: CSSMangleReserved;
    canUndeclared: boolean;
}
export declare class ManglerContext<T> {
    options: ManglerContextOptions;
    parent: T;
    constructor(options: ManglerContextOptions, parent: T);
}
