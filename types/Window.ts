import { Polyfill } from './Polyfill'

// https://github.com/danestves/browser-monads-ts/blob/main/src/index.ts
const win: Window | undefined = window
const doc: Document | undefined = win?.document

declare global {
	// Adds extra properties to the Window interface
	interface Window {
		timeInputPolyfillUtils: Polyfill
		supportsTime?: boolean
	}
}

export { doc, win }
