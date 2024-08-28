
/** Signature for the optional types that is defining identifiers to reserve. */
export type CSSMangleReserved = string[] | RegExp[];

/** Signature for the function that is a builder about renaming identifiers. */
export type ManglerRenameBuilder = (oldName: string) => string;