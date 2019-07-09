import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import pkg from "./package.json";

export default [
  {
    /** The starting point for the build process */
    input: "src/index.js",

    /** A list of libraries that should not be included in the final bundle */
    external: ["lodash.flow"],

    /** A list of output files produced by the build */
    output: [
      // CommonJS-compatible output
      { file: pkg.main, format: "cjs", sourcemap: true },

      // ES modules-compatible output, automatically used by ESM-aware tools
      // like Rollup or webpack 2+
      { file: pkg.module, format: "es", sourcemap: true }
    ],

    /** The plugins which transform the code that is output */
    plugins: [
      // resolves local folders as modules which allows importing a folder with
      // an index.js file
      resolve(),

      // allows rollup to handle importing CommonJS-formatted modules
      commonjs(),

      // enables babel syntax
      babel({
        exclude: "node_modules/**"
      }),

      // minifies the codebase
      terser(),

      // produces sourcemaps for the produced code
      sourcemaps()
    ]
  }
];
