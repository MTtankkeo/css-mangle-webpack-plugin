import { CSSMangleReserved } from "../types";
export declare class ManglerContext<T> {
    options: {
        reversed: CSSMangleReserved;
    };
    parent: T;
    constructor(options: {
        reversed: CSSMangleReserved;
    }, parent: T);
}
