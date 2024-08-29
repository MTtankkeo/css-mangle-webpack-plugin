(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./webpack/webpack_plugin"], factory);
    }
})(function (require, exports) {
    "use strict";
    const webpack_plugin_1 = require("./webpack/webpack_plugin");
    return webpack_plugin_1.CSSMangleWebpackPlugin;
});
