import { TimeObjectKeys } from '../../types/timeObject'
import { regex } from '../regex/regex'
import { toNumber } from '../utils/utils'
import {
	ValidateTimeStringProps,
	IsPmHrs24,
	IsPmString12hr,
	IsPmString24hr,
	IsPmTimeObject,
	IsAmHrs24,
	IsAmString12hr,
	IsAmString24hr,
	IsAmTimeObject,
	IsString12hr,
	IsString24hr,
	IsTimeObject,
} from './is.types'

const isValidTimeString = ({ value, format, minHrs, maxHrs }: ValidateTimeStringProps): boolean => {
	const isFormatValid = regex[format].test(value)
	if (!isFormatValid) return false
	const parsedString = regex[format].exec(value) || []
	const hrsVal = toNumber(parsedString[1])
	const minsVal = toNumber(parsedString[2])
	const isHrsValid = hrsVal === '--' || (hrsVal >= minHrs && hrsVal <= maxHrs)
	const isMinsValid = minsVal === '--' || (minsVal >= 0 && minsVal <= 59)
	return isHrsValid && isMinsValid
}

export const isPmHrs24: IsPmHrs24 = (hrs24): boolean => 12 <= hrs24 && hrs24 < 24

export const isPmString12hr: IsPmString12hr = (string12hr): boolean =>
	regex.string12hr.exec(string12hr)?.[3] === 'PM'

export const isPmString24hr: IsPmString24hr = (string24hr): boolean => {
	if (string24hr === '') return false
	const hrs24 = toNumber(regex.string24hr.exec(string24hr)?.[1] || '')
	return typeof hrs24 == 'number' && hrs24 > 11
}

export const isPmTimeObject: IsPmTimeObject = (timeObject): boolean =>
	timeObject.mode === 'PM' || (timeObject.mode === '--' && new Date().getHours() > 11)

export const isAmHrs24: IsAmHrs24 = (hrs24): boolean => hrs24 !== '--' && !isPmHrs24(hrs24)

export const isAmString12hr: IsAmString12hr = (string12hr): boolean =>
	regex.string12hr.test(string12hr) &&
	string12hr.indexOf('--') === -1 &&
	!isPmString12hr(string12hr)

export const isAmString24hr: IsAmString24hr = (string24hr): boolean =>
	string24hr !== '' && !isPmString24hr(string24hr)

export const isAmTimeObject: IsAmTimeObject = (timeObject): boolean => !isPmTimeObject(timeObject)

export const isTimeObject: IsTimeObject = (value): boolean => {
	if (typeof value === 'undefined' || typeof value !== 'object') return false
	const keys = Object.keys(value)
	if (keys.length === 0) return false
	const filteredKeys = TimeObjectKeys.filter((key: string) => keys.indexOf(key) === -1)
	const additionalKeys = keys.filter((key: string) => TimeObjectKeys.indexOf(key) === -1)
	return filteredKeys.length === 0 && additionalKeys.length === 0
}
export const isString12hr: IsString12hr = (value): boolean =>
	isValidTimeString({ value, format: 'string12hr', minHrs: 1, maxHrs: 12 })

export const isString24hr: IsString24hr = (value): boolean => {
	if (value === '') return true
	return isValidTimeString({ value, format: 'string24hr', minHrs: 0, maxHrs: 23 })
}
