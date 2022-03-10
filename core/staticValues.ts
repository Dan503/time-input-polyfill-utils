import { MaxAndMins, Ranges, Segment, SelectionRange, TimeObjectKey } from '../types/index'
import universalValues from '../universalValues.json'

export const ranges: Ranges = {
	hrs12: { start: 0, end: 2, segment: 'hrs12' },
	minutes: { start: 3, end: 5, segment: 'minutes' },
	mode: { start: 6, end: 8, segment: 'mode' },
}

export const rangesList: Array<SelectionRange> = [ranges.hrs12, ranges.minutes, ranges.mode]

export const maxAndMins: MaxAndMins = {
	hrs24: { min: 0, max: 23 },
	hrs12: { min: 1, max: 12 },
	minutes: { min: 0, max: 59 },
}

export const segments: Array<Segment> = ['hrs12', 'minutes', 'mode']

export const timeObjectKeys: Array<TimeObjectKey> = ['hrs24', 'hrs12', 'minutes', 'mode']

// a11yID needs to be accessed by `@time-input-polyfill/tests` and the cjs/mjs split isn't working :(
export const a11yID = universalValues.a11yID
