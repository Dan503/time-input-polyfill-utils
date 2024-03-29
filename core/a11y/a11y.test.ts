import { loadTestPage } from '../../cypress/support/loadTestPage'
import { selectSegment } from '../select/select'
import { a11yID } from '../staticValues'
import { a11yClear, a11yCreate, a11yUpdate, getA11yElement, getA11yValue } from './a11y'

interface A11yCreation {
	$a11y: HTMLDivElement | null
	$input: HTMLInputElement
	$inputPreFilled: HTMLInputElement
	document: Document
}

async function createA11y(): Promise<A11yCreation> {
	const { document, $input, $inputPreFilled } = await loadTestPage()
	return {
		$a11y: a11yCreate(document),
		$input,
		$inputPreFilled,
		document,
	}
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getA11y = () => cy.get(`#${a11yID}`)

describe('Create a11y element', () => {
	it('a11y exists', async () => {
		await createA11y()
		getA11y().should('exist')
	})
})

describe('Get current value', () => {
	it('Returns correct value', async () => {
		const { $input, document } = await createA11y()
		a11yUpdate($input, ['initial'], document)
		expect(getA11yValue(document)).to.equal('Blank input grouping blank:blank blank.')
	})
})
describe('Get a11y element', () => {
	it('Returns null if not created yet', async () => {
		expect(getA11yElement(document)).to.equal(null)
	})
	it('Returns element if created', async () => {
		const { document, $a11y } = await createA11y()
		expect(getA11yElement(document)).to.equal($a11y)
	})
})

// TO DO: Refactor to make less repetitive
describe('Update a11y element', () => {
	_initial_()
	_select_()
	_update_()
	_initial_select_update_()
	_initial_clear_()

	function _initial_(): void {
		describe('[initial]', () => {
			it('$input [initial]', async () => {
				const { $input, document } = await createA11y()
				a11yUpdate($input, ['initial'], document)
				expect(document.getElementById(a11yID)?.textContent).to.equal(
					'Blank input grouping blank:blank blank.',
				)
			})
			it('$inputPreFilled [initial]', async () => {
				const { $inputPreFilled, document } = await createA11y()
				a11yUpdate($inputPreFilled, ['initial'], document)
				expect(document.getElementById(a11yID)?.textContent).to.equal(
					'Pre-filled input grouping 12:00 AM.',
				)
			})

			it('null input [initial]', async () => {
				const { document } = await createA11y()
				a11yUpdate(null, ['initial'], document)
				expect(document.getElementById(a11yID)?.textContent).to.equal('')
			})
		})
	}

	function _select_(): void {
		describe('[select]', () => {
			hours()
			minutes()
			mode()

			function hours(): void {
				describe('hours', () => {
					it('$input [select (hours)]', async () => {
						const { $input, document } = await createA11y()
						a11yUpdate($input, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal(
							'Hours spin button blank.',
						)
					})
					it('$inputPreFilled [select (hours)]', async () => {
						const { $inputPreFilled, document } = await createA11y()
						a11yUpdate($inputPreFilled, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal(
							'Hours spin button 12.',
						)
					})
					it('null [select (hours)]', async () => {
						const { document } = await createA11y()
						a11yUpdate(null, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('')
					})
				})
			}
			function minutes(): void {
				describe('minutes', () => {
					it('$input [select (minutes)]', async () => {
						const { $input, document } = await createA11y()
						selectSegment($input, 'minutes')
						a11yUpdate($input, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal(
							'Minutes spin button blank.',
						)
					})
					it('$inputPreFilled [select (minutes)]', async () => {
						const { $inputPreFilled, document } = await createA11y()
						selectSegment($inputPreFilled, 'minutes')
						a11yUpdate($inputPreFilled, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal(
							'Minutes spin button 0.',
						)
					})
					it('null [select (minutes)]', async () => {
						const { document } = await createA11y()
						selectSegment(null, 'minutes')
						a11yUpdate(null, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('')
					})
				})
			}
			function mode(): void {
				describe('mode', () => {
					it('$input [select (mode)]', async () => {
						const { $input, document } = await createA11y()
						selectSegment($input, 'mode')
						a11yUpdate($input, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal(
							'AM/PM spin button blank.',
						)
					})
					it('$inputPreFilled [select (mode)]', async () => {
						const { $inputPreFilled, document } = await createA11y()
						selectSegment($inputPreFilled, 'mode')
						a11yUpdate($inputPreFilled, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal(
							'AM/PM spin button AM.',
						)
					})
					it('null [select (mode)]', async () => {
						const { document } = await createA11y()
						selectSegment(null, 'mode')
						a11yUpdate(null, ['select'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('')
					})
				})
			}
		})
	}

	function _update_(): void {
		describe('[update]', () => {
			hours()
			minutes()
			mode()

			function hours(): void {
				describe('hours', () => {
					it('$input [update (hours)]', async () => {
						const { $input, document } = await createA11y()
						a11yUpdate($input, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('blank.')
					})
					it('$inputPreFilled [update (hours)]', async () => {
						const { $inputPreFilled, document } = await createA11y()
						a11yUpdate($inputPreFilled, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('12.')
					})
					it('null [update (hours)]', async () => {
						const { document } = await createA11y()
						a11yUpdate(null, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('')
					})
				})
			}
			function minutes(): void {
				describe('minutes', () => {
					it('$input [update (minutes)]', async () => {
						const { $input, document } = await createA11y()
						selectSegment($input, 'minutes')
						a11yUpdate($input, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('blank.')
					})
					it('$inputPreFilled [update (minutes)]', async () => {
						const { $inputPreFilled, document } = await createA11y()
						selectSegment($inputPreFilled, 'minutes')
						a11yUpdate($inputPreFilled, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('0.')
					})
					it('null [update (minutes)]', async () => {
						const { document } = await createA11y()
						selectSegment(null, 'minutes')
						a11yUpdate(null, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('')
					})
				})
			}
			function mode(): void {
				describe('mode', () => {
					it('$input [update (mode)]', async () => {
						const { $input, document } = await createA11y()
						selectSegment($input, 'mode')
						a11yUpdate($input, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('blank.')
					})
					it('$inputPreFilled [update (mode)]', async () => {
						const { $inputPreFilled, document } = await createA11y()
						selectSegment($inputPreFilled, 'mode')
						a11yUpdate($inputPreFilled, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('AM.')
					})
					it('null [update (mode)]', async () => {
						const { document } = await createA11y()
						selectSegment(null, 'mode')
						a11yUpdate(null, ['update'], document)
						expect(document.getElementById(a11yID)?.textContent).to.equal('')
					})
				})
			}
		})
	}

	function _initial_select_update_(): void {
		describe('[initial, select, update]', () => {
			hours()
			minutes()
			mode()

			function hours(): void {
				describe('hours', () => {
					it('$input [initial, select, update] (hours)', async () => {
						const { $input, document } = await createA11y()
						a11yUpdate($input, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal(
							'<p>Blank input grouping blank:blank blank.</p><p>Hours spin button blank.</p><p>blank.</p>',
						)
					})
					it('$inputPreFilled [initial, select, update] (hours)', async () => {
						const { $inputPreFilled, document } = await createA11y()
						a11yUpdate($inputPreFilled, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal(
							'<p>Pre-filled input grouping 12:00 AM.</p><p>Hours spin button 12.</p><p>12.</p>',
						)
					})
					it('null [initial, select, update] (hours)', async () => {
						const { document } = await createA11y()
						a11yUpdate(null, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal('')
					})
				})
			}
			function minutes(): void {
				describe('minutes', () => {
					it('$input [initial, select, update] (minutes)', async () => {
						const { $input, document } = await createA11y()
						selectSegment($input, 'minutes')
						a11yUpdate($input, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal(
							'<p>Blank input grouping blank:blank blank.</p><p>Minutes spin button blank.</p><p>blank.</p>',
						)
					})
					it('$inputPreFilled [initial, select, update] (minutes)', async () => {
						const { $inputPreFilled, document } = await createA11y()
						selectSegment($inputPreFilled, 'minutes')
						a11yUpdate($inputPreFilled, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal(
							'<p>Pre-filled input grouping 12:00 AM.</p><p>Minutes spin button 0.</p><p>0.</p>',
						)
					})
					it('null [initial, select, update] (minutes)', async () => {
						const { document } = await createA11y()
						selectSegment(null, 'minutes')
						a11yUpdate(null, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal('')
					})
				})
			}
			function mode(): void {
				describe('mode', () => {
					it('$input [initial, select, update] (mode)', async () => {
						const { $input, document } = await createA11y()
						selectSegment($input, 'mode')
						a11yUpdate($input, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal(
							'<p>Blank input grouping blank:blank blank.</p><p>AM/PM spin button blank.</p><p>blank.</p>',
						)
					})
					it('$inputPreFilled [initial, select, update] (mode)', async () => {
						const { $inputPreFilled, document } = await createA11y()
						selectSegment($inputPreFilled, 'mode')
						a11yUpdate($inputPreFilled, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal(
							'<p>Pre-filled input grouping 12:00 AM.</p><p>AM/PM spin button AM.</p><p>AM.</p>',
						)
					})
					it('null [initial, select, update] (mode)', async () => {
						const { document } = await createA11y()
						selectSegment(null, 'mode')
						a11yUpdate(null, ['initial', 'select', 'update'], document)
						expect(document.getElementById(a11yID)?.innerHTML).to.equal('')
					})
				})
			}
		})
	}

	function _initial_clear_(): void {
		describe('initial > clear', () => {
			it('$input [initial] > clear', async () => {
				const { $input, document } = await createA11y()
				a11yUpdate($input, ['initial'], document)
				a11yClear(document)
				expect(document.getElementById(a11yID)?.innerHTML).to.equal('')
			})
		})
	}
})
