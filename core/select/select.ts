import { document } from 'browser-monads-ts'
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

export const selectAll: QuerySelectAll = <ElemType extends AnyHtmlElement = AnyHtmlElement>(
	selector: string,
	startingElem: AnyHtmlElement | Document = document,
): Array<ElemType> => {
	const elements = startingElem.querySelectorAll<ElemType>(selector)
	return toArray<ElemType>(elements)
}

export const selectSegment: SelectSegment = ($input, segment = 'hrs12') => {
	if (!$input) return
	$input.setSelectionRange(ranges[segment].start, ranges[segment].end)
}
export const selectNextSegment: SelectNextSegment = ($input) => {
	if (!$input) return
	const { start, end } = getRangeOf($input).nextSegment()
	$input.setSelectionRange(start, end)
}
export const selectPrevSegment: SelectPrevSegment = ($input) => {
	if (!$input) return
	const { start, end } = getRangeOf($input).prevSegment()
	$input.setSelectionRange(start, end)
}
export const selectCursorSegment: SelectCursorSegment = ($input) => {
	if (!$input) return
	const { start, end } = getRangeOf($input).cursorSegment()
	$input.setSelectionRange(start, end)
}
