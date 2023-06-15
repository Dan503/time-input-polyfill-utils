import { document, window } from 'browser-monads-ts'
import { Polyfill } from './Polyfill'

declare global {
	// Adds extra properties to the Window interface
	interface Window {
		timeInputPolyfillUtils: Polyfill
		supportsTime?: boolean
	}
}

// Needed for telling Typescript that this file can be imported
// Exporting the browser-monads-ts window and document here so ts knows about the extra Window interface props
export { document, window }
