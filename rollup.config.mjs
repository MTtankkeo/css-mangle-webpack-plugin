import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";

const plugins = [
    typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true
    }),
    terser({})
]

/** @type {import("rollup").RollupOptions} */
const options = {
    plugins: plugins,
    input: "./src/index.ts",
    output: [
        {file: "./dist/index.esm.js", format: "esm", name: "CSSMangleWebpackPlugin"},
        {file: "./dist/index.umd.js", format: "umd", name: "CSSMangleWebpackPlugin"}
    ]
}

export default options;