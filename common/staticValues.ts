import { String12hr, String24hr, TimeObject } from '../types/index'

interface BlankValues {
	string12hr: String12hr
	string24hr: String24hr
	timeObject: TimeObject
}

export const blankValues: BlankValues = {
	string12hr: '--:-- --',
	string24hr: '',
	timeObject: {
		hrs24: null,
		hrs12: null,
		minutes: null,
		mode: null,
	},
}

// a11yID needs to be accessed by `@time-input-polyfill/tests`
/** The id for the screen reader accessibility block that is generated */
export const a11yID = 'time-input-polyfill-accessibility-block'
