export declare enum ManglerAssetType {
    SCRIPT = "script",
    HTML4 = "html",
    STYLE = "style",
    OTHER = "other"
}
export declare class ManglerAsset {
    syntaxText: string;
    syntaxType: ManglerAssetType;
    constructor(syntaxText: string, syntaxType: ManglerAssetType);
}
