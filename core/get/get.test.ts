import { blankValues } from '../../common/index'
import { failTest } from '../../cypress/support/failTest'
import { LoadedPage, loadTestPage } from '../../cypress/support/loadTestPage'
import { preFilledValues } from '../../cypress/support/staticTestValues'
import { SelectionRange } from '../../types/index'
import { ranges } from '../staticValues'
import {
	getAncestorsOf,
	getInputValue,
	getLabelTextOf,
	getNextSegment,
	getPrevSegment,
	getRangeOf,
	getString12hr,
	getString24hr,
	provideTimeString,
} from './get'

getAncestorsTests()
getString12hrTests()
getString24hrTests()
getValueTests()
getLabelTextTests()
getRangeTests()
provideTimeStringTests()

function getAncestorsTests(): void {
	describe('Get ancestors tests', () => {
		it(`getAncestorsOf($input)`, async () => {
			const { $input } = await loadTestPage()
			expect(getAncestorsOf($input)).to.deep.equal([
				$input.parentElement,
				$input.parentElement?.parentElement,
				$input.parentElement?.parentElement?.parentElement,
			])
		})

		it(`getAncestorsOf($input, 'div')`, async () => {
			const { $input } = await loadTestPage()
			expect(getAncestorsOf($input, 'div')).to.deep.equal([$input.parentElement])
		})
		it(`getAncestorsOf(null, 'div')`, async () => {
			expect(getAncestorsOf(null, 'div')).to.deep.equal([])
		})
	})
}

function getString12hrTests(): void {
	describe('get string 12hr', () => {
		it('expects get 12:30 PM hrs12 => 12', () => {
			expect(getString12hr('12:30 PM').hrs12).to.equal(12)
		})
		it('expects get 01:30 PM hrs24 => 13', () => {
			expect(getString12hr('01:30 PM').hrs24).to.equal(13)
		})
		it('expects get 01:30 PM minutes => 30', () => {
			expect(getString12hr('01:30 PM').minutes).to.equal(30)
		})
		it('expects get 01:30 PM mode => PM', () => {
			expect(getString12hr('01:30 PM').mode).to.equal('PM')
		})
	})
}

function getString24hrTests(): void {
	describe('get string 24hr', () => {
		it('expects get 0:30 hrs12 => 12', () => {
			expect(getString24hr('00:30').hrs12).to.equal(12)
		})
		it('expects get 0:30 hrs24 => 0', () => {
			expect(getString24hr('00:30').hrs24).to.equal(0)
		})
		it('expects get 0:30 minutes => 30', () => {
			expect(getString24hr('00:30').minutes).to.equal(30)
		})
		it('expects get 0:30 mode => AM', () => {
			expect(getString24hr('00:30').mode).to.equal('AM')
		})
	})
}

function getValueTests(): void {
	describe('Get value from input', () => {
		blankInputTests()
		nullInputTests()
		preFilledInputTests()

		function blankInputTests(): void {
			describe('Blank input', () => {
				it(`expects blank => "${blankValues.string12hr}"`, async () => {
					const { $input } = await loadTestPage()
					expect(getInputValue($input).as12hrString()).to.equal(blankValues.string12hr)
				})
				it(`expects blank => "${blankValues.string24hr}"`, async () => {
					const { $input } = await loadTestPage()
					expect(getInputValue($input).as24hrString()).to.equal(blankValues.string24hr)
				})
				it(`expects blank => ${JSON.stringify(blankValues.timeObject)}`, async () => {
					const { $input } = await loadTestPage()
					expect(getInputValue($input).asTimeObject()).to.deep.equal(
						blankValues.timeObject,
					)
				})
				it(`expects null => "${blankValues.string12hr}"`, async () => {
					expect(getInputValue(null).as12hrString()).to.equal(blankValues.string12hr)
				})
			})
		}

		function nullInputTests(): void {
			describe('null input', () => {
				it(`null => "${blankValues.string12hr}"`, () => {
					expect(getInputValue(null).as12hrString()).to.equal(blankValues.string12hr)
				})
				it(`null => "${blankValues.string24hr}"`, () => {
					expect(getInputValue(null).as24hrString()).to.equal(blankValues.string24hr)
				})
				it(`null => ${JSON.stringify(blankValues.timeObject)}`, () => {
					expect(getInputValue(null).asTimeObject()).to.deep.equal(blankValues.timeObject)
				})
			})
		}

		function preFilledInputTests(): void {
			describe('Pre-filled input', () => {
				it(`expects "12:00 AM" => "${preFilledValues.string12hr}"`, async () => {
					const { $inputPreFilled } = await loadTestPage()
					expect(getInputValue($inputPreFilled).as12hrString()).to.equal(
						preFilledValues.string12hr,
					)
				})
				it(`expects "12:00 AM" => "${preFilledValues.string24hr}"`, async () => {
					const { $inputPreFilled } = await loadTestPage()
					expect(getInputValue($inputPreFilled).as24hrString()).to.equal(
						preFilledValues.string24hr,
					)
				})
				it(`expects "12:00 AM" => ${JSON.stringify(
					preFilledValues.timeObject,
				)}`, async () => {
					const { $inputPreFilled } = await loadTestPage()
					expect(getInputValue($inputPreFilled).asTimeObject()).to.deep.equal(
						preFilledValues.timeObject,
					)
				})
			})
		}
	})
}

function getLabelTextTests(): void {
	describe('Get label text for input', async () => {
		const loadPage = (): LoadedPage => loadTestPage('./core/get/label-tests-file.html')

		it(`null`, () => {
			expect(getLabelTextOf(null)).to.equal('')
		})
		it(`aria-labelledby`, async () => {
			const { document } = await loadPage()
			const $input = document.querySelector(
				'[aria-labelledby="aria-labelledby"]',
			) as HTMLInputElement
			expect(getLabelTextOf($input, document)).to.equal('aria-labelledby label')
		})
		it(`aria-label`, async () => {
			const { document } = await loadPage()
			const $input = document.querySelector(
				'[aria-label="aria-label label"]',
			) as HTMLInputElement
			expect(getLabelTextOf($input, document)).to.equal('aria-label label')
		})
		it(`For attribute`, async () => {
			const { document } = await loadPage()
			const $input = document.getElementById('forAttr') as HTMLInputElement
			expect(getLabelTextOf($input, document)).to.equal('For attribute label')
		})
		it(`Wrapper label`, async () => {
			const { document } = await loadPage()
			const $input = document.getElementById('wrappedInput') as HTMLInputElement
			expect(getLabelTextOf($input, document)).to.equal('Wrapper label')
		})
		it(`Title label`, async () => {
			const { document } = await loadPage()
			const $input = document.querySelector('[title="title label"]') as HTMLInputElement
			expect(getLabelTextOf($input, document)).to.equal('title label')
		})
		it(`Missing label`, async () => {
			const { document } = await loadPage()
			const $input = document.getElementById('noLabel') as HTMLInputElement
			failTest(
				() => getLabelTextOf($input, document),
				'Cannot polyfill time input due to a missing label.',
			)
		})
	})
}

type RangeTestAction = 'rawSelection' | 'cursorSegment' | 'nextSegment' | 'prevSegment'

function getRangeTests(): void {
	function generateRangeTest(action: RangeTestAction): Function {
		return (
			position: number,
			expectation: SelectionRange,
			position2: number = position,
		): void => {
			it(`range at ${position}-${position2}`, async () => {
				const { $input } = await loadTestPage()
				$input.setSelectionRange(position, position2)
				expect(getRangeOf($input)[action]()).to.deep.equal(expectation)
			})
		}
	}

	function nullRangeTest(action: RangeTestAction, expectation: SelectionRange): void {
		it(`null and action is "${action}"`, () => {
			expect(getRangeOf(null)[action]()).to.deep.equal(expectation)
		})
	}

	describe('Get range of input tests', () => {
		fullSelectionTests()
		cursorSegmentTests()
		nextSegmentTests()
		prevSegmentTests()

		function fullSelectionTests(): void {
			describe('rawSelection tests', () => {
				const testRangeAt = generateRangeTest('rawSelection')

				nullRangeTest('rawSelection', { start: 0, end: 0, segment: 'hrs12' })

				testRangeAt(0, { start: 0, end: 0, segment: 'hrs12' })
				testRangeAt(1, { start: 1, end: 1, segment: 'hrs12' })
				testRangeAt(2, { start: 2, end: 2, segment: 'hrs12' })

				testRangeAt(3, { start: 3, end: 3, segment: 'minutes' })
				testRangeAt(4, { start: 4, end: 4, segment: 'minutes' })
				testRangeAt(5, { start: 5, end: 5, segment: 'minutes' })

				testRangeAt(6, { start: 6, end: 6, segment: 'mode' })
				testRangeAt(7, { start: 7, end: 7, segment: 'mode' })
				testRangeAt(8, { start: 8, end: 8, segment: 'mode' })

				testRangeAt(0, { start: 0, end: 8, segment: 'hrs12' }, 8)
				testRangeAt(1, { start: 1, end: 8, segment: 'hrs12' }, 8)
				testRangeAt(2, { start: 2, end: 8, segment: 'hrs12' }, 8)

				testRangeAt(3, { start: 3, end: 8, segment: 'minutes' }, 8)
				testRangeAt(4, { start: 4, end: 8, segment: 'minutes' }, 8)
				testRangeAt(5, { start: 5, end: 8, segment: 'minutes' }, 8)

				testRangeAt(6, { start: 6, end: 8, segment: 'mode' }, 8)
				testRangeAt(7, { start: 7, end: 8, segment: 'mode' }, 8)
			})
		}

		function cursorSegmentTests(): void {
			describe('cursorSegment tests', () => {
				const testRangeAt = generateRangeTest('cursorSegment')

				// Not testing getCursorSegment because it is just an alias for:
				// getRangeOf($input).cursorSegment().segment

				nullRangeTest('cursorSegment', ranges.hrs12)

				testRangeAt(0, ranges.hrs12)
				testRangeAt(1, ranges.hrs12)
				testRangeAt(2, ranges.hrs12)

				testRangeAt(3, ranges.minutes)
				testRangeAt(4, ranges.minutes)
				testRangeAt(5, ranges.minutes)

				testRangeAt(6, ranges.mode)
				testRangeAt(7, ranges.mode)
				testRangeAt(8, ranges.mode)

				testRangeAt(0, ranges.hrs12, 8)
				testRangeAt(1, ranges.hrs12, 8)
				testRangeAt(2, ranges.hrs12, 8)

				testRangeAt(3, ranges.minutes, 8)
				testRangeAt(4, ranges.minutes, 8)
				testRangeAt(5, ranges.minutes, 8)

				testRangeAt(6, ranges.mode, 8)
				testRangeAt(7, ranges.mode, 8)
			})
		}

		function nextSegmentTests(): void {
			describe('nextSegment tests', () => {
				const testRangeAt = generateRangeTest('nextSegment')

				nullRangeTest('nextSegment', ranges.minutes)

				testRangeAt(0, ranges.minutes)
				testRangeAt(1, ranges.minutes)
				testRangeAt(2, ranges.minutes)

				testRangeAt(3, ranges.mode)
				testRangeAt(4, ranges.mode)
				testRangeAt(5, ranges.mode)

				testRangeAt(6, ranges.mode)
				testRangeAt(7, ranges.mode)
				testRangeAt(8, ranges.mode)

				testRangeAt(0, ranges.minutes, 8)
				testRangeAt(1, ranges.minutes, 8)
				testRangeAt(2, ranges.minutes, 8)

				testRangeAt(3, ranges.mode, 8)
				testRangeAt(4, ranges.mode, 8)
				testRangeAt(5, ranges.mode, 8)

				testRangeAt(6, ranges.mode, 8)
				testRangeAt(7, ranges.mode, 8)

				// Not testing getNextSegment($input) because it is just an alias for:
				// getRangeOf($input).nextSegment().segment

				it('gets minutes segment', () => {
					expect(getNextSegment('hrs12')).to.equal('minutes')
				})
				it('gets mode segment', () => {
					expect(getNextSegment('minutes')).to.equal('mode')
				})
				it('stops at mode segment', () => {
					expect(getNextSegment('mode')).to.equal('mode')
				})
			})
		}

		function prevSegmentTests(): void {
			describe('prevSegment tests', () => {
				const testRangeAt = generateRangeTest('prevSegment')

				nullRangeTest('prevSegment', ranges.hrs12)

				testRangeAt(0, ranges.hrs12)
				testRangeAt(1, ranges.hrs12)
				testRangeAt(2, ranges.hrs12)

				testRangeAt(3, ranges.hrs12)
				testRangeAt(4, ranges.hrs12)
				testRangeAt(5, ranges.hrs12)

				testRangeAt(6, ranges.minutes)
				testRangeAt(7, ranges.minutes)
				testRangeAt(8, ranges.minutes)

				testRangeAt(0, ranges.hrs12, 8)
				testRangeAt(1, ranges.hrs12, 8)
				testRangeAt(2, ranges.hrs12, 8)

				testRangeAt(3, ranges.hrs12, 8)
				testRangeAt(4, ranges.hrs12, 8)
				testRangeAt(5, ranges.hrs12, 8)

				testRangeAt(6, ranges.minutes, 8)
				testRangeAt(7, ranges.minutes, 8)

				// Not testing getPrevSegment($input) because it is just an alias for:
				// getRangeOf($input).prevSegment().segment

				it('stops at hrs12 segment', () => {
					expect(getPrevSegment('hrs12')).to.equal('hrs12')
				})
				it('gets hrs12 segment', () => {
					expect(getPrevSegment('minutes')).to.equal('hrs12')
				})
				it('gets minutes segment', () => {
					expect(getPrevSegment('mode')).to.equal('minutes')
				})
			})
		}
	})
}

function provideTimeStringTests() {
	describe('Provide time string', () => {
		const expectedErrorMessage =
			'"abc" is not a valid time string. Must be either in either 12 or 24 hour time format.'
		it('invalid time string as 12hr', () => {
			try {
				provideTimeString('abc').as12hr()
			} catch (e) {
				expect((e as Error).message).to.equal(expectedErrorMessage)
			}
		})
		it('invalid time string as 24hr', () => {
			try {
				provideTimeString('abc').as24hr()
			} catch (e) {
				expect((e as Error).message).to.equal(expectedErrorMessage)
			}
		})
		const string12hr = '01:30 PM'
		const string24hr = '13:30'

		it('12hr as 12hr', () => {
			expect(provideTimeString(string12hr).as12hr()).to.equal(string12hr)
		})
		it('12hr as 24hr', () => {
			expect(provideTimeString(string12hr).as24hr()).to.equal(string24hr)
		})
		it('24hr as 24hr', () => {
			expect(provideTimeString(string24hr).as24hr()).to.equal(string24hr)
		})
		it('24hr as 12hr', () => {
			expect(provideTimeString(string24hr).as12hr()).to.equal(string12hr)
		})
	})
}
