const fs = require('fs')

const cjs = {
	content: '{ "type": "commonjs" }',
	folderName: 'cjs',
}
const mjs = {
	content: '{ "type": "module" }',
	folderName: 'mjs',
}

const createPkgFile = (config) => {
	const path = `dist/${config.folderName}/package.json`
	fs.writeFile(path, config.content, (err) => {
		if (err) throw err
		console.log(`\n${path} created\n`)
	})
}

createPkgFile(cjs)
createPkgFile(mjs)
