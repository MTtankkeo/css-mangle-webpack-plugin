
export enum ManglerAssetType {
    SCRIPT = "script",
    HTML4 = "html",
    STYLE = "style",
    OTHER = "other",
}

export class ManglerAsset {
    constructor(
        public syntaxText: string,
        public syntaxType: ManglerAssetType
    ) {}
}