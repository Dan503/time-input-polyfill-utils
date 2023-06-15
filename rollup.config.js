var typeScript = require('@rollup/plugin-typescript')
var babel = require('rollup-plugin-babel')
var nodeResolve = require('@rollup/plugin-node-resolve')
var { terser } = require('rollup-plugin-terser')

var tsConfig = require('./tsconfig.umd.json')

export default {
	input: 'timeInputPolyfillUtils.ts',
	plugins: [
		typeScript(),
		nodeResolve({ preferBuiltins: false }),
		babel(),
		terser({ output: { comments: false } }),
	],
	output: {
		file: `${tsConfig.compilerOptions.outDir}/time-input-polyfill-utils.min.js`,
		format: 'umd',
	},
}
