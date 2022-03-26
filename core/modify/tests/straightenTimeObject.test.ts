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
					describe('align to hrs12', () => {
						it('full', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: invalidTimeObject,
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 1,
								minutes: 0,
								mode: 'AM',
							})
						})
						it('no hrs12', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...invalidTimeObject,
										hrs12: null,
									},
								}),
							).to.deep.equal({
								hrs12: null,
								hrs24: null,
								minutes: 0,
								mode: 'AM',
							})
						})
						it('no hrs24', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...invalidTimeObject,
										hrs24: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 1,
								minutes: 0,
								mode: 'AM',
							})
						})
						it('no min', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...invalidTimeObject,
										minutes: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 1,
								minutes: null,
								mode: 'AM',
							})
						})
						it('no mode', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...invalidTimeObject,
										mode: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: null,
								minutes: 0,
								mode: null,
							})
						})
					})
				}

				function alignTo24hr(): void {
					describe('align to hrs24', () => {
						it('full', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: invalidTimeObject,
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no hrs12', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...invalidTimeObject,
										hrs12: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no hrs24', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...invalidTimeObject,
										hrs24: null,
									},
								}),
							).to.deep.equal({
								hrs12: null,
								hrs24: null,
								minutes: 0,
								mode: 'AM',
							})
						})
						it('no min', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...invalidTimeObject,
										minutes: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: null,
								mode: 'PM',
							})
						})
						it('no mode', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...invalidTimeObject,
										mode: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
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
					describe('align to hrs12', () => {
						it('full', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: validTimeObject,
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no hrs12', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...validTimeObject,
										hrs12: null,
									},
								}),
							).to.deep.equal({
								hrs12: null,
								hrs24: null,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no hrs24', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...validTimeObject,
										hrs24: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no min', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...validTimeObject,
										minutes: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: null,
								mode: 'PM',
							})
						})
						it('no mode', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs12',
									invalidTimeObject: {
										...validTimeObject,
										mode: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: null,
								minutes: 0,
								mode: null,
							})
						})
					})
				}

				function alignTo24hr(): void {
					describe('align to hrs24', () => {
						it('full', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: validTimeObject,
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no hrs12', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...validTimeObject,
										hrs12: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no hrs24', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...validTimeObject,
										hrs24: null,
									},
								}),
							).to.deep.equal({
								hrs12: null,
								hrs24: null,
								minutes: 0,
								mode: 'PM',
							})
						})
						it('no minutes', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...validTimeObject,
										minutes: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: null,
								mode: 'PM',
							})
						})
						it('no mode', () => {
							expect(
								straightenTimeObject({
									basedOn: 'hrs24',
									invalidTimeObject: {
										...validTimeObject,
										mode: null,
									},
								}),
							).to.deep.equal({
								hrs12: 1,
								hrs24: 13,
								minutes: 0,
								mode: 'PM',
							})
						})
					})
				}
			})
		}
	})
}
