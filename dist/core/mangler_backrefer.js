"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManglerBackrefer = void 0;
const recast = require("recast");
class ManglerBackrefer {
    source;
    ast;
    constructor(source) {
        this.source = source;
        this.ast = recast.parse(source);
    }
    setPropertyByName(name, builder) {
        recast.visit(this.ast, {
            visitProperty(path) {
                const kName = path.node.key["name"];
                const value = path.node.value;
                if (kName == name && value.type == "Literal") { // a given name of object property.
                    path.node.value = recast.types.builders.literal(builder(value.value));
                }
                return false;
            }
        });
    }
    get code() {
        return recast.print(this.ast).code;
    }
}
exports.ManglerBackrefer = ManglerBackrefer;
