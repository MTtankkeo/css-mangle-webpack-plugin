import { CSSMangleReserved } from "../types";

export class ManglerContext<T> {
    constructor(
        public options: {reversed: CSSMangleReserved},
        public parent: T
    ) {}
}