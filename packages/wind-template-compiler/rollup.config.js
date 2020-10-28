import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'windTemplateCompiler',
    file: 'dist/umd/windTemplateCompiler.js',
    sourceMap: true,
  },
  plugins: [
    babel({
      exclude:'node_modules/**'
    }),
    serve({
      open: true,
      port: 3000,
      contentBase: '',
      openPage:'/index.html'
    })
  ]
};
