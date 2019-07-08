import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    external: ["lodash.flow"],
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      terser(),
      sourcemaps()
    ]
  }
];
