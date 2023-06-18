import { MaxAndMins, Ranges, Segment, SelectionRange, TimeObjectKey } from '../types/index'

export * from '../common/staticValues'

/** The cursor ranges for each of the segments. */
export const ranges: Ranges = {
	hrs12: { start: 0, end: 2, segment: 'hrs12' },
	minutes: { start: 3, end: 5, segment: 'minutes' },
	mode: { start: 6, end: 8, segment: 'mode' },
}

/** The cursor ranges for each of the segments in the order that the segments appear. */
export const rangesList: Array<SelectionRange> = [ranges.hrs12, ranges.minutes, ranges.mode]

/** The maximum and minimum values for hours (24hr), hours (12hr), and minutes. */
export const maxAndMins: MaxAndMins = {
	hrs24: { min: 0, max: 23 },
	hrs12: { min: 1, max: 12 },
	minutes: { min: 0, max: 59 },
}

/** An array of each of the segment names in order of appearance. */
export const segments: Array<Segment> = ['hrs12', 'minutes', 'mode']

/** An array of each of each the keys in a time object. */
export const timeObjectKeys: Array<TimeObjectKey> = ['hrs24', 'hrs12', 'minutes', 'mode']
