import { validate } from './validate'
import { failTest } from '../../cypress/helpers/failTest'

/* global describe, expect, it */

const writeBadValue = badValue => (typeof badValue === 'string' ? `"${badValue}"` : badValue)

describe('validate 12 hour time', () => {
	const fail12hr = value => {
		it(`"${value}" FAIL`, () => {
			failTest(
				() => validate.string12hr(value),
				`"${value}" is not a valid 12 hour time, use the format "HH:MM AM/PM"`,
			)
		})
	}
	const pass12hr = value => {
		it(`"${value}" PASS`, () => {
			expect(validate.string12hr(value)).to.equal(true)
		})
	}

	fail12hr('12:00')
	fail12hr('')

	pass12hr('12:00 AM')
	pass12hr('12:59 AM')

	fail12hr('12:60 AM')
	fail12hr('13:00 AM')

	pass12hr('2:00 PM')
	pass12hr('1:-- --')
	pass12hr('01:-- --')
	pass12hr('--:00 --')
	pass12hr('--:-- PM')
	pass12hr('--:-- --')

	fail12hr('--:--')
})

describe('validate 24 hour time', () => {
	const fail24hr = (value, extraMessage = '') => {
		it(`"${value}" FAIL`, () => {
			failTest(
				() => validate.string24hr(value),
				`"${value}" is not a valid 24 hour time.${extraMessage}`,
			)
		})
	}
	const pass24hr = value => {
		it(`"${value}" PASS`, () => {
			expect(validate.string24hr(value)).to.equal(true)
		})
	}

	pass24hr('00:00')

	fail24hr('0:00')

	pass24hr('12:00')
	pass24hr('12:59')

	fail24hr('12:60')
	fail24hr('24:00', ' Use "00" instead of "24".')
	fail24hr('12:00 PM')
	fail24hr('2:00 PM')

	pass24hr('')

	fail24hr('--:--', ' Use an empty string instead of "--:--" to represent a blank value')
	fail24hr('--:-- --', ' Use an empty string instead of "--:--" to represent a blank value')
})

describe('validate time object', () => {
	it('basic time object', () => {
		expect(validate.timeObject({ hrs24: 13, hrs12: 1, min: 0, mode: 'PM' })).to.equal(true)
	})
	it('hrs12 & hrs24 mismatch', () => {
		failTest(
			() => validate.timeObject({ hrs24: 2, hrs12: 1, min: 0, mode: 'AM' }),
			'hrs12 (1) should be equal to or 12 hours behind hrs24 (2)',
		)
	})
	it('hrs24 & AM/PM mismatch', () => {
		failTest(
			() => validate.timeObject({ hrs24: 1, hrs12: 1, min: 0, mode: 'PM' }),
			'If mode (PM) is "PM", hrs24 (1) should be greater than or equal to 12',
		)
	})
	describe('invalid properties', () => {
		const invalidProp = propName => {
			it(`"${propName}" property is not valid`, () => {
				const testObject = {
					hrs24: 1,
					hrs12: 1,
					min: 0,
					mode: 'AM',
					[propName]: 1,
				}
				failTest(
					() => validate.timeObject(testObject),
					`${JSON.stringify(
						testObject,
					)} is not a valid time object. Must be in the format {hrs24: 0, hrs12: 12, min: 0, mode: 'AM'} (12:00 AM)`,
				)
			})
		}

		const invalidProps = ['hrs', 'hour', 'hours', 'hours12', 'hours24', 'mins', 'minutes']
		invalidProps.forEach(prop => invalidProp(prop))
	})
	describe('invalid property types', () => {
		const numberTypeCheck = ({ propName, lower, upper }) => {
			const validTimeObject = { hrs24: 1, hrs12: 1, min: 0, mode: 'AM' }
			const goodValue = validTimeObject[propName]
			const badPropValues = [`${goodValue}`, upper + 1, lower - 1]
			const badTimeObjects = badPropValues.map(badValue => ({
				...validTimeObject,
				[propName]: badValue,
			}))

			const testNames = [
				`"${propName}" is an invalid string`,
				`"${propName}" is out of upper range (${upper + 1})`,
				`"${propName}" is out of lower range (${lower - 1})`,
			]

			describe(propName, () => {
				testNames.forEach((testName, index) => {
					const badValue = writeBadValue(badPropValues[index])
					it(testName, () => {
						failTest(
							() => validate.timeObject(badTimeObjects[index]),
							`${propName} (${badValue}) is invalid, "${propName}" must be a number ${lower}-${upper} or "--"`,
						)
					})
				})
			})
		}

		numberTypeCheck({ propName: 'hrs24', lower: 0, upper: 23 })
		numberTypeCheck({ propName: 'hrs12', lower: 1, upper: 12 })
		numberTypeCheck({ propName: 'min', lower: 0, upper: 59 })

		describe('mode', () => {
			const modeTest = (testName, mode) => {
				const badValue = writeBadValue(mode)
				it(testName, () => {
					failTest(
						() => validate.timeObject({ hrs24: 1, hrs12: 1, min: 0, mode }),
						`Mode (${badValue}) is invalid. Valid values are: "AM","PM","--"`,
					)
				})
			}
			modeTest('empty string invalid', '')
			modeTest('lower case is invalid', 'am')
			modeTest('nonsense is invalid', 'abc')
			modeTest('numbers are invalid', 1)
		})
	})

	describe('missing properties', () => {
		const validTimeObject = { hrs24: 1, hrs12: 1, min: 0, mode: 'AM' }

		const missingPropTest = missingProp => {
			const badTimeObject = { ...validTimeObject }
			delete badTimeObject[missingProp]

			it(`${missingProp} property is missing`, () => {
				failTest(
					() => validate.timeObject(badTimeObject),
					`${JSON.stringify(
						badTimeObject,
					)} is not a valid time object. Must be in the format {hrs24: 0, hrs12: 12, min: 0, mode: 'AM'} (12:00 AM)`,
				)
			})
		}

		missingPropTest('hrs24')
		missingPropTest('hrs12')
		missingPropTest('min')
		missingPropTest('mode')
	})
})
