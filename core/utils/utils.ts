import { regex } from '../regex/regex'
import {
	MatchesTimeObject,
	ToArray,
	ToLeadingZero,
	ToLeadingZero12HrString,
	ToNumber,
} from './utils.types'

export const toArray: ToArray = (arrayLikeThing) => Array.prototype.slice.call(arrayLikeThing, 0)

export const toNumber: ToNumber = (value) => {
	const number = Number(value)
	return isNaN(number) ? null : number
}

export const toLeadingZero: ToLeadingZero = (value) => {
	if (value === null || value === '-') return '--'
	const number = Number(value)
	if (isNaN(number) && typeof value !== 'number') return value
	return number < 10 ? `0${number}` : `${number}`
}

export const toLeadingZero12HrString: ToLeadingZero12HrString = (
	value: string | null | undefined,
) => {
	if (!value) return '--:-- --'

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_val, hrs, minutes, mode] = regex.lenientString12hr.exec(value) || []

	return `${toLeadingZero(hrs)}:${toLeadingZero(minutes)} ${toLeadingZero(mode)}`
}

/** Utility for checking if 2 time objects match. */
export const matchesTimeObject: MatchesTimeObject = (timeObjA, timeObjB): boolean => {
	const keys = getKeys({ ...timeObjA, ...timeObjB })
	return keys.every((k) => timeObjA[k] === timeObjB[k])
}
