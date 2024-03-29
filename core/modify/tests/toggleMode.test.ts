import { TimeObject } from '../../../types/index'
import { modifyString12hr, modifyString24hr, modifyTimeObject } from '../modify'
import { ModifyString12hr, ModifyString24hr } from '../modify.types'

export default (): void => {
	describe('Mode toggle', (): void => {
		toggle12hr()
		toggle24hr()
		toggleTimeObject()
		isolatedModeChange()
		integratedModeChange()

		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		function createStringTestFunction(modifierFunction: ModifyString12hr | ModifyString24hr) {
			interface TempString extends String {
				isolated?: never
				integrated?: never
			}

			interface IntegratedVsIsolated {
				isolated: string
				integrated: string
			}

			return (
				input: string,
				incrementExpectation: TempString | IntegratedVsIsolated,
				decrementExpectation: TempString | IntegratedVsIsolated = incrementExpectation,
			): void => {
				const emptyName = '""'
				const inputName = input || emptyName
				const incrementExpectationName = incrementExpectation || emptyName
				const decrementExpectationName = decrementExpectation || emptyName
				describe(`${inputName} => ${incrementExpectationName}`, () => {
					describe('increment', () => {
						it(`isolated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifierFunction(input).increment.mode.isolated()).to.equal(
								incrementExpectation.isolated || incrementExpectation,
							)
						})
						it(`integrated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifierFunction(input).increment.mode.integrated()).to.equal(
								incrementExpectation.integrated || incrementExpectation,
							)
						})
						it(`toggleMode-isolated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifierFunction(input).toggleMode('AM', false)).to.equal(
								incrementExpectation.isolated || incrementExpectation,
							)
						})
						it(`toggleMode-integrated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifierFunction(input).toggleMode('AM', true)).to.equal(
								incrementExpectation.integrated || incrementExpectation,
							)
						})
					})
					describe('decrement', () => {
						it(`isolated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifierFunction(input).decrement.mode.isolated()).to.equal(
								decrementExpectation.isolated || decrementExpectation,
							)
						})
						it(`integrated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifierFunction(input).decrement.mode.integrated()).to.equal(
								decrementExpectation.integrated || decrementExpectation,
							)
						})
						it(`toggleMode-isolated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifierFunction(input).toggleMode('PM', false)).to.equal(
								decrementExpectation.isolated || decrementExpectation,
							)
						})
						it(`toggleMode-integrated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifierFunction(input).toggleMode('PM', true)).to.equal(
								decrementExpectation.integrated || decrementExpectation,
							)
						})
					})
				})
			}
		}

		function toggle12hr(): void {
			const test = createStringTestFunction(modifyString12hr)
			describe('12 hour mode toggle', () => {
				test('12:30 PM', '12:30 AM')
				test('12:30 AM', '12:30 PM')
				test('11:30 AM', '11:30 PM')
				test('01:30 PM', '01:30 AM')
				test('01:-- PM', '01:-- AM')
				test('--:30 PM', '--:30 AM')
				test('12:30 --', '12:30 AM', '12:30 PM')
				test('12:-- --', '12:-- AM', '12:-- PM')
				test('--:30 --', '--:30 AM', '--:30 PM')
				test('--:-- --', '--:-- AM', '--:-- PM')
			})
		}

		function toggle24hr(): void {
			const test = createStringTestFunction(modifyString24hr)
			describe('24 hour mode toggle', () => {
				test('00:30', '12:30')
				test('12:30', '00:30')
				test('11:30', '23:30')
				test('13:30', '01:30')
				test('', '')
			})
		}

		function toggleTimeObject(): void {
			describe('Time object mode toggle', () => {
				testTimeObject(
					{ hrs24: 11, hrs12: 11, minutes: 30, mode: 'AM' },
					{ hrs24: 23, hrs12: 11, minutes: 30, mode: 'PM' },
				)
				testTimeObject(
					{ hrs24: 13, hrs12: 1, minutes: 30, mode: 'PM' },
					{ hrs24: 1, hrs12: 1, minutes: 30, mode: 'AM' },
				)
				testTimeObject(
					{ hrs24: 0, hrs12: 12, minutes: 30, mode: 'AM' },
					{ hrs24: 12, hrs12: 12, minutes: 30, mode: 'PM' },
				)
				testTimeObject(
					{ hrs24: 12, hrs12: 12, minutes: 30, mode: 'PM' },
					{ hrs24: 0, hrs12: 12, minutes: 30, mode: 'AM' },
				)
				testTimeObject(
					{ hrs24: 13, hrs12: 1, minutes: null, mode: 'PM' },
					{ hrs24: 1, hrs12: 1, minutes: null, mode: 'AM' },
				)
				testTimeObject(
					{ hrs24: 13, hrs12: 1, minutes: null, mode: 'PM' },
					{ hrs24: 1, hrs12: 1, minutes: null, mode: 'AM' },
				)
				testTimeObject(
					{ hrs24: null, hrs12: null, minutes: 30, mode: 'PM' },
					{ hrs24: null, hrs12: null, minutes: 30, mode: 'AM' },
				)
				testTimeObject(
					{ hrs24: null, hrs12: null, minutes: null, mode: null },
					{ hrs24: null, hrs12: null, minutes: null, mode: 'AM' },
					{ hrs24: null, hrs12: null, minutes: null, mode: 'PM' },
				)
				testTimeObject(
					{ hrs24: 12, hrs12: 12, minutes: 30, mode: null },
					{
						integrated: {
							hrs24: 12,
							hrs12: 12,
							minutes: 30,
							mode: 'PM',
						},
						isolated: {
							hrs24: 0,
							hrs12: 12,
							minutes: 30,
							mode: 'AM',
						},
					},
					{
						hrs24: 12,
						hrs12: 12,
						minutes: 30,
						mode: 'PM',
					},
				)
				testTimeObject(
					{ hrs24: 11, hrs12: 11, minutes: 30, mode: null },
					{
						hrs24: 11,
						hrs12: 11,
						minutes: 30,
						mode: 'AM',
					},
					{
						integrated: {
							hrs24: 11,
							hrs12: 11,
							minutes: 30,
							mode: 'AM',
						},
						isolated: {
							hrs24: 23,
							hrs12: 11,
							minutes: 30,
							mode: 'PM',
						},
					},
				)
				testTimeObject(
					{ hrs24: 1, hrs12: 1, minutes: 30, mode: null },
					{
						hrs24: 1,
						hrs12: 1,
						minutes: 30,
						mode: 'AM',
					},
					{
						integrated: {
							hrs24: 1,
							hrs12: 1,
							minutes: 30,
							mode: 'AM',
						},
						isolated: {
							hrs24: 13,
							hrs12: 1,
							minutes: 30,
							mode: 'PM',
						},
					},
				)
				testTimeObject(
					{ hrs24: 1, hrs12: 1, minutes: null, mode: null },
					{
						hrs24: 1,
						hrs12: 1,
						minutes: null,
						mode: 'AM',
					},
					{
						integrated: {
							hrs24: 1,
							hrs12: 1,
							minutes: null,
							mode: 'AM',
						},
						isolated: {
							hrs24: 13,
							hrs12: 1,
							minutes: null,
							mode: 'PM',
						},
					},
				)
				testTimeObject(
					{ hrs24: null, hrs12: null, minutes: 30, mode: null },
					{
						hrs24: null,
						hrs12: null,
						minutes: 30,
						mode: 'AM',
					},
					{
						hrs24: null,
						hrs12: null,
						minutes: 30,
						mode: 'PM',
					},
				)
			})

			interface IntegrateIsolateBreakdown {
				integrated: TimeObject
				isolated: TimeObject
				hrs24?: never
				hrs12?: never
				minutes?: never
				mode?: never
			}
			interface TempTimeObj extends TimeObject {
				integrated?: never
				isolated?: never
			}

			function testTimeObject(
				input: TimeObject,
				incrementExpectation: TempTimeObj | IntegrateIsolateBreakdown,
				decrementExpectation:
					| TempTimeObj
					| IntegrateIsolateBreakdown = incrementExpectation,
			): void {
				const inputName = JSON.stringify(input)
				const incrementExpectationName = JSON.stringify(incrementExpectation)
				const decrementExpectationName = JSON.stringify(decrementExpectation)

				describe(`${inputName} => ${incrementExpectationName}`, () => {
					describe('increment', () => {
						it(`isolated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifyTimeObject(input).increment.mode.isolated()).to.deep.equal(
								incrementExpectation.isolated || incrementExpectation,
							)
						})
						it(`integrated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(
								modifyTimeObject(input).increment.mode.integrated(),
							).to.deep.equal(incrementExpectation.integrated || incrementExpectation)
						})
						it(`toggleMode-isolated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifyTimeObject(input).toggleMode('AM', false)).to.deep.equal(
								incrementExpectation.isolated || incrementExpectation,
							)
						})
						it(`toggleMode-integrated: ${inputName} => ${incrementExpectationName}`, () => {
							expect(modifyTimeObject(input).toggleMode('AM', true)).to.deep.equal(
								incrementExpectation.integrated || incrementExpectation,
							)
						})
					})
					describe('decrement', () => {
						it(`isolated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifyTimeObject(input).decrement.mode.isolated()).to.deep.equal(
								decrementExpectation.isolated || decrementExpectation,
							)
						})
						it(`integrated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(
								modifyTimeObject(input).decrement.mode.integrated(),
							).to.deep.equal(decrementExpectation.integrated || decrementExpectation)
						})
						it(`toggleMode-isolated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifyTimeObject(input).toggleMode('PM', false)).to.deep.equal(
								decrementExpectation.isolated || decrementExpectation,
							)
						})
						it(`toggleMode-integrated: ${inputName} => ${decrementExpectationName}`, () => {
							expect(modifyTimeObject(input).toggleMode('PM', true)).to.deep.equal(
								decrementExpectation.integrated || decrementExpectation,
							)
						})
					})
				})
			}
		}
	})

	function isolatedModeChange(): void {
		describe('Isolated: Ignores hrs24 when mode toggling from blank', () => {
			it('increment (isolated) will always set to AM', () => {
				expect(
					modifyTimeObject({
						hrs12: 8,
						hrs24: 20,
						minutes: 30,
						mode: null,
					}).increment.mode.isolated(),
				).to.deep.equal({
					hrs12: 8,
					hrs24: 8,
					minutes: 30,
					mode: 'AM',
				})
			})

			it('decrement (isolated) will always set to PM', () => {
				expect(
					modifyTimeObject({
						hrs12: 8,
						hrs24: 8,
						minutes: 30,
						mode: null,
					}).decrement.mode.isolated(),
				).to.deep.equal({
					hrs12: 8,
					hrs24: 20,
					minutes: 30,
					mode: 'PM',
				})
			})
		})
	}

	function integratedModeChange(): void {
		describe('Integrated: Honours hrs24 when mode toggling from blank', () => {
			it('increment (integrated) [hrs24 < 12] = AM', () => {
				expect(
					modifyTimeObject({
						hrs12: 11,
						hrs24: 11,
						minutes: 30,
						mode: null,
					}).increment.mode.integrated(),
				).to.deep.equal({
					hrs12: 11,
					hrs24: 11,
					minutes: 30,
					mode: 'AM',
				})
			})
			it('increment (integrated) [hrs24 >= 12] = PM', () => {
				expect(
					modifyTimeObject({
						hrs12: 12,
						hrs24: 12,
						minutes: 30,
						mode: null,
					}).increment.mode.integrated(),
				).to.deep.equal({
					hrs12: 12,
					hrs24: 12,
					minutes: 30,
					mode: 'PM',
				})
			})
			it('decrement (integrated) [hrs24 < 12] = AM', () => {
				expect(
					modifyTimeObject({
						hrs12: 11,
						hrs24: 11,
						minutes: 30,
						mode: null,
					}).decrement.mode.integrated(),
				).to.deep.equal({
					hrs12: 11,
					hrs24: 11,
					minutes: 30,
					mode: 'AM',
				})
			})
			it('decrement (integrated) [hrs24 >= 12] = PM', () => {
				expect(
					modifyTimeObject({
						hrs12: 12,
						hrs24: 12,
						minutes: 30,
						mode: null,
					}).decrement.mode.integrated(),
				).to.deep.equal({
					hrs12: 12,
					hrs24: 12,
					minutes: 30,
					mode: 'PM',
				})
			})
		})
	}
}
