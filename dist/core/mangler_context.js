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
    exports.ManglerContext = void 0;
    class ManglerContext {
        options;
        parent;
        constructor(options, parent) {
            this.options = options;
            this.parent = parent;
        }
    }
    exports.ManglerContext = ManglerContext;
});
