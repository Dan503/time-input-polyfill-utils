import { Regex } from './regex.types'

/** Regular expressions for checking if time strings match the expected format. */
export const regex: Regex = {
	/** Strictly check for a 01:01 AM style format including zeros in-front of the numbers */
	string12hr: /^([0-9-]{2}):([0-9-]{2})\s(AM|PM|--)$/,
	/** A more lenient check that allows for a 1:1 AM style 12hr format (no zeros in front of numbers) */
	lenientString12hr: /^([0-9-]{1,2}):([0-9-]{1,2})\s(AM|PM|--|-)$/,
	/** Strictly check for a 01:01 style format */
	string24hr: /^$|^([0-9]{2}):([0-9]{2})$/,
	/** A more lenient check that allows for a 1:1 style 24hr format */
	lenientString24hr: /^$|^([0-9]{1,2}):([0-9]{1,2})$/,
	/** Checking for a single letter or number */
	alphaNumericKeyName: /^[A-z0-9]$/,
}
