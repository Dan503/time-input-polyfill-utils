var typeScript = require('@rollup/plugin-typescript')
var json = require('@rollup/plugin-json')
var babel = require('rollup-plugin-babel')
var { terser } = require('rollup-plugin-terser')

export default {
	input: 'timeInputPolyfillUtils.ts',
	plugins: [
		typeScript({ tsconfig: './tsconfig.prepublish.rollup.json' }),
		json(),
		babel(),
		terser({ output: { comments: false } }),
	],
	output: {
		file: 'dist/time-input-polyfill-utils.min.js',
		format: 'iife',
	},
}
