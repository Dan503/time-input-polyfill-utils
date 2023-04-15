var typeScript = require('@rollup/plugin-typescript')
var babel = require('rollup-plugin-babel')
var { terser } = require('rollup-plugin-terser')

var tsConfig = require('./tsconfig.prepublish.json')

export default {
	input: 'timeInputPolyfillUtils.ts',
	plugins: [typeScript(), babel(), terser({ output: { comments: false } })],
	output: {
		file: `${tsConfig.compilerOptions.outDir}/time-input-polyfill-utils.min.js`,
		format: 'umd',
	},
}
