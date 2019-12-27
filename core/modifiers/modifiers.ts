import { TimeObject, String12hr, String24hr, Hour12, Hour24, Minute } from '../../types'
import { convert } from '../converters/converters'
import { maxAndMins } from '../staticValues'
import { is } from '../is/is'

export type Integration = 'isolated' | 'integrated'
export type Action = 'increment' | 'decrement'
export type Target = 'hours' | 'minutes' // | 'mode'
export type ToHr = 'to12hr' | 'to24hr'

const modifier = ({
	timeObject,
	action,
	target,
	integration,
	toHr,
}: {
	timeObject: TimeObject
	action: Action
	target: Target
	integration: Integration
	toHr: ToHr
}) => {
	const modifiedObject = modify.timeObject(timeObject)[action][target][integration]()
	return convert.timeObject(modifiedObject)[toHr]()
}

const modifyTimeString = (
	timeString: String12hr | String24hr,
	format: 'string12hr' | 'string24hr',
) => {
	const timeObject = convert[format](timeString).toTimeObject()
	const toHr = format === 'string12hr' ? 'to12hr' : 'to24hr'

	return (target: Target) => {
		return (action: Action) => {
			return (integration: Integration) => {
				return modifier({
					timeObject,
					toHr,
					target,
					action,
					integration,
				})
			}
		}
	}
}

export const modify = {
	string12hr: (string12hr: String12hr) => {
		const modifyString12hr = modifyTimeString(string12hr, 'string12hr')

		const modifyString12hr_hrs = modifyString12hr('hours')
		const modifyString12hr_min = modifyString12hr('minutes')

		const incrementString12Hr_hrs = modifyString12hr_hrs('increment')
		const decrementString12Hr_hrs = modifyString12hr_hrs('decrement')

		const incrementString12Hr_min = modifyString12hr_min('increment')
		const decrementString12Hr_min = modifyString12hr_min('decrement')

		return {
			increment: {
				hours: {
					isolated: (): String12hr => incrementString12Hr_hrs('isolated'),
					integrated: (): String12hr => incrementString12Hr_hrs('integrated'),
				},
				minutes: {
					isolated: (): String12hr => incrementString12Hr_min('isolated'),
					integrated: (): String12hr => incrementString12Hr_min('integrated'),
				},
			},
			decrement: {
				hours: {
					isolated: (): String12hr => decrementString12Hr_hrs('isolated'),
					integrated: (): String12hr => decrementString12Hr_hrs('integrated'),
				},
				minutes: {
					isolated: (): String12hr => decrementString12Hr_min('isolated'),
					integrated: (): String12hr => decrementString12Hr_min('integrated'),
				},
			},
		}
	},
	string24hr: (string24hr: String24hr) => {
		const modifyString24hr = modifyTimeString(string24hr, 'string24hr')

		const modifyString24hr_hrs = modifyString24hr('hours')
		const modifyString24hr_min = modifyString24hr('minutes')

		const incrementString24Hr_hrs = modifyString24hr_hrs('increment')
		const decrementString24Hr_hrs = modifyString24hr_hrs('decrement')

		const incrementString24Hr_min = modifyString24hr_min('increment')
		const decrementString24Hr_min = modifyString24hr_min('decrement')

		return {
			increment: {
				hours: {
					isolated: (): String24hr => incrementString24Hr_hrs('isolated'),
					integrated: (): String24hr => incrementString24Hr_hrs('integrated'),
				},
				minutes: {
					isolated: (): String24hr => incrementString24Hr_min('isolated'),
					integrated: (): String24hr => incrementString24Hr_min('integrated'),
				},
			},
			decrement: {
				hours: {
					isolated: (): String24hr => decrementString24Hr_hrs('isolated'),
					integrated: (): String24hr => decrementString24Hr_hrs('integrated'),
				},
				minutes: {
					isolated: (): String24hr => decrementString24Hr_min('isolated'),
					integrated: (): String24hr => decrementString24Hr_min('integrated'),
				},
			},
		}
	},
	timeObject: (timeObject: TimeObject) => ({
		increment: {
			hours: {
				isolated: (): TimeObject => nudgeIsolatedTimeObjectHrs('up', timeObject),
				integrated: (): TimeObject => nudgeIntegratedTimeObjectHrs('up', timeObject),
			},
			minutes: {
				isolated: (): TimeObject => {
					const { min } = timeObject

					const newMin =
						min === maxAndMins.minutes.max
							? maxAndMins.minutes.min
							: nudgeMinutes(min, 'up')

					return {
						...timeObject,
						min: newMin,
					}
				},
				integrated: (): TimeObject => {
					const { min } = timeObject

					if (min === maxAndMins.minutes.max) {
						return nudgeIntegratedTimeObjectHrs('up', {
							...timeObject,
							min: maxAndMins.minutes.min,
						})
					}

					return {
						...timeObject,
						min: nudgeMinutes(min, 'up'),
					}
				},
			},
		},
		decrement: {
			hours: {
				isolated: (): TimeObject => nudgeIsolatedTimeObjectHrs('down', timeObject),
				integrated: (): TimeObject => nudgeIntegratedTimeObjectHrs('down', timeObject),
			},
			minutes: {
				isolated: (): TimeObject => {
					const { min } = timeObject

					const newMin =
						min === maxAndMins.minutes.min
							? maxAndMins.minutes.max
							: nudgeMinutes(min, 'down')

					return {
						...timeObject,
						min: newMin,
					}
				},
				integrated: (): TimeObject => {
					const { min } = timeObject

					if (min === maxAndMins.minutes.min) {
						return nudgeIntegratedTimeObjectHrs('down', {
							...timeObject,
							min: maxAndMins.minutes.max,
						})
					}

					return {
						...timeObject,
						min: nudgeMinutes(min, 'down'),
					}
				},
			},
		},
	}),
}

const nudgeMinutes = (minutes: Minute, direction: 'up' | 'down'): Minute => {
	const modifier = direction === 'up' ? 1 : -1
	return <Minute>(typeof minutes === 'string' ? new Date().getMinutes() : minutes + modifier)
}

const nudgeIsolatedTimeObjectHrs = (
	direction: 'up' | 'down',
	timeObject: TimeObject,
): TimeObject => {
	return nudgeTimeObjectHrs({
		direction,
		timeObject,
		integration: 'isolated',
		blankCallback: (copiedObject: TimeObject) => {
			const currentHour24 = <Hour24>new Date().getHours()
			copiedObject.hrs24 = currentHour24
			if (is.AM.hrs24(currentHour24)) {
				copiedObject.hrs12 = <Hour12>currentHour24
			} else {
				copiedObject.hrs12 =
					typeof currentHour24 === 'number' ? <Hour12>(currentHour24 - 12) : currentHour24
			}
			return copiedObject
		},
	})
}

const nudgeIntegratedTimeObjectHrs = (
	direction: 'up' | 'down',
	timeObject: TimeObject,
): TimeObject => {
	return nudgeTimeObjectHrs({
		direction,
		timeObject,
		integration: 'integrated',
		blankCallback: (copiedObject: TimeObject) => {
			// If hours is blank, then it is better to increment in isolation
			return nudgeIsolatedTimeObjectHrs(direction, copiedObject)
		},
	})
}

const nudgeTimeObjectHrs = ({
	direction,
	timeObject,
	integration,
	blankCallback,
}: {
	// nudging up or down?
	direction: 'up' | 'down'
	// the time object to modify
	timeObject: TimeObject
	// Do you want it to alter AM/PM?
	integration: Integration
	// A function to call if the hrs24 and hrs12 values start off as blank ("--")
	blankCallback: Function
}) => {
	const hrsType = integration === 'integrated' ? 'hrs24' : 'hrs12'
	const hrs = timeObject[hrsType]
	const copiedObject = { ...timeObject }

	const isUp = direction === 'up'

	const limit = isUp ? maxAndMins[hrsType].max : maxAndMins[hrsType].min
	const opposingLimit = isUp ? maxAndMins[hrsType].min : maxAndMins[hrsType].max
	const modifier = isUp ? 1 : -1

	if (typeof hrs === 'number') {
		const actions = {
			hrs12() {
				if (hrs === limit) {
					copiedObject.hrs12 = <Hour12>opposingLimit
				} else {
					copiedObject.hrs12 = <Hour12>(hrs + modifier)
				}
			},
			hrs24() {
				if (hrs === limit) {
					copiedObject.hrs24 = <Hour24>opposingLimit
				} else {
					copiedObject.hrs24 = <Hour24>(hrs + modifier)
				}
			},
		}
		actions[hrsType]()

		return straightenTimeObjectHrs(hrsType, copiedObject)
	} else {
		return blankCallback(copiedObject)
	}
}

const straightenTimeObjectHrs = (basedOn: 'hrs12' | 'hrs24', invalidTimeObj: TimeObject) => {
	const use12hr = basedOn === 'hrs12'
	const toHr = use12hr ? 'to12hr' : 'to24hr'
	const format = use12hr ? 'string12hr' : 'string24hr'
	const timeString = convert.timeObject(invalidTimeObj, true)[toHr]()
	return convert[format](timeString).toTimeObject()
}
