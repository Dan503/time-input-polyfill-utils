import '../types/Window'

const alreadyCalledSources: Array<string> = []
const loadedSources: Array<string> = []

interface Callbacks {
	[key: string]: Array<Function>
}

const awaitingCallbacks: Callbacks = {}

const addCallback = (src: string, callback: Function): void => {
	if (awaitingCallbacks[src]) {
		awaitingCallbacks[src].push(callback)
	} else {
		awaitingCallbacks[src] = [callback]
	}
}

export default function loadJS(src: string, callback: Function): void {
	if (alreadyCalledSources.indexOf(src) < 0) {
		alreadyCalledSources.push(src)
		const script = document.createElement('script')
		script.src = src
		script.onload = (): any => {
			addCallback(src, callback)

			for (const key in awaitingCallbacks) {
				awaitingCallbacks[key].forEach(cb => cb())
			}
		}
		document.head.appendChild(script)
	} else {
		addCallback(src, callback)
	}
}
