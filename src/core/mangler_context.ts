import { CSSMangleReserved } from "../types";

export interface ManglerContextOptions {
    reversed: CSSMangleReserved;
    canUndeclared: boolean,
}

export class ManglerContext<T> {
    constructor(
        public options: ManglerContextOptions,
        public parent: T
    ) {}
}