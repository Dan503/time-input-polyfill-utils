import { loadTestPage } from '../../cypress/support/loadTestPage'
import { Segment, String12hr, String24hr, TimeObject } from '../../types/index'
import { convertTimeObject } from '../convert/convert'
import { selectSegment } from '../select/select'
import { modifyString12hr, modifyTimeObject } from './modify'
import { Action, Integration } from './modify.types'
import clearTests from './tests/clear.test'
import cursorSegmentDecrement from './tests/decrement/cursorSegment.decrement.test'
import hoursDecrementTests from './tests/decrement/hours.decrement.test'
import minutesDecrementTests from './tests/decrement/minutes.decrement.test'
import walkThroughDecrementTest from './tests/decrement/walkThrough.decrement.test'
import cursorSegmentIncrement from './tests/increment/cursorSegment.increment.test'
import hoursIncrementTests from './tests/increment/hours.increment.test'
import minutesIncrementTests from './tests/increment/minutes.increment.test'
import walkThroughIncrementTest from './tests/increment/walkThrough.increment.test'
import straightenTimeObjectTest from './tests/straightenTimeObject.test'
import toggleModeTest from './tests/toggleMode.test'

interface StringModifierTest {
	before: String24hr | String12hr
	after: String24hr | String12hr
	test: () => String24hr | String12hr
}

interface ObjectModifierTest {
	before: TimeObject
	after: TimeObject
	test: () => TimeObject
}

export interface BeforeAfterString {
	before: String12hr | String24hr
	after: String12hr | String24hr
}

export interface BeforeAfterObject {
	before: TimeObject
	after: TimeObject
}

export type PlusSegment<Interface> = Interface & { segment: Segment }

export function modifierTest({ before, after, test }: StringModifierTest): void {
	it(`${before} => ${after}`, () => {
		expect(test()).to.equal(after)
	})
}

export function deepModifierTest({ before, after, test }: ObjectModifierTest): void {
	it(`${JSON.stringify(before)} => ${JSON.stringify(after)}`, () => {
		expect(test()).to.deep.equal(after)
	})
}

interface SegmentTest {
	segment?: Segment
	before: string
	after: string
	action: Action
	integration: Integration
}
export function segmentTest({ segment, before, after, action, integration }: SegmentTest): void {
	it(`${segment || '[no segment]'}: ${before} => ${after}`, async () => {
		const { $input } = await loadTestPage()
		$input.value = before
		selectSegment($input, segment)
		expect(
			// eslint-disable-next-line prettier/prettier
			modifyString12hr(before)[action].cursorSegment($input)[integration](),
		).to.equal(after)
	})
}

interface SegmentTimeObjectTest {
	segment?: Segment
	before: TimeObject
	after: TimeObject
	action: Action
	integration: Integration
}
export function segmentTimeObjectTest({
	segment,
	before,
	after,
	action,
	integration,
}: SegmentTimeObjectTest): void {
	const [beforeString, afterString] = [JSON.stringify(before), JSON.stringify(after)]
	it(`${segment || '[no segment]'}: ${beforeString} => ${afterString}`, async () => {
		const { $input } = await loadTestPage()
		$input.value = convertTimeObject(before).to12hr()
		selectSegment($input, segment)
		expect(
			// eslint-disable-next-line prettier/prettier
			modifyTimeObject(before)[action].cursorSegment($input)[integration](),
		).to.deep.equal(after)
	})
}

describe('Hours', () => {
	hoursIncrementTests()
	hoursDecrementTests()
})

describe('Minutes', () => {
	minutesIncrementTests()
	minutesDecrementTests()
})

toggleModeTest()

clearTests()

describe('Cursor Segment', () => {
	cursorSegmentIncrement()
	cursorSegmentDecrement()
})

describe('Walk through from blank tests', () => {
	walkThroughIncrementTest()
	walkThroughDecrementTest()
})

straightenTimeObjectTest()
