import {
	A11yClear,
	A11yCreate,
	A11yUpdate,
	GetA11yElement,
	GetA11yValue,
} from '../core/a11y/a11y.types'
import {
	ConvertDateObject,
	ConvertHours24,
	ConvertString12hr,
	ConvertString24hr,
	ConvertTimeObject,
} from '../core/convert/convert.types'
import { Flash24hrTime } from '../core/flash24hrTime/flash24hrTime.types'
import {
	GetAncestorsOf,
	GetCursorSegment,
	GetInputValue,
	GetLabelTextOf,
	GetNextPrevSegment,
	GetRangeOf,
	GetString12hr,
	GetString24hr,
} from '../core/get/get.types'
import {
	IsAmHrs24,
	IsAmString12hr,
	IsAmString24hr,
	IsAmTimeObject,
	IsCompleteTimeObject,
	IsPmHrs24,
	IsPmString12hr,
	IsPmString24hr,
	IsPmTimeObject,
	IsShiftHeldDown,
	IsString12hr,
	IsString24hr,
	IsTimeObject,
} from '../core/is/is.types'
import { ManualEntryLog } from '../core/ManualEntryLog/ManualEntryLog'
import {
	ModifyString12hr,
	ModifyString24hr,
	ModifyTimeObject,
	StraightenTimeObject,
} from '../core/modify/modify.types'
import { Regex } from '../core/regex/regex.types'
import {
	QuerySelectAll,
	SelectCursorSegment,
	SelectNextSegment,
	SelectPrevSegment,
	SelectSegment,
} from '../core/select/select.types'
import {
	MatchesTimeObject,
	ToArray,
	ToLeadingZero,
	ToLeadingZero12HrString,
	ToNumber,
} from '../core/utils/utils.types'
import {
	ValidateHours24,
	ValidateString12hr,
	ValidateString24hr,
	ValidateTimeObject,
} from '../core/validate/validate.types'
import { MaxAndMins, Ranges, Segment, SelectionRange } from './index'
import { TimeObjectKey } from './timeObject'

export interface Polyfill {
	/** Create the element that holds the screen reader text inside it. */
	a11yCreate: A11yCreate
	/** Utility function for updating the screen reader text. */
	a11yUpdate: A11yUpdate
	/** Utility function for clearing out the screen reader text. */
	a11yClear: A11yClear
	/** Return the current screen reader text content. */
	getA11yValue: GetA11yValue
	/** Return the element holding the screen reader text. */
	getA11yElement: GetA11yElement

	/** Utility function for turning a node list of HTML elements into an array of HTML elements. */
	toArray: ToArray
	/** Utility for converting a string to a number. */
	toNumber: ToNumber
	/** Utility for adding a leading zero to single digit numbers. */
	toLeadingZero: ToLeadingZero
	/** Utility for converting a single digit 12hr time to a double digit 12hr time. */
	toLeadingZero12HrString: ToLeadingZero12HrString
	/** Utility for checking if 2 time objects match. */
	matchesTimeObject: MatchesTimeObject

	/** Briefly switch an input element to display 24 hour time instead of 12 hour time. Primarily useful when submitting forms. */
	flash24hrTime: Flash24hrTime

	/** Utility for converting a 12 hour time string into either a 24 hour string or a time object. */
	convertString12hr: ConvertString12hr
	/** Utility for converting a 24 hour time string into either a 12 hour string or a time object. */
	convertString24hr: ConvertString24hr
	/** Utility for converting a time object into either a 12 hour string or a 24 hour string. */
	convertTimeObject: ConvertTimeObject
	/** Utility for converting a 24hr hours number into a 12hr hours number. */
	convertHours24: ConvertHours24
	/** Utility for converting a date object into either a 12hr string, a 24hr string or a time object. */
	convertDateObject: ConvertDateObject

	/** Essentiallly an alias for `convertString12hr(string12hr).toTimeObject()` */
	getString12hr: GetString12hr
	/** Essentiallly an alias for `convertString24hr(string24hr).toTimeObject()` */
	getString24hr: GetString24hr
	/** Retrieve the current input value as either a 12hr string, a 24hr string or a time object. */
	getInputValue: GetInputValue
	/** Retrieve the label text of an input element. */
	getLabelTextOf: GetLabelTextOf
	/** Retrieve the currently selected segment. */
	getCursorSegment: GetCursorSegment
	/** Retrieve the segment before the selected segment. */
	getPrevSegment: GetNextPrevSegment
	/** Retrieve the segment after the selected segment. */
	getNextSegment: GetNextPrevSegment
	/** Retrieve the cursor ranges of various segments. Used for making selections. */
	getRangeOf: GetRangeOf
	/** Retrieve a list of ancestor elements for a specific element. */
	getAncestorsOf: GetAncestorsOf

	/** Retrieve the current state of the `[shift]` key. */
	isShiftHeldDown: IsShiftHeldDown

	/** Check if a 24hr hours value is a PM value. */
	isPmHrs24: IsPmHrs24
	/** Check if a 12hr string value is a PM value. */
	isPmString12hr: IsPmString12hr
	/** Check if a 24hr string value is a PM value. */
	isPmString24hr: IsPmString24hr
	/** Check if a time object is a PM value. */
	isPmTimeObject: IsPmTimeObject

	/** Check if a 24hr hours value is an AM value. */
	isAmHrs24: IsAmHrs24
	/** Check if a 12hr string value is a AM value. */
	isAmString12hr: IsAmString12hr
	/** Check if a 24hr string value is a AM value. */
	isAmString24hr: IsAmString24hr
	/** Check if a time object is a AM value. */
	isAmTimeObject: IsAmTimeObject

	/** Check if a value is a time object */
	isTimeObject: IsTimeObject
	/** Check if a time object has no null any values. */
	isCompleteTimeObject: IsCompleteTimeObject
	/** Check if a value is in a 12hr string format. */
	isString12hr: IsString12hr
	/** Check if a value is in a 24hr string format. */
	isString24hr: IsString24hr

	/** Utility for keeping track of manually entered times. */
	// I don't know why ES Lint thinks ManualEntryLog is undefined
	// eslint-disable-next-line no-undef
	ManualEntryLog: typeof ManualEntryLog

	/** Utility for incrementing or decrementing a 12hr string */
	modifyString12hr: ModifyString12hr
	/** Utility for incrementing or decrementing a 24hr string */
	modifyString24hr: ModifyString24hr
	/** Utility for incrementing or decrementing a time object */
	modifyTimeObject: ModifyTimeObject
	/** Utility for turning an invalid time object (eg. hrs24 = 13, mode = 'AM') into a valid time object. */
	straightenTimeObject: StraightenTimeObject
	/** Regular expressions for checking if time strings match the expected format. */
	regex: Regex

	/** Essentially `document.querySelectAll()` but it returns an array of elements instead of a node list. */
	selectAll: QuerySelectAll

	/** Select a specific segment of a time input polyfill. */
	selectSegment: SelectSegment
	/** Select the segment after the selected segment of a time input polyfill. */
	selectNextSegment: SelectNextSegment
	/** Select the segment before the selected segment of a time input polyfill. */
	selectPrevSegment: SelectPrevSegment
	/** Select the segment that the cursor is currently sitting in. */
	selectCursorSegment: SelectCursorSegment

	/** Check if a string is a valid 12hr time string */
	validateString12hr: ValidateString12hr
	/** Check if a string is a valid 24hr time string */
	validateString24hr: ValidateString24hr
	/** Check if a string is a valid time object */
	validateTimeObject: ValidateTimeObject
	/** Check if a number is a valid 24hr hours value */
	validateHours24: ValidateHours24

	/** The cursor ranges for each of the segments. */
	ranges: Ranges
	/** The cursor ranges for each of the segments in the order that the segments appear. */
	rangesList: Array<SelectionRange>
	/** The maximum and minimum values for hours (24hr), hours (12hr), and minutes. */
	maxAndMins: MaxAndMins
	/** An array of each of the segment names in order of appearance. */
	segments: Array<Segment>
	/** An array of each of each the keys in a time object. */
	timeObjectKeys: Array<TimeObjectKey>
	/** The id for the screen reader accessibility block that is generated */
	a11yID: string
}
