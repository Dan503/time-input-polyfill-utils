import { AnyHtmlElement, Segment } from '../../types/index'

export type SelectSegment = ($input: HTMLInputElement | null, segment?: Segment) => void
export type SelectNextSegment = ($input: HTMLInputElement | null) => void
export type SelectPrevSegment = ($input: HTMLInputElement | null) => void
export type SelectCursorSegment = ($input: HTMLInputElement | null) => void

export type QuerySelectAll = <ElemType extends AnyHtmlElement = AnyHtmlElement>(
	selector: string,
	startingElem?: AnyHtmlElement | Document,
) => Array<ElemType>
