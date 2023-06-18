import { doc } from '../../types/Window'
import { getCursorSegment, getInputValue, getLabelTextOf } from '../get/get'
import { a11yID } from '../staticValues'
import { A11yClear, A11yCreate, A11yUpdate, GetA11yElement, GetA11yValue } from './a11y.types'

export const a11yCreate: A11yCreate = (document = doc) => {
	if (!document) {
		return null
	}
	const $block = document.createElement('div')
	$block.setAttribute('aria-live', 'polite')
	$block.setAttribute(
		'style',
		'position: absolute; opacity: 0; height: 0; width: 0; overflow: hidden; pointer-events: none;',
	)
	$block.id = a11yID
	document.querySelector('body')?.appendChild($block)
	return $block
}

export const a11yUpdate: A11yUpdate = ($input, announcementArray, document = doc) => {
	if (!$input || !document) return ''
	a11yClear(document)
	const cursorSegment = getCursorSegment($input)

	const values = getInputValue($input).asTimeObject()
	const value = values[cursorSegment]
	const segmentValue = value === null ? 'blank' : value

	const segmentName = {
		hrs12: 'Hours',
		minutes: 'Minutes',
		mode: 'AM/PM',
	}[cursorSegment]

	const announcements = {
		initial: '$label grouping $fullValue.',
		select: '$segmentName spin button $segmentValue.',
		update: '$segmentValue.',
	}

	const textArray = announcementArray.map((key) => announcements[key])

	const fullValue = $input.value.replace(/--/g, 'blank')

	let html = `<p>${textArray.join('</p><p>')}</p>`
	const labelText = getLabelTextOf($input, document)
	html = html.replace(/\$label/g, labelText)
	html = html.replace(/\$segmentName/g, segmentName)
	html = html.replace(/\$segmentValue/g, `${segmentValue}`)
	html = html.replace(/\$fullValue/g, fullValue)

	const $a11y = document.getElementById(a11yID)

	if ($a11y) {
		$a11y.innerHTML = html
	}

	return html
}

export const a11yClear: A11yClear = (document = doc) => {
	const $a11y = document?.getElementById(a11yID)
	if ($a11y) {
		$a11y.innerHTML = ''
	}
}

export const getA11yValue: GetA11yValue = (document = doc) => {
	const $a11y = document?.getElementById(a11yID)
	return $a11y?.textContent ? $a11y.textContent : ''
}

export const getA11yElement: GetA11yElement = (document = doc) => {
	return document?.getElementById(a11yID) as HTMLDivElement
}
