(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
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
        syntaxText;
        syntaxType;
        constructor(syntaxText, syntaxType) {
            this.syntaxText = syntaxText;
            this.syntaxType = syntaxType;
        }
    }
    exports.ManglerAsset = ManglerAsset;
});
