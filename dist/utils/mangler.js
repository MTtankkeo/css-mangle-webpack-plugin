"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManglerUtil = void 0;
const mangler_asset_1 = require("../core/mangler_asset");
class ManglerUtil {
    static assetTypeOf(assetName) {
        if (assetName.endsWith(".js") || assetName.endsWith(".jsx"))
            return mangler_asset_1.ManglerAssetType.SCRIPT;
        if (assetName.endsWith(".css"))
            return mangler_asset_1.ManglerAssetType.STYLE;
        if (assetName.endsWith(".html"))
            return mangler_asset_1.ManglerAssetType.HTML4;
        return mangler_asset_1.ManglerAssetType.OTHER;
    }
}
exports.ManglerUtil = ManglerUtil;
