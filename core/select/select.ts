import { AnyHtmlElement } from '../../index'
import { getRangeOf } from '../get/get'
import { ranges } from '../staticValues'
import { toArray } from '../utils/utils'
import {
	QuerySelectAll,
	SelectCursorSegment,
	SelectNextSegment,
	SelectPrevSegment,
	SelectSegment,
} from './select.types'

/** Essentially `document.querySelectAll()` but it returns an array of elements instead of a node list. */
export const selectAll: QuerySelectAll = <ElemType extends AnyHtmlElement = AnyHtmlElement>(
	selector: string,
	startingElem: AnyHtmlElement | Document = document,
): Array<ElemType> => {
	const elements = startingElem.querySelectorAll<ElemType>(selector)
	return toArray<ElemType>(elements)
}

/** Select a specific segment of a time input polyfill. */
export const selectSegment: SelectSegment = ($input, segment = 'hrs12') => {
	if (!$input) return
	$input.setSelectionRange(ranges[segment].start, ranges[segment].end)
}

/** Select the segment after the selected segment of a time input polyfill. */
export const selectNextSegment: SelectNextSegment = ($input) => {
	if (!$input) return
	const { start, end } = getRangeOf($input).nextSegment()
	$input.setSelectionRange(start, end)
}

/** Select the segment before the selected segment of a time input polyfill. */
export const selectPrevSegment: SelectPrevSegment = ($input) => {
	if (!$input) return
	const { start, end } = getRangeOf($input).prevSegment()
	$input.setSelectionRange(start, end)
}

/** Select the segment that the cursor is currently sitting in. */
export const selectCursorSegment: SelectCursorSegment = ($input) => {
	if (!$input) return
	const { start, end } = getRangeOf($input).cursorSegment()
	$input.setSelectionRange(start, end)
}
