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