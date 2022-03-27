import {
	DefinedHour12,
	DefinedMinute,
	Hour12,
	Minute,
	Mode,
	Segment,
	String12hr,
	TimeObject,
} from '../../types/index'
import { maxAndMins } from '../staticValues'
import { toLeadingZero } from '../utils/utils'

type BlankFunc = () => void

type ZeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type GenericEntry = ZeroToNine | 'a' | 'p' | string
type GenericEntries = Array<GenericEntry>
type NumericEntries = Array<ZeroToNine>

const convertEntriesToNumber = (entries: NumericEntries): DefinedHour12 | DefinedMinute => {
	return parseInt(entries.join('')) as DefinedHour12 | DefinedMinute
}

interface SegmentLogConstructor {
	startingValue: Hour12 | Minute | Mode
	segment: Segment
	onUpdate: BlankFunc
	onLimitHit: BlankFunc
}
class SegmentLog {
	value: Hour12 | Minute | Mode
	segment: Segment
	entries: GenericEntries = []
	update: () => void
	limitHit: () => void

	constructor({ startingValue, segment, onUpdate, onLimitHit }: SegmentLogConstructor) {
		this.value = startingValue
		this.segment = segment
		this.update = (): void => onUpdate()
		this.limitHit = (): void => onLimitHit()
	}

	/**
	 * Adds a value to the to the log and keeps track of what the end value should be
	 * @param keyName - Expected to be a keyboard key name like "1" or "a"
	 */
	add(keyName: string): void {
		const number = parseInt(keyName)
		const isZero = number === 0
		const isNumber = !isNaN(number)

		// Handles AM/PM
		if (this.segment === 'mode') {
			if (keyName.toLowerCase() === 'a') {
				this.value = 'AM'
				this.entries = [keyName]
			}
			if (keyName.toLowerCase() === 'p') {
				this.value = 'PM'
				this.entries = [keyName]
			}
			// Handles Hours and Minutes
		} else if (isNumber) {
			/*
				12:30 AM >> type 1 (hrs) >> [1] >> 01:30 AM
				12:30 AM >> type 1 > 2 (hrs) >> [1,2] >> 12:30 AM

				12:30 AM >> type 2 (hrs) >> [2] >> 02:30 AM
				12:30 AM >> type 2 > 1 (hrs) >> [1] >> 01:30 AM
				12:30 AM >> type 2 > 1 > 2 (hrs) >> [1,2] >> 12:30 AM

				12:30 AM >> type 0 (hrs) >> [1,2] >> 12:30 AM
			*/

			const isGreaterThanMax = (number: number): boolean => {
				if (this.segment !== 'mode') {
					return number > maxAndMins[this.segment].max
				}
				return false
			}
			const isFirst = this.entries.length === 0
			const isSecond = this.entries.length === 1
			const isThird = this.entries.length === 2

			const isSecondZero = isZero && isSecond && this.entries[0] === 0

			if (this.segment === 'hrs12') {
				if ((isFirst || isThird) && isZero) {
					this.entries = [0]
					this.value = 12
					this.update()
					return
				} else if (isSecondZero) {
					this.entries = [0, 0]
					this.value = 12
					this.limitHit()
					this.update()
					return
				}
			} else if (this.segment === 'minutes') {
				if ((isFirst || isThird) && isZero) {
					this.entries = [0]
					this.value = 0
					this.update()
					return
				} else if (isSecondZero) {
					this.entries = [0, 0]
					this.value = 0
					this.limitHit()
					this.update()
					return
				}
			}

			if (isZero && isSecond) {
				const isHrsSegment = this.segment === 'hrs12'
				const max = isHrsSegment ? 1 : 5
				if (this.entries[0] > max) {
					this.entries = [0]
					this.value = isHrsSegment ? 12 : 0
				} else {
					this.entries.push(number as ZeroToNine)
					this.value = convertEntriesToNumber(this.entries as NumericEntries)
					this.limitHit()
				}
				this.update()
				return
			}

			const newEntries = [...this.entries, number as ZeroToNine] as NumericEntries
			const newValue = convertEntriesToNumber(newEntries)

			if (isGreaterThanMax(newValue)) {
				this.value = number as ZeroToNine
				this.entries = [this.value]

				if (isGreaterThanMax(number * 10)) {
					this.limitHit()
				}
			} else {
				this.value = newValue
				this.entries = newEntries
				if (newEntries.length === 2 || isGreaterThanMax(number * 10)) {
					this.limitHit()
				}
			}
		}

		this.update()
	}

	/**
	 * Reset is needed for things like typing "1", then leaving, then coming back.
	 *
	 * The tracker should reset if they are returning.
	 */
	reset(): void {
		this.entries = []
	}

	/**
	 * Deletes the current value. Use this if the user presses delete or backspace.
	 */
	clear(): void {
		this.reset()
		this.value = null
		this.update()
	}
}

interface ManualEntryLogConstructor {
	/** The current Time object value */
	timeObject: TimeObject
	/** Callback function for when the values change */
	onUpdate?: (entryLog: ManualEntryLog) => void
	/** Callback function for when the manual entry exceeds the maximum range */
	onLimitHit?: (entryLog: ManualEntryLog) => void
}

// Note: Due to this being a class, it does not need an interface
/**
 * Used for keeping track of Manual key strokes inside a time input
 */
export class ManualEntryLog {
	hrs12: SegmentLog
	minutes: SegmentLog
	mode: SegmentLog
	fullValue12hr: String12hr

	constructor({
		timeObject,
		onUpdate = (): void => {},
		onLimitHit = (): void => {},
	}: ManualEntryLogConstructor) {
		const getFullValue12hr = (): String12hr => {
			return [
				toLeadingZero(this.hrs12.value),
				':',
				toLeadingZero(this.minutes.value),
				' ',
				this.mode.value || '--',
			].join('')
		}

		const update: BlankFunc = () => {
			this.fullValue12hr = getFullValue12hr()
			if (onUpdate) {
				onUpdate(this)
			}
		}

		const limitHit: BlankFunc = () => {
			if (onLimitHit) {
				onLimitHit(this)
			}
		}

		this.hrs12 = new SegmentLog({
			startingValue: timeObject.hrs12,
			segment: 'hrs12',
			onUpdate: update,
			onLimitHit: limitHit,
		})
		this.minutes = new SegmentLog({
			startingValue: timeObject.minutes,
			segment: 'minutes',
			onUpdate: update,
			onLimitHit: limitHit,
		})
		this.mode = new SegmentLog({
			startingValue: timeObject.mode,
			segment: 'mode',
			onUpdate: update,
			onLimitHit: limitHit,
		})
		this.fullValue12hr = getFullValue12hr()
	}

	/**
	 * Deletes all of the values for all of the segments.
	 */
	clearAll(): void {
		this.hrs12.clear()
		this.minutes.clear()
		this.mode.clear()
	}
}
