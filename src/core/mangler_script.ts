import { ManglerRenameBuilder } from "../types";
import { NodePath } from "ast-types/lib/node-path";
import * as recast from "recast";

export class ManglerScript {
    ast: any;

    constructor(public source: string) {
        this.ast = recast.parse(source);
    }

    setPropertyByName(name: string, builder: ManglerRenameBuilder) {
        recast.visit(this.ast, {
            visitProperty: (path) => {
                const kName: string = path.node.key["name"];
                const value = path.node.value;

                if (kName == name && value.type == "Literal") { // a given name of object property.
                    path.node.value = recast.types.builders.literal(builder(value.value as string));
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

    get code(): string {
        return recast.print(this.ast).code;
    }
}