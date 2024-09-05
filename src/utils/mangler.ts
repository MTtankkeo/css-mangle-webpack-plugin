import { ManglerAssetType } from "../core/mangler_asset";

export class ManglerUtil {
    /** Gets a given asset name of the resource type for mangler. */
    static assetTypeOf(assetName: string): ManglerAssetType {
        if (assetName.endsWith(".js") || assetName.endsWith(".jsx")) {
            return ManglerAssetType.SCRIPT;
        }

        if (assetName.endsWith(".css")) {
            return ManglerAssetType.STYLE;
        }

        if (assetName.endsWith(".html")) {
            return ManglerAssetType.HTML4;
        }

        return ManglerAssetType.OTHER;
    }
}