var typeScript = require('@rollup/plugin-typescript')
var babel = require('rollup-plugin-babel')
var { terser } = require('rollup-plugin-terser')

export default {
	input: 'timeInputPolyfillUtils.ts',
	plugins: [typeScript(), babel(), terser({ output: { comments: false } })],
	output: {
		file: 'dist/time-input-polyfill-utils.min.js',
		format: 'iife',
	},
}
