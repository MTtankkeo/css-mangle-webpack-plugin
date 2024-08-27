import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const plugins = [
    terser(),
    resolve(),
    commonjs(),
    typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true
    })
]

const globals = {
    "fs": "require$$1",
    "os": "require$$4"
}

/** @type {import("rollup").RollupOptions} */
const options = {
    plugins: plugins,
    input: "./src/index.ts",
    output: [
        { file: "./dist/index.esm.js", format: "esm", name: "CSSMangleWebpackPlugin", exports: "named", globals: globals },
        { file: "./dist/index.umd.js", format: "umd", name: "CSSMangleWebpackPlugin", exports: "named", globals: globals }
    ]
}

export default options;