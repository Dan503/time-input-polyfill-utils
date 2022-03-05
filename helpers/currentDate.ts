import { convertDateObject, convertHours24 } from '../core/convert/convert'
import { isAmHrs24 } from '../core/is/is'
import { toLeadingZero } from '../core/utils/utils'
import { DefinedHour24, Mode, TimeObject } from '../types/index'

export class CurrentDate {
	hrs24: string
	hrs12: string
	minutes: string
	mode: Mode
	date: Date
	string24hr: string
	string12hr: string
	timeObject: TimeObject

	constructor() {
		const date = new Date()
		const current24hrs = date.getHours() as DefinedHour24

		this.hrs24 = toLeadingZero(current24hrs)
		this.hrs12 = toLeadingZero(convertHours24(current24hrs).toHours12())
		this.minutes = toLeadingZero(convertDateObject(date).toTimeObject().minutes)
		this.mode = (isAmHrs24(current24hrs) ? 'AM' : 'PM') as Mode
		this.date = date
		this.string24hr = convertDateObject(date).to24hr()
		this.string12hr = convertDateObject(date).to12hr()
		this.timeObject = convertDateObject(date).toTimeObject()
	}
	reInitialize(): void {
		const date = new Date()
		const current24hrs = date.getHours() as DefinedHour24

		this.hrs24 = toLeadingZero(current24hrs)
		this.hrs12 = toLeadingZero(convertHours24(current24hrs).toHours12())
		this.minutes = toLeadingZero(convertDateObject(date).toTimeObject().minutes)
		this.mode = (isAmHrs24(current24hrs) ? 'AM' : 'PM') as Mode
		this.date = date
		this.string24hr = convertDateObject(date).to24hr()
		this.string12hr = convertDateObject(date).to12hr()
		this.timeObject = convertDateObject(date).toTimeObject()
	}
}
