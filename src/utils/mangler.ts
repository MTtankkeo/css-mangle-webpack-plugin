import { ManglerAssetType } from "../core/mangler_asset";

export class ManglerUtil {
    static assetTypeOf(assetName: string): ManglerAssetType {
        if (assetName.endsWith(".js") || assetName.endsWith(".jsx")) return ManglerAssetType.SCRIPT;
        if (assetName.endsWith(".css")) return ManglerAssetType.STYLE;
        if (assetName.endsWith(".html")) return ManglerAssetType.HTML4;
        return ManglerAssetType.OTHER;
    }
}