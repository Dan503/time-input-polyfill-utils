import { getKeys } from '../../helpers/utils'
import { TimeObjectKey } from '../../types/timeObject'
import { regex } from '../regex/regex'
import { timeObjectKeys } from '../staticValues'
import { toNumber } from '../utils/utils'
import {
	IsAmHrs24,
	IsAmString12hr,
	IsAmString24hr,
	IsAmTimeObject,
	IsCompleteTimeObject,
	IsPmHrs24,
	IsPmString12hr,
	IsPmString24hr,
	IsPmTimeObject,
	IsShiftHeldDown,
	IsString12hr,
	IsString24hr,
	IsTimeObject,
	ValidateTimeStringProps,
} from './is.types'

/** Retrieve the current state of the `[shift]` key. (Warning: will fail if bubbling is prevented) */
export let isShiftHeldDown: IsShiftHeldDown = false

window.addEventListener('keyup', (e) => (isShiftHeldDown = e.shiftKey))
window.addEventListener('keydown', (e) => (isShiftHeldDown = e.shiftKey))

const isValidTimeString = ({ value, format, minHrs, maxHrs }: ValidateTimeStringProps): boolean => {
	const isFormatValid = regex[format].test(value)
	if (!isFormatValid) return false
	const parsedString: Array<string> = regex[format].exec(value) || []
	const hrsVal = toNumber(parsedString[1])
	const minsVal = toNumber(parsedString[2])
	const isHrsValid = hrsVal === null || (hrsVal >= minHrs && hrsVal <= maxHrs)
	const isMinsValid = minsVal === null || (minsVal >= 0 && minsVal <= 59)
	return isHrsValid && isMinsValid
}

/** Check if a 24hr hours value is a PM value. */
export const isPmHrs24: IsPmHrs24 = (hrs24): boolean => hrs24 !== null && 12 <= hrs24 && hrs24 < 24

/** Check if a 12hr string value is a PM value. */
export const isPmString12hr: IsPmString12hr = (string12hr): boolean =>
	regex.string12hr.exec(string12hr)?.[3] === 'PM'

/** Check if a 24hr string value is a PM value. */
export const isPmString24hr: IsPmString24hr = (string24hr): boolean => {
	if (string24hr === '') return false
	const hrs24 = toNumber(regex.string24hr.exec(string24hr)?.[1] || '')
	return typeof hrs24 == 'number' && hrs24 > 11
}

/** Check if a time object is a PM value. */
export const isPmTimeObject: IsPmTimeObject = (timeObject): boolean => {
	if (!timeObject.mode && timeObject.hrs24 !== null) {
		return timeObject.hrs24 > 11
	}
	return timeObject.mode === 'PM'
}

/** Check if a 24hr hours value is an AM value. */
export const isAmHrs24: IsAmHrs24 = (hrs24): boolean => hrs24 !== null && !isPmHrs24(hrs24)

/** Check if a 12hr string value is a AM value. */
export const isAmString12hr: IsAmString12hr = (string12hr): boolean =>
	regex.string12hr.test(string12hr) &&
	string12hr.indexOf('--') === -1 &&
	!isPmString12hr(string12hr)

/** Check if a 24hr string value is a AM value. */
export const isAmString24hr: IsAmString24hr = (string24hr): boolean =>
	string24hr !== '' && !isPmString24hr(string24hr)

/** Check if a time object is a AM value. */
export const isAmTimeObject: IsAmTimeObject = (timeObject): boolean =>
	!isPmTimeObject(timeObject) && isCompleteTimeObject(timeObject)

/** Check if a value is a time object */
export const isTimeObject: IsTimeObject = (value): boolean => {
	if (typeof value === 'undefined' || typeof value !== 'object') return false
	const keys = Object.keys(value)
	if (keys.length === 0) return false
	const filteredKeys = timeObjectKeys.filter((key) => keys.indexOf(key) === -1)
	const additionalKeys = keys.filter((key) => {
		// key might not be a TimeObjectKey but that is exactly what I'm checking for here
		return timeObjectKeys.indexOf(key as TimeObjectKey) === -1
	})
	return filteredKeys.length === 0 && additionalKeys.length === 0
}

/** Check if a time object has no null any values. */
export const isCompleteTimeObject: IsCompleteTimeObject = (timeObject) => {
	if (!isTimeObject(timeObject)) {
		return false
	}
	return getKeys(timeObject).every((key) => timeObject[key] !== null)
}

/** Check if a value is in a 12hr string format. */
export const isString12hr: IsString12hr = (value): boolean =>
	isValidTimeString({ value, format: 'string12hr', minHrs: 1, maxHrs: 12 })

/** Check if a value is in a 24hr string format. */
export const isString24hr: IsString24hr = (value): boolean => {
	if (value === '') return true
	return isValidTimeString({ value, format: 'string24hr', minHrs: 0, maxHrs: 23 })
}
