// import './dom.ie'
import { convertString12hr, convertString24hr } from '../convert/convert'
import {
	SelectionIndex,
	Segment,
	SelectionRange,
	String12hr,
	String24hr,
	TimeObject,
} from '../../types/index'
import { ranges, rangesList } from '../staticValues'
import { regex } from '../regex/regex'
import {
	GetString12hr,
	GetString24hr,
	GetInputValue,
	GetLabelTextOf,
	GetRangeOf,
	GetAncestorsOf,
} from './get.types'

const traverseSegmentRanges = (
	$input: HTMLInputElement | null,
	direction: 'forward' | 'backward',
): SelectionRange => {
	const currentSegmentRange = getRangeOf($input).cursorSegment()
	const currentType = currentSegmentRange.segment
	const modifier = direction === 'forward' ? 1 : -1
	const nextTypeIndex = rangesList.map(range => range.segment).indexOf(currentType) + modifier
	return rangesList[nextTypeIndex] || currentSegmentRange
}

export const getString12hr: GetString12hr = string12hr => {
	const timeObject = convertString12hr(string12hr).toTimeObject()
	return {
		...timeObject,
		timeObject,
	}
}
export const getString24hr: GetString24hr = string24hr => {
	const timeObject = convertString24hr(string24hr).toTimeObject()
	return {
		...timeObject,
		timeObject,
	}
}
export const getInputValue: GetInputValue = $input => {
	const value = $input?.value || ''
	const is12hrTime = regex.string12hr.test(value)
	const is24hrTime = regex.string24hr.test(value)
	return {
		as12hrString: (): String12hr => (is12hrTime ? value : convertString24hr(value).to12hr()),
		as24hrString: (): String24hr => (is24hrTime ? value : convertString12hr(value).to24hr()),
		asTimeObject: (): TimeObject =>
			is12hrTime
				? convertString12hr(value).toTimeObject()
				: convertString24hr(value).toTimeObject(),
	}
}
export const getLabelTextOf: GetLabelTextOf = ($input, document = window.document) => {
	if (!$input) return ''
	const labelText =
		aria_labelledby($input, document) ||
		aria_label($input) ||
		for_attribute($input, document) ||
		label_wrapper_element($input) ||
		title_attribute($input)

	if (labelText) return labelText

	console.error('Label text for input not found.', $input)
	throw new Error('Cannot polyfill time input due to a missing label.')
}
export const getRangeOf: GetRangeOf = $input => ({
	rawSelection: (): SelectionRange => {
		if (!$input) {
			return {
				start: 0,
				end: 0,
				segment: 'hrs12',
			}
		}
		const within = (segment: Segment, value: number): boolean =>
			ranges[segment].start <= value && value <= ranges[segment].end
		const start = <SelectionIndex>$input.selectionStart
		const end = <SelectionIndex>$input.selectionEnd
		const segment: Segment =
			(within('mode', start) && 'mode') || (within('min', start) && 'min') || 'hrs12'
		return {
			start,
			end,
			segment,
		}
	},
	cursorSegment(): SelectionRange {
		const { segment } = getRangeOf($input).rawSelection()
		return ranges[segment]
	},
	nextSegment: (): SelectionRange => traverseSegmentRanges($input, 'forward'),
	prevSegment: (): SelectionRange => traverseSegmentRanges($input, 'backward'),
})
export const getAncestorsOf: GetAncestorsOf = ($startingElem, selectorString) => {
	// https://stackoverflow.com/a/8729274/1611058
	let $elem: HTMLElement | null = $startingElem
	const ancestors = []
	let i = 0
	while ($elem) {
		if (i !== 0) {
			ancestors.push($elem)
		}
		if (selectorString) {
			const matchesSelector = $elem.msMatchesSelector
				? $elem.msMatchesSelector(selectorString) // IE Hack
				: $elem.matches(selectorString)
			if (matchesSelector) {
				return ancestors
			}
		}
		$elem = $elem?.parentElement
		i++
	}
	return ancestors
}

const elemText = ($elem: HTMLElement | null): string => $elem?.textContent?.trim() || ''

function aria_labelledby($input: HTMLInputElement, document: Document = window.document): string {
	const ariaLabelByID = $input?.getAttribute('aria-labelledby') || ''
	const $ariaLabelBy = document.getElementById(ariaLabelByID)
	return elemText($ariaLabelBy)
}

function aria_label($input: HTMLInputElement): string {
	const ariaLabel = $input.getAttribute('aria-label')
	return ariaLabel || ''
}

function for_attribute($input: HTMLInputElement, document: Document = window.document): string {
	const $forLabel = <HTMLElement | null>document.querySelector('label[for="' + $input.id + '"]')
	return elemText($forLabel)
}

function label_wrapper_element($input: HTMLInputElement): string {
	const ancestors = getAncestorsOf($input, 'label')
	const $parentLabel = ancestors[ancestors.length - 1]
	if ($parentLabel.nodeName == 'LABEL') return elemText($parentLabel)
	return ''
}

function title_attribute($input: HTMLInputElement): string {
	const titleLabel = $input.getAttribute('title')
	return titleLabel || ''
}
