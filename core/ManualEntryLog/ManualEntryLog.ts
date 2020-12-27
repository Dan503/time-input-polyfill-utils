import {
	Segment,
	Hour12,
	TimeObject,
	Minute,
	Mode,
	String12hr,
	DefinedHour12,
	DefinedMinute,
} from '../../types/index'
import { maxAndMins } from '../staticValues'
import { toLeadingZero } from '../utils/utils'

type UpdateFunc = () => void

type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type GenericEntry = zeroToNine | 'a' | 'p' | string
type GenericEntries = Array<GenericEntry>
type NumericEntries = Array<zeroToNine>

const convertNumberToEntries = (number: DefinedHour12 | DefinedMinute): NumericEntries => {
	return String(number)
		.split('')
		.map(value => <zeroToNine>parseInt(value))
}

const convertEntriesToNumber = (entries: NumericEntries): DefinedHour12 | DefinedMinute => {
	return <DefinedHour12 | DefinedMinute>parseInt(entries.join(''))
}

class SegmentLog {
	value: Hour12 | Minute | Mode
	segment: Segment
	entries: GenericEntries = []
	update: () => void

	constructor(startingValue: Hour12 | Minute | Mode, segment: Segment, update: UpdateFunc) {
		this.value = startingValue
		this.segment = segment
		this.update = (): void => update()
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

				12:30 AM >> type 0 (hrs) >> [2]
			*/

			const isGreaterThanMax = (number: number): boolean => {
				if (this.segment !== 'mode') {
					return number > maxAndMins[this.segment].max
				}
				return false
			}

			if (isZero) {
				const entriesFromInitialValue = convertNumberToEntries(
					<DefinedMinute | DefinedHour12>this.value,
				)

				this.entries.push(0)

				const handlePotentialGreaterThanMaxNumbers = (entries: NumericEntries): void => {
					const entriesAsNumber = convertEntriesToNumber(entries)
					if (isGreaterThanMax(entriesAsNumber)) {
						this.entries = [0]
					} else {
						this.value = entriesAsNumber
					}
				}

				if (this.entries.length === 2) {
					// length is 2, 2nd value will always be 0 because it was pushed, if first value is zero it means double zeros
					const isDoubleZeros = this.entries[0] === 0

					if (isDoubleZeros) {
						if (this.segment === 'hrs12') {
							this.value = 12
							this.entries = [1, 2]
						} else {
							this.value = 0
						}
					} else {
						handlePotentialGreaterThanMaxNumbers(<NumericEntries>this.entries)
					}
				} else {
					if (this.entries.length > 2) {
						this.entries = [0]
					}
					if (entriesFromInitialValue.length === 2) {
						entriesFromInitialValue[0] = 0
					}
					handlePotentialGreaterThanMaxNumbers(entriesFromInitialValue)
				}
			} else {
				const newEntries = <NumericEntries>[...this.entries, <zeroToNine>number]
				const newValue = convertEntriesToNumber(newEntries)

				if (isGreaterThanMax(newValue)) {
					this.value = <zeroToNine>number
					this.entries = [<zeroToNine>number]
				} else {
					this.value = newValue
					this.entries = newEntries
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
		this.value = '--'
		this.update()
	}
}

class SegmentLogHrs extends SegmentLog {
	constructor(startingValue: Hour12, update: UpdateFunc) {
		super(startingValue, 'hrs12', update)
	}
}

class SegmentLogMin extends SegmentLog {
	constructor(startingValue: Minute, update: UpdateFunc) {
		super(startingValue, 'minutes', update)
	}
}

class SegmentLogMode extends SegmentLog {
	constructor(startingValue: Mode, update: UpdateFunc) {
		super(startingValue, 'mode', update)
	}
}

// Note: Due to this being a class, it does not need an interface
/**
 * Used for keeping track of Manual key strokes inside a time input
 * @param timeObject - The current Time object value
 * @param onUpdate - Callback function for when the values change
 */
export class ManualEntryLog {
	hrs12: SegmentLogHrs
	minutes: SegmentLogMin
	mode: SegmentLogMode
	fullValue12hr: String12hr

	constructor(timeObject: TimeObject, onUpdate?: (entryLog: ManualEntryLog) => void) {
		const getFullValue12hr = (): String12hr => {
			return [
				toLeadingZero(this.hrs12.value),
				':',
				toLeadingZero(this.minutes.value),
				' ',
				this.mode.value,
			].join('')
		}

		const update: UpdateFunc = () => {
			this.fullValue12hr = getFullValue12hr()
			if (onUpdate) {
				onUpdate(this)
			}
		}

		this.hrs12 = new SegmentLogHrs(timeObject.hrs12, update)
		this.minutes = new SegmentLogMin(timeObject.minutes, update)
		this.mode = new SegmentLogMode(timeObject.mode, update)
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
