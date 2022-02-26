import { String12hr, String24hr, TimeObject } from '../../types/index'

export const inputID = 'testInput'
export const inputPreFilledID = 'testInputPreFilled'

export const preFilledValues = {
	string12hr: <String12hr>'12:00 AM',
	string24hr: <String24hr>'00:00',
	timeObject: <TimeObject>{
		hrs24: 0,
		hrs12: 12,
		minutes: 0,
		mode: 'AM',
	},
}
