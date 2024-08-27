"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManglerAsset = exports.ManglerAssetType = void 0;
var ManglerAssetType;
(function (ManglerAssetType) {
    ManglerAssetType["SCRIPT"] = "script";
    ManglerAssetType["HTML4"] = "html";
    ManglerAssetType["STYLE"] = "style";
    ManglerAssetType["OTHER"] = "other";
})(ManglerAssetType || (exports.ManglerAssetType = ManglerAssetType = {}));
class ManglerAsset {
    constructor(syntaxText, syntaxType) {
        this.syntaxText = syntaxText;
        this.syntaxType = syntaxType;
    }
}
exports.ManglerAsset = ManglerAsset;
