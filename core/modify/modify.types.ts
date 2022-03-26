import { GuaranteedMode, String12hr, String24hr, TimeObject } from '../../types/index'

export type Integration = 'isolated' | 'integrated'
export type Action = 'increment' | 'decrement'
export type Target = 'hrs12' | 'hrs24' | 'minutes' | 'mode'
export type ToHr = 'to12hr' | 'to24hr'

export interface ModifyString12hr {
	(string12hr: String12hr): {
		increment: {
			hrs12: {
				isolated: () => String12hr
				integrated: () => String12hr
			}
			minutes: {
				isolated: () => String12hr
				integrated: () => String12hr
			}
			mode: {
				isolated: () => String12hr
				integrated: () => String12hr
			}
			cursorSegment: ($input: HTMLInputElement | null) => {
				isolated: () => String12hr
				integrated: () => String12hr
			}
		}
		decrement: {
			hrs12: {
				isolated: () => String12hr
				integrated: () => String12hr
			}
			minutes: {
				isolated: () => String12hr
				integrated: () => String12hr
			}
			mode: {
				isolated: () => String12hr
				integrated: () => String12hr
			}
			cursorSegment: ($input: HTMLInputElement | null) => {
				isolated: () => String12hr
				integrated: () => String12hr
			}
		}
		clear: {
			hrs12: () => String12hr
			minutes: () => String12hr
			mode: () => String12hr
			all: () => String12hr
		}
		toggleMode: (preferredModeWhenNull: GuaranteedMode, isIntegrated: boolean) => String12hr
	}
}
export interface ModifyString24hr {
	(string24hr: String24hr): {
		increment: {
			hrs24: {
				isolated: () => String24hr
				integrated: () => String24hr
			}
			minutes: {
				isolated: () => String24hr
				integrated: () => String24hr
			}
			mode: {
				isolated: () => String24hr
				integrated: () => String24hr
			}
		}
		decrement: {
			hrs24: {
				isolated: () => String24hr
				integrated: () => String24hr
			}
			minutes: {
				isolated: () => String24hr
				integrated: () => String24hr
			}
			mode: {
				isolated: () => String24hr
				integrated: () => String24hr
			}
		}
		toggleMode: (preferredModeWhenNull: GuaranteedMode, isIntegrated: boolean) => String24hr
	}
}
export interface ModifyTimeObject {
	(timeObject: TimeObject): {
		increment: {
			hrs12: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			hrs24: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			minutes: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			mode: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			cursorSegment: ($input: HTMLInputElement | null) => {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
		}
		decrement: {
			hrs12: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			hrs24: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			minutes: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			mode: {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
			cursorSegment: ($input: HTMLInputElement | null) => {
				isolated: () => TimeObject
				integrated: () => TimeObject
			}
		}
		clear: {
			hrs12: () => TimeObject
			hrs24: () => TimeObject
			minutes: () => TimeObject
			mode: () => TimeObject
			all: () => TimeObject
		}
		toggleMode: (preferredModeWhenNull: GuaranteedMode, isIntegrated: boolean) => TimeObject
	}
}

export type StraightenTimeObject = (
	basedOn: 'hrs12' | 'hrs24',
	invalidTimeObj: TimeObject,
) => TimeObject
