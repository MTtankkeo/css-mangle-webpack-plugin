(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "recast"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ManglerScript = void 0;
    const recast = require("recast");
    class ManglerScript {
        source;
        ast;
        constructor(source) {
            this.source = source;
            this.ast = recast.parse(source);
        }
        setPropertyByName(name, builder) {
            recast.visit(this.ast, {
                visitProperty: (path) => {
                    const kName = path.node.key["name"];
                    const value = path.node.value;
                    if (kName == name && value.type == "Literal") { // a given name of object property.
                        path.node.value = recast.types.builders.literal(builder(value.value));
                    }
                    return false;
                }
            });
        }
        /*
        setPropertyLiteralByNode(path: NodePath<recast.types.ASTNode>) {
            console.log(path.value);
        }
        */
        get code() {
            return recast.print(this.ast).code;
        }
    }
    exports.ManglerScript = ManglerScript;
});
