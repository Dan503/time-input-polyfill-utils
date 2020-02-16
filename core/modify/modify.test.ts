import { modify, Integration, Action, Target } from './modify'

import { TimeObject, String12hr, String24hr } from '../../types'

import hoursIncrementTests from './tests/increment/hours.increment.test'
import hoursDecrementTests from './tests/decrement/hours.decrement.test'
import minutesIncrementTests from './tests/increment/minutes.increment.test'
import minutesDecrementTests from './tests/decrement/minutes.decrement.test'
import toggleModeTest from './tests/toggleMode.test'

export { current } from '../../helpers/currentDate'

type TimeStringFormat = 'string24hr' | 'string12hr'

interface ModifierTest {
	action: Action
	target: Target
	integration: Integration
}

interface StringModifierTest extends ModifierTest {
	format: TimeStringFormat
	before: String24hr | String12hr
	after: String24hr | String12hr
}

interface ObjectModifierTest extends ModifierTest {
	format?: 'timeObject'
	before: TimeObject
	after: TimeObject
}

export interface BeforeAfterString {
	before: String12hr | String24hr
	after: String12hr | String24hr
}

export interface BeforeAfterObject {
	before: TimeObject
	after: TimeObject
}

export interface CommonSettingsString {
	format: TimeStringFormat
	action: Action
	target: Target
}

export interface CommonSettingsObject {
	format?: 'timeObject'
	action: Action
	target: Target
}

export function modifierTest({
	before,
	after,
	format,
	action,
	target,
	integration,
}: StringModifierTest) {
	it(`${before} => ${after}`, () => {
		expect(modify[format](before)[action][target][integration]()).to.equal(after)
	})
}

export function deepModifierTest({
	before,
	after,
	format = 'timeObject',
	action,
	target,
	integration,
}: ObjectModifierTest) {
	it(`${JSON.stringify(before)} => ${JSON.stringify(after)}`, () => {
		expect(modify[format](before)[action][target][integration]()).to.deep.equal(after)
	})
}

// describe('Hours', () => {
// 	hoursIncrementTests()
// 	hoursDecrementTests()
// })

// describe('Minutes', () => {
// 	minutesIncrementTests()
// 	minutesDecrementTests()
// })

toggleModeTest()