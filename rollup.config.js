import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    external: ["lodash.flow"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      })
    ]
  }
];
