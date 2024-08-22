import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

const plugins = [
    terser(),
    typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true
    })
]

/** @type {import("rollup").RollupOptions} */
const options = {
    plugins: plugins,
    input: "./src/index.ts",
    output: [
        {file: "./dist/index.esm.js", format: "esm", name: "CSSMangleWebpackPlugin", exports: "named"},
        {file: "./dist/index.umd.js", format: "umd", name: "CSSMangleWebpackPlugin", exports: "named"}
    ]
}

export default options;