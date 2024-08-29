import { ManglerRenameBuilder } from "../types";
export declare class ManglerScript {
    source: string;
    ast: any;
    constructor(source: string);
    setPropertyByName(name: string, builder: ManglerRenameBuilder): void;
    get code(): string;
}
