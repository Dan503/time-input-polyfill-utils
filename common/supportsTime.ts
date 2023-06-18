import { doc, win } from '../types/Window'
// This is intentionally separate from index.ts since it needs to be downloaded in modern browsers

// https://stackoverflow.com/a/10199306/1611058
function get_time_support(): boolean {
	const input = doc?.createElement('input')

	if (!input) {
		return false
	}

	input.setAttribute('type', 'time')

	const notValid = 'not-a-time'
	input.setAttribute('value', notValid)

	return input.value !== notValid
}

const supportsTime = get_time_support()

if (win) {
	win.supportsTime = supportsTime
}

export default supportsTime
export { supportsTime }
