import {
	AnyHtmlElement,
	Segment,
	SelectionRange,
	String12hr,
	String24hr,
	TimeObject,
} from '../../types/index'

export interface ExtendedTimeObject extends TimeObject {
	timeObject: TimeObject
}

export type GetString12hr = (string12hr: String12hr) => ExtendedTimeObject
export type GetString24hr = (string24hr: String24hr) => ExtendedTimeObject

export type ProvideTimeString = (timeString: String12hr | String24hr) => {
	as24hr: () => String24hr
	as12hr: () => String12hr
}

export type GetInputValue = ($input: HTMLInputElement | null) => {
	as12hrString: () => String12hr
	as24hrString: () => String24hr
	asTimeObject: () => TimeObject
}
export type GetLabelTextOf = ($input: HTMLInputElement | null, document?: Document) => string

export type GetCursorSegment = ($input: HTMLInputElement | null) => Segment
export type GetNextPrevSegment = ($inputOrSegment: HTMLInputElement | Segment | null) => Segment

export type GetRangeOf = ($input: HTMLInputElement | null) => {
	rawSelection: () => SelectionRange
	cursorSegment: () => SelectionRange
	nextSegment: () => SelectionRange
	prevSegment: () => SelectionRange
}
export type GetAncestorsOf = (
	$startingElem: AnyHtmlElement | null,
	selectorString?: string,
) => Array<AnyHtmlElement>
