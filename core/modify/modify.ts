import { blankValues } from '../../common/blankValues'
import {
	GuaranteedMode,
	Hour12,
	Hour24,
	Minute,
	Mode,
	String12hr,
	String24hr,
	TimeObject,
} from '../../types/index'
import { convertString12hr, convertString24hr, convertTimeObject } from '../convert/convert'
import { getCursorSegment } from '../get/get'
import { isAmTimeObject } from '../is/is'
import { maxAndMins } from '../staticValues'
import {
	Action,
	Integration,
	ModifyString12hr,
	ModifyString24hr,
	ModifyTimeObject,
	StraightenTimeObject,
} from './modify.types'

export const modifyString12hr: ModifyString12hr = (string12hr) => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const modeToggle = (preferredModeWhenNull: GuaranteedMode) => ({
		isolated: (): String12hr =>
			modifyString12hr(string12hr).toggleMode(preferredModeWhenNull, false),
		integrated: (): String12hr =>
			modifyString12hr(string12hr).toggleMode(preferredModeWhenNull, true),
	})
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const cursorSegmentModifier = (action: Action) => ($input: HTMLInputElement | null) => {
		const segment = getCursorSegment($input)
		return modifyString12hr(string12hr)[action][segment]
	}

	const modify = (
		modification: (timeObject: TimeObject) => TimeObject,
		skipValidation?: boolean | undefined,
	): String12hr => {
		const timeObject = convertString12hr(string12hr).toTimeObject()
		const modified = modification(timeObject)
		return convertTimeObject(modified, skipValidation).to12hr()
	}

	return {
		increment: {
			hrs12: {
				isolated: (): String12hr =>
					modify((timeObject) => modifyTimeObject(timeObject).increment.hrs12.isolated()),
				integrated: (): String12hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).increment.hrs12.integrated(),
					),
			},
			minutes: {
				isolated: (): String12hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).increment.minutes.isolated(),
					),
				integrated: (): String12hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).increment.minutes.integrated(),
					),
			},
			mode: modeToggle('AM'),
			cursorSegment: cursorSegmentModifier('increment'),
		},
		decrement: {
			hrs12: {
				isolated: (): String12hr =>
					modify((timeObject) => modifyTimeObject(timeObject).decrement.hrs12.isolated()),
				integrated: (): String12hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).decrement.hrs12.integrated(),
					),
			},
			minutes: {
				isolated: (): String12hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).decrement.minutes.isolated(),
					),
				integrated: (): String12hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).decrement.minutes.integrated(),
					),
			},
			mode: modeToggle('PM'),
			cursorSegment: cursorSegmentModifier('decrement'),
		},
		toggleMode: (preferredModeWhenNull, isIntegrated): String12hr =>
			modify(
				(timeObject) =>
					modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, isIntegrated),
				true,
			),

		clear: {
			hrs12: (): String12hr =>
				modify((timeObject) => modifyTimeObject(timeObject).clear.hrs12()),
			minutes: (): String12hr =>
				modify((timeObject) => modifyTimeObject(timeObject).clear.minutes()),
			mode: (): String12hr =>
				modify((timeObject) => modifyTimeObject(timeObject).clear.mode()),
			all: (): String12hr => modify((timeObject) => modifyTimeObject(timeObject).clear.all()),
		},
	}
}
export const modifyString24hr: ModifyString24hr = (string24hr) => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const modeToggle = (preferredModeWhenNull: GuaranteedMode) => ({
		isolated: (): String24hr =>
			modifyString24hr(string24hr).toggleMode(preferredModeWhenNull, false),
		integrated: (): String24hr =>
			modifyString24hr(string24hr).toggleMode(preferredModeWhenNull, true),
	})

	const modify = (
		modification: (timeObject: TimeObject) => TimeObject,
		skipValidation?: boolean | undefined,
	): String24hr => {
		const timeObject = convertString24hr(string24hr).toTimeObject()
		const modified = modification(timeObject)
		return convertTimeObject(modified, skipValidation).to24hr()
	}

	return {
		increment: {
			hrs24: {
				isolated: (): String24hr =>
					modify((timeObject) => modifyTimeObject(timeObject).increment.hrs24.isolated()),
				integrated: (): String24hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).increment.hrs24.integrated(),
					),
			},
			minutes: {
				isolated: (): String24hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).increment.minutes.isolated(),
					),
				integrated: (): String24hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).increment.minutes.integrated(),
					),
			},
			mode: modeToggle('AM'),
		},
		decrement: {
			hrs24: {
				isolated: (): String24hr =>
					modify((timeObject) => modifyTimeObject(timeObject).decrement.hrs24.isolated()),
				integrated: (): String24hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).decrement.hrs24.integrated(),
					),
			},
			minutes: {
				isolated: (): String24hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).decrement.minutes.isolated(),
					),
				integrated: (): String24hr =>
					modify((timeObject) =>
						modifyTimeObject(timeObject).decrement.minutes.integrated(),
					),
			},
			mode: modeToggle('PM'),
		},
		toggleMode: (preferredModeWhenNull, isIntegrated): String24hr =>
			modify(
				(timeObject) =>
					modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, isIntegrated),
				true,
			),
	}
}
export const modifyTimeObject: ModifyTimeObject = (timeObject) => {
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const modeToggle = (preferredModeWhenNull: GuaranteedMode) => ({
		isolated: (): TimeObject =>
			modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, false),
		integrated: (): TimeObject =>
			modifyTimeObject(timeObject).toggleMode(preferredModeWhenNull, true),
	})
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const cursorSegmentModifier = (action: Action) => ($input: HTMLInputElement | null) => {
		const segment = getCursorSegment($input)
		return modifyTimeObject(timeObject)[action][segment]
	}
	return {
		increment: {
			hrs12: {
				isolated: (): TimeObject => nudgeIsolatedTimeObjectHrs('up', timeObject),
				integrated: (): TimeObject => nudgeIntegratedTimeObjectHrs('up', timeObject),
			},
			// hrs24 is just an alias for hrs12 since the 24hr doesn't matter
			hrs24: {
				isolated: (): TimeObject => modifyTimeObject(timeObject).increment.hrs12.isolated(),
				integrated: (): TimeObject =>
					modifyTimeObject(timeObject).increment.hrs12.integrated(),
			},
			minutes: {
				isolated: (): TimeObject => {
					const { minutes } = timeObject

					const newMin =
						minutes === maxAndMins.minutes.max
							? maxAndMins.minutes.min
							: nudgeMinutes(minutes, 'up')

					return {
						...timeObject,
						minutes: newMin,
					}
				},
				integrated: (): TimeObject => {
					const { minutes } = timeObject

					if (minutes === maxAndMins.minutes.max) {
						return nudgeIntegratedTimeObjectHrs('up', {
							...timeObject,
							minutes: maxAndMins.minutes.min,
						})
					}

					return {
						...timeObject,
						minutes: nudgeMinutes(minutes, 'up'),
					}
				},
			},
			mode: modeToggle('AM'),
			cursorSegment: cursorSegmentModifier('increment'),
		},
		decrement: {
			hrs12: {
				isolated: (): TimeObject => nudgeIsolatedTimeObjectHrs('down', timeObject),
				integrated: (): TimeObject => nudgeIntegratedTimeObjectHrs('down', timeObject),
			},
			// hrs24 is just an alias for hrs12 since the 24hr doesn't matter
			hrs24: {
				isolated: (): TimeObject => modifyTimeObject(timeObject).decrement.hrs12.isolated(),
				integrated: (): TimeObject =>
					modifyTimeObject(timeObject).decrement.hrs12.integrated(),
			},
			minutes: {
				isolated: (): TimeObject => {
					const { minutes } = timeObject

					const newMin =
						minutes === maxAndMins.minutes.min
							? maxAndMins.minutes.max
							: nudgeMinutes(minutes, 'down')

					return {
						...timeObject,
						minutes: newMin,
					}
				},
				integrated: (): TimeObject => {
					const { minutes } = timeObject

					if (minutes === maxAndMins.minutes.min) {
						return nudgeIntegratedTimeObjectHrs('down', {
							...timeObject,
							minutes: maxAndMins.minutes.max,
						})
					}

					return {
						...timeObject,
						minutes: nudgeMinutes(minutes, 'down'),
					}
				},
			},
			mode: modeToggle('PM'),
			cursorSegment: cursorSegmentModifier('decrement'),
		},
		toggleMode: (preferredModeWhenNull, isIntegrated): TimeObject => {
			const { hrs12, hrs24, mode } = timeObject

			const returnVal: TimeObject = { ...timeObject }

			const isAM = isAmTimeObject(timeObject)

			const get24HrHours = (targetMode: Mode): Hour24 => {
				let hrs24Calculation: Hour24

				if (hrs12 === null) {
					hrs24Calculation = null
				} else {
					const is12 = hrs12 === 12
					const hours24hr = {
						am: is12 ? 0 : hrs12,
						pm: is12 ? 12 : hrs12 + 12,
					}
					hrs24Calculation = (targetMode === 'AM' ? hours24hr.am : hours24hr.pm) as Hour24
				}

				return hrs24Calculation
			}

			if (mode === null) {
				if (isIntegrated && hrs24 !== null) {
					returnVal.mode = hrs24 > 11 ? 'PM' : 'AM'
					returnVal.hrs24 = hrs24
				} else {
					returnVal.mode = preferredModeWhenNull
					returnVal.hrs24 = get24HrHours(preferredModeWhenNull) as Hour24
				}
			} else {
				returnVal.mode = isAM ? 'PM' : 'AM'
				returnVal.hrs24 = get24HrHours(isAM ? 'PM' : 'AM') as Hour24
			}

			if (hrs12 === null && mode === null) {
				return returnVal
			}

			return straightenTimeObject({ basedOn: 'hrs24', invalidTimeObject: returnVal })
		},
		clear: {
			hrs24: (): TimeObject => ({ ...timeObject, hrs12: null, hrs24: null }),
			hrs12: (): TimeObject => ({ ...timeObject, hrs12: null, hrs24: null }),
			minutes: (): TimeObject => ({ ...timeObject, minutes: null }),
			mode: (): TimeObject => ({ ...timeObject, mode: null, hrs24: null }),
			all: (): TimeObject => blankValues.timeObject,
		},
	}
}

const nudgeMinutes = (minutes: Minute, direction: 'up' | 'down'): Minute => {
	const modifier = direction === 'up' ? 1 : -1
	const newMinutes = direction === 'up' ? 0 : 59
	return (minutes === null ? newMinutes : minutes + modifier) as Minute
}

const nudgeIsolatedTimeObjectHrs = (
	direction: 'up' | 'down',
	timeObject: TimeObject,
): TimeObject => {
	return nudgeTimeObjectHrs({
		direction,
		timeObject,
		integration: 'isolated',
		blankCallback: (copiedObject: TimeObject): TimeObject => {
			if (direction === 'up') {
				if (copiedObject.mode === 'PM') {
					copiedObject.hrs24 = 13
					copiedObject.hrs12 = 1
				} else if (copiedObject.mode === 'AM') {
					copiedObject.hrs24 = 1
					copiedObject.hrs12 = 1
				} else {
					copiedObject.hrs12 = 1
				}
			} else {
				if (copiedObject.mode === 'PM') {
					copiedObject.hrs24 = 12
					copiedObject.hrs12 = 12
				} else if (copiedObject.mode === 'AM') {
					copiedObject.hrs24 = 0
					copiedObject.hrs12 = 12
				} else {
					copiedObject.hrs12 = 12
				}
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
		blankCallback: (copiedObject: TimeObject): TimeObject => {
			// If hours is blank, then it is better to increment in isolation
			return nudgeIsolatedTimeObjectHrs(direction, copiedObject)
		},
	})
}

const nudgeTimeObjectHrs = <T extends 'hrs12' | 'hrs24'>({
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
	// A function to call if the hrs24 and hrs12 values start off as blank (null)
	blankCallback: Function
}): TimeObject => {
	const hrsType = (integration === 'integrated' ? 'hrs24' : 'hrs12') as T
	const hrs = timeObject[hrsType]
	const copiedObject = { ...timeObject }

	const isUp = direction === 'up'

	const limit = isUp ? maxAndMins[hrsType].max : maxAndMins[hrsType].min
	const opposingLimit = isUp ? maxAndMins[hrsType].min : maxAndMins[hrsType].max
	const modifier = isUp ? 1 : -1

	if (typeof hrs === 'number') {
		if (hrs === limit) {
			copiedObject[hrsType] = opposingLimit as TimeObject[T]
		} else {
			copiedObject[hrsType] = ((hrs as number) + modifier) as TimeObject[T]
		}
		return straightenTimeObject({ basedOn: hrsType, invalidTimeObject: copiedObject })
	} else {
		return blankCallback(
			straightenTimeObject({ basedOn: hrsType, invalidTimeObject: copiedObject }),
		)
	}
}

export const straightenTimeObject: StraightenTimeObject = ({
	basedOn,
	invalidTimeObject,
}): TimeObject => {
	const { hrs24, hrs12, minutes } = invalidTimeObject

	const mode = straightenTimeObjectMode(basedOn, invalidTimeObject)
	const isAM = mode === 'AM'

	const use12hr = basedOn === 'hrs12'

	const get12hrBasedOn24hr = (): Hour12 => {
		const hr12 = (hrs24 !== null && hrs24 > 12 ? hrs24 - 12 : hrs24) as Hour12 | 0
		if (hr12 === 0) {
			return 12
		}
		return hr12
	}
	const get24hrBasedOn12hr = (): Hour24 => {
		const hr24 =
			mode === null
				? null
				: ((!isAM && hrs12 !== null && hrs12 !== 12 ? hrs12 + 12 : hrs12) as Hour24 | 24)

		if (hr24 === null) {
			return null
		}

		if (hr24 === 24) {
			return 0
		}

		if (hr24 >= 12 && isAM) {
			return (hr24 - 12) as Hour24
		}

		return hr24
	}

	const newTimeObject: TimeObject = {
		hrs12: use12hr ? hrs12 : get12hrBasedOn24hr(),
		hrs24: use12hr ? get24hrBasedOn12hr() : hrs24,
		minutes,
		mode,
	}

	return newTimeObject
}

const straightenTimeObjectMode = (basedOn: 'hrs12' | 'hrs24', invalidTimeObj: TimeObject): Mode => {
	const { hrs24, mode } = invalidTimeObj

	if (basedOn === 'hrs12') {
		return mode
	}

	if (mode && invalidTimeObj.hrs24 === null) {
		return mode
	}

	return hrs24 && hrs24 > 11 ? 'PM' : 'AM'
}
