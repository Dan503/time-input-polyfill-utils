import { select } from "./select";
import { get } from "../get/get";
import { SelectionRange, Segment } from "../../types";
import { ranges, segments } from "../staticValues";
import { inputID } from "../../cypress/support/staticTestValues";
import { loadInputElement } from "../../cypress/support/loadInputElement";

const expectRange = ($input: HTMLInputElement, expectedRange: SelectionRange) => {
	const currentRange = get.rangeOf($input).fullSelection()
	currentRange.type = expectedRange.type
	expect(currentRange).to.deep.equal(expectedRange)
}

describe('Basic setup', () => {
	it('Element exists', async () => {
		await loadInputElement()
		cy.get(`#${inputID}`).should('exist')
	})
})

testCursorRangeValues()
testCursorSegmentSelection()
testSpecificSegmentSelection()
testNextSegmentSelection()
testPrevSegmentSelection()

function testCursorRangeValues() {
	describe('Test cursor range values', () => {
		const testCursorRange = (index: number, expectation: SelectionRange) => {
			it(`test range index ${index}`, async () => {
				const $input = await loadInputElement()
				$input.selectionStart = index
				const output = get.rangeOf($input).cursorSegment()
				expect(output).to.deep.equal(expectation)
			})
		}

		testCursorRange(0, ranges.hrs)
		testCursorRange(1, ranges.hrs)
		testCursorRange(2, ranges.hrs)

		testCursorRange(3, ranges.min)
		testCursorRange(4, ranges.min)
		testCursorRange(5, ranges.min)

		testCursorRange(6, ranges.mode)
		testCursorRange(7, ranges.mode)
		testCursorRange(8, ranges.mode)
	})
}

function testCursorSegmentSelection() {
	describe('Test cursor segment selection', () => {
		const testCursorSelection = (index: number, expectation: SelectionRange) => {
			it(`select segment at index ${index}`, async () => {
				const $input = await loadInputElement()
				$input.selectionStart = index
				select($input).cursorSegment()
				expectRange($input, expectation)
			})
		}

		testCursorSelection(0, ranges.hrs)
		testCursorSelection(1, ranges.hrs)
		testCursorSelection(2, ranges.hrs)

		testCursorSelection(3, ranges.min)
		testCursorSelection(4, ranges.min)
		testCursorSelection(5, ranges.min)

		testCursorSelection(6, ranges.mode)
		testCursorSelection(7, ranges.mode)
		testCursorSelection(8, ranges.mode)
	})
}

function testSpecificSegmentSelection() {
	describe('Test specific segment selection', () => {
		const testSegmentSelect = (segment: Segment, expectation: SelectionRange) => {
			it(`select segment ${segment}`, async () => {
				const $input = await loadInputElement()
				select($input).segment(segment)
				expectRange($input, expectation)
			})
		}

		testSegmentSelect('hrs', ranges.hrs)
		testSegmentSelect('min', ranges.min)
		testSegmentSelect('mode', ranges.mode)
	})
}

function testNextSegmentSelection() {
	describe('Test next segment selection', () => {
		const testSegmentAfter = (segment: Segment, expectation: SelectionRange) => {
			it(`select segment after ${segment}`, async () => {
				const $input = await loadInputElement()
				select($input).segment(segment)
				select($input).nextSegment()
				expectRange($input, expectation)
			})
		}

		testSegmentAfter('hrs', ranges.min)
		testSegmentAfter('min', ranges.mode)
		testSegmentAfter('mode', ranges.mode)
	})
}

function testPrevSegmentSelection() {
	describe('Test previous segment selection', () => {
		const testSegmentBefore = (segment: Segment, expectation: SelectionRange) => {
			it(`select segment before ${segment}`, async () => {
				const $input = await loadInputElement()
				select($input).segment(segment)
				select($input).prevSegment()
				expectRange($input, expectation)
			})
		}

		testSegmentBefore('hrs', ranges.hrs)
		testSegmentBefore('min', ranges.hrs)
		testSegmentBefore('mode', ranges.min)
	})
}