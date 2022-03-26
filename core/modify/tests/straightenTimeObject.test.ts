import { TimeObject } from '../../../types'
import { straightenTimeObject } from '../modify'

export default (): void => {
	describe('Straighten time object tests', (): void => {
		const invalidTimeObject: TimeObject = {
			hrs12: 1,
			hrs24: 13,
			minutes: 0,
			mode: 'AM',
		}
		const validTimeObject: TimeObject = {
			hrs12: 1,
			hrs24: 13,
			minutes: 0,
			mode: 'PM',
		}

		invalidTransformTest()
		validTransformTest()

		function invalidTransformTest(): void {
			describe('INVALID time object transform', () => {
				alignTo12hr()
				alignTo24hr()

				function alignTo12hr(): void {
					it('align to hrs12', () => {
						expect(straightenTimeObject('hrs12', invalidTimeObject)).to.deep.equal({
							hrs12: 1,
							hrs24: 1,
							minutes: 0,
							mode: 'AM',
						})
					})
				}

				function alignTo24hr(): void {
					it('align to hrs24', () => {
						expect(straightenTimeObject('hrs24', invalidTimeObject)).to.deep.equal({
							hrs12: 1,
							hrs24: 13,
							minutes: 0,
							mode: 'PM',
						})
					})
				}
			})
		}
		function validTransformTest(): void {
			describe('VALID time object transform', () => {
				alignTo12hr()
				alignTo24hr()

				function alignTo12hr(): void {
					it('align to hrs12', () => {
						expect(straightenTimeObject('hrs12', validTimeObject)).to.deep.equal({
							hrs12: 1,
							hrs24: 13,
							minutes: 0,
							mode: 'PM',
						})
					})
				}

				function alignTo24hr(): void {
					it('align to hrs24', () => {
						expect(straightenTimeObject('hrs24', validTimeObject)).to.deep.equal({
							hrs12: 1,
							hrs24: 13,
							minutes: 0,
							mode: 'PM',
						})
					})
				}
			})
		}
	})
}
