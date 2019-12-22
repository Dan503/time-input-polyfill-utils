import { convert, toLeadingZero, toNumber, toArray } from './converters'
import { failTest } from '../../cypress/helpers/failTest'

/* global describe, it, expect */

describe('NodeList to array', () => {
	it('Expect node element list to become an array of elements', () => {
		const create = () => {
			const div = document.createElement('div')
			div.classList.add('NodeList-test')
			document.querySelector('body').appendChild(div)
			return div
		}
		const elementsArray = [create(), create(), create()]
		const nodeList = document.querySelectorAll('.NodeList-test')
		expect(toArray(nodeList)).to.deep.equal(elementsArray)
	})
})

describe('convert.hours24', () => {
	it('Expect "abc" to fail', () => {
		failTest(
			() => convert.hours24('abc').toHours12(),
			'"abc" must be a number between 0 and 23 or "--", use 0 instead of 24',
		)
	})
	it('Expect -1 hrs to fail', () => {
		failTest(
			() => convert.hours24(-1).toHours12(),
			'"-1" must be a number between 0 and 23 or "--", use 0 instead of 24',
		)
	})
	it('Expect 0 hrs to be 12', () => {
		expect(convert.hours24(0).toHours12()).to.equal(12)
	})
	it('Expect 5 hrs to be 5', () => {
		expect(convert.hours24(5).toHours12()).to.equal(5)
	})
	it('Expect 13 hrs to be 1', () => {
		expect(convert.hours24(13).toHours12()).to.equal(1)
	})
	it('Expect 23 hrs to be 11', () => {
		expect(convert.hours24(23).toHours12()).to.equal(11)
	})
	it('Expect 24 hrs to fail', () => {
		failTest(
			() => convert.hours24(24).toHours12(),
			'"24" must be a number between 0 and 23 or "--", use 0 instead of 24',
		)
	})
})

describe('convert to number', () => {
	it('Expect "0" to be 0', () => {
		expect(toNumber('0')).to.equal(0)
	})
	it('Expect "--" to be "--"', () => {
		expect(toNumber('--')).to.equal('--')
	})
	it('Expect 0 to be 0', () => {
		expect(toNumber(0)).to.equal(0)
	})
})

describe('leading zero', () => {
	it('Expect 0 to be "00"', () => {
		expect(toLeadingZero(0)).to.equal('00')
	})
	it('Expect "0" to be "00"', () => {
		expect(toLeadingZero('0')).to.equal('00')
	})
	it('Expect "--" to be "--"', () => {
		expect(toLeadingZero('--')).to.equal('--')
	})
	it('Expect 10 to be "10"', () => {
		expect(toLeadingZero(10)).to.equal('10')
	})
	it('Expect "10" to be "10"', () => {
		expect(toLeadingZero('10')).to.equal('10')
	})
})

describe('Convert 24hr', () => {
	describe('24hr to 12hr', () => {
		it('Expect "" to be "--:-- --"', () => {
			expect(convert.string24hr('').to12hr()).to.equal('--:-- --')
		})
		it('Expect "--:--" to error', () => {
			failTest(
				() => convert.string24hr('--:--').to12hr(),
				'"--:--" is not a valid 24 hour time. Use an empty string instead of "--:--" to represent a blank value',
			)
		})
		it('Expect "00:00" to be "12:00 AM"', () => {
			expect(convert.string24hr('00:00').to12hr()).to.equal('12:00 AM')
		})
		it('Expect "5:30" to error', () => {
			failTest(
				() => convert.string24hr('5:30').to12hr(),
				'"5:30" is not a valid 24 hour time.',
			)
			expect(convert.string24hr('05:30').to12hr()).to.equal('05:30 AM')
		})
		it('Expect "05:30" to be "05:30 AM"', () => {
			expect(convert.string24hr('05:30').to12hr()).to.equal('05:30 AM')
		})
		it('Expect "11:00" to be "11:00 AM"', () => {
			expect(convert.string24hr('11:00').to12hr()).to.equal('11:00 AM')
		})
		it('Expect "12:00" to be "12:00 PM"', () => {
			expect(convert.string24hr('12:00').to12hr()).to.equal('12:00 PM')
		})
		it('Expect "13:00" to be "01:00 PM"', () => {
			expect(convert.string24hr('13:00').to12hr()).to.equal('01:00 PM')
		})
		it('Expect "00:00" to be "12:00 AM"', () => {
			expect(convert.string24hr('00:00').to12hr()).to.equal('12:00 AM')
		})
		it('Expect "24:30" to error', () => {
			failTest(
				() => convert.string24hr('24:30').to12hr(),
				'"24:30" is not a valid 24 hour time. Use "00" instead of "24".',
			)
		})
		it('Expect "25:30" to error', () => {
			failTest(
				() => convert.string24hr('25:30').to12hr(),
				'"25:30" is not a valid 24 hour time.',
			)
		})
	})

	describe('24hr to time object', () => {
		it('Expect "" to be {hrs24: "--", hrs12: "--", min: "--", mode: "--"}', () => {
			expect(convert.string24hr('').toTimeObject()).to.deep.equal({
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: '--',
			})
		})
		it('Expect "00:00" to be {hrs24: 0, hrs12: 12, min: 0, mode: "AM"}', () => {
			expect(convert.string24hr('00:00').toTimeObject()).to.deep.equal({
				hrs24: 0,
				hrs12: 12,
				min: 0,
				mode: 'AM',
			})
		})
		it('Expect "05:30" to be {hrs24: 5, hrs12: 5, min: 30, mode: "AM"}', () => {
			expect(convert.string24hr('05:30').toTimeObject()).to.deep.equal({
				hrs24: 5,
				hrs12: 5,
				min: 30,
				mode: 'AM',
			})
		})
		it('Expect "11:00" to be {hrs24: 11, hrs12: 11, min: 0, mode: "AM"}', () => {
			expect(convert.string24hr('11:00').toTimeObject()).to.deep.equal({
				hrs24: 11,
				hrs12: 11,
				min: 0,
				mode: 'AM',
			})
		})
		it('Expect "12:00" to be {hrs24: 12, hrs12: 12, min: 0, mode: "PM"}', () => {
			expect(convert.string24hr('12:00').toTimeObject()).to.deep.equal({
				hrs24: 12,
				hrs12: 12,
				min: 0,
				mode: 'PM',
			})
		})
		it('Expect "13:00" to be {hrs24: 13, hrs12: 1, min: 0, mode: "PM"}', () => {
			expect(convert.string24hr('13:00').toTimeObject()).to.deep.equal({
				hrs24: 13,
				hrs12: 1,
				min: 0,
				mode: 'PM',
			})
		})
		it('Expect "00:00" to be {hrs24: 0, hrs12: 12, min: 0, mode: "AM"}', () => {
			expect(convert.string24hr('00:00').toTimeObject()).to.deep.equal({
				hrs24: 0,
				hrs12: 12,
				min: 0,
				mode: 'AM',
			})
		})
		it('Expect "24:30" to error', () => {
			failTest(
				() => convert.string24hr('24:30').toTimeObject(),
				'"24:30" is not a valid 24 hour time. Use "00" instead of "24".',
			)
		})
		it('Expect "25:30" to error', () => {
			failTest(
				() => convert.string24hr('25:30').toTimeObject(),
				'"25:30" is not a valid 24 hour time.',
			)
		})
	})
})

describe('Convert 12hr', () => {
	describe('12hr to 24hr', () => {
		it('Expect "--:--" to fail', () => {
			failTest(
				() => convert.string12hr('--:--').to24hr(),
				'"--:--" is not a valid 12 hour time, use the format "HH:MM AM/PM"',
			)
		})
		it('Expect "--:-- --" to be ""', () => {
			expect(convert.string12hr('--:-- --').to24hr()).to.equal('')
		})
		it('Expect "01:-- --" to be ""', () => {
			expect(convert.string12hr('01:-- --').to24hr()).to.equal('')
		})
		it('Expect "--:02 --" to be ""', () => {
			expect(convert.string12hr('--:02 --').to24hr()).to.equal('')
		})
		it('Expect "--:-- AM" to be ""', () => {
			expect(convert.string12hr('--:-- AM').to24hr()).to.equal('')
		})
		it('Expect "12:00 AM" to be "00:00"', () => {
			expect(convert.string12hr('12:00 AM').to24hr()).to.equal('00:00')
		})
		it('Expect "05:30 AM" to be "05:30"', () => {
			expect(convert.string12hr('05:30 AM').to24hr()).to.equal('05:30')
		})
		it('Expect "11:00 AM" to be "11:00"', () => {
			expect(convert.string12hr('11:00 AM').to24hr()).to.equal('11:00')
		})
		it('Expect "12:00 PM" to be "12:00"', () => {
			expect(convert.string12hr('12:00 PM').to24hr()).to.equal('12:00')
		})
		it('Expect "01:00 PM" to be "13:00"', () => {
			expect(convert.string12hr('01:00 PM').to24hr()).to.equal('13:00')
		})
		it('Expect "11:30 PM" to be "23:30"', () => {
			expect(convert.string12hr('11:30 PM').to24hr()).to.equal('23:30')
		})
		it('Expect "13:30" to fail', () => {
			failTest(
				() => convert.string12hr('13:30').to12hr(),
				'"13:30" is not a valid 12 hour time, use the format "HH:MM AM/PM"',
			)
		})
		it('Expect "13:30 PM" to fail', () => {
			failTest(
				() => convert.string12hr('13:30 PM').to24hr(),
				'"13:30 PM" is not a valid 12 hour time, use the format "HH:MM AM/PM"',
			)
		})
	})

	describe('12hr to time object', () => {
		it('Expect "--:--" to fail', () => {
			failTest(
				() => convert.string12hr('--:--').toTimeObject(),
				'"--:--" is not a valid 12 hour time, use the format "HH:MM AM/PM"',
			)
		})
		it('Expect "--:-- --" to be {hrs24: "--", hrs12: "--", min: "--", mode: "--"}', () => {
			expect(convert.string12hr('--:-- --').toTimeObject()).to.deep.equal({
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: '--',
			})
		})
		it('Expect "01:-- --" to be {hrs24: 1, hrs12: 1, min: "--", mode: "--"}', () => {
			expect(convert.string12hr('01:-- --').toTimeObject()).to.deep.equal({
				hrs24: 1,
				hrs12: 1,
				min: '--',
				mode: '--',
			})
		})
		it('Expect "--:02 --" to be {hrs24: "--", hrs12: "--", min: 2, mode: "--"}', () => {
			expect(convert.string12hr('--:02 --').toTimeObject()).to.deep.equal({
				hrs24: '--',
				hrs12: '--',
				min: 2,
				mode: '--',
			})
		})
		it('Expect "--:-- AM" to be {hrs24: "--", hrs12: "--", min: "--", mode: "AM"}', () => {
			expect(convert.string12hr('--:-- AM').toTimeObject()).to.deep.equal({
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: 'AM',
			})
		})
		it('Expect "12:00 AM" to be {hrs24: 0, hrs12: 12, min: 0, mode: "AM"}', () => {
			expect(convert.string12hr('12:00 AM').toTimeObject()).to.deep.equal({
				hrs24: 0,
				hrs12: 12,
				min: 0,
				mode: 'AM',
			})
		})
		it('Expect "05:30 AM" to be {hrs24: 5, hrs12: 5, min: 30, mode: "AM"}', () => {
			expect(convert.string12hr('05:30 AM').toTimeObject()).to.deep.equal({
				hrs24: 5,
				hrs12: 5,
				min: 30,
				mode: 'AM',
			})
		})
		it('Expect "11:00 AM" to be {hrs24: 11, hrs12: 11, min: 0, mode: "AM"}', () => {
			expect(convert.string12hr('11:00 AM').toTimeObject()).to.deep.equal({
				hrs24: 11,
				hrs12: 11,
				min: 0,
				mode: 'AM',
			})
		})
		it('Expect "12:00 PM" to be {hrs24: 12, hrs12: 12, min: 0, mode: "PM"}', () => {
			expect(convert.string12hr('12:00 PM').toTimeObject()).to.deep.equal({
				hrs24: 12,
				hrs12: 12,
				min: 0,
				mode: 'PM',
			})
		})
		it('Expect "01:00 PM" to be {hrs24: 13, hrs12: 1, min: 0, mode: "PM"}', () => {
			expect(convert.string12hr('01:00 PM').toTimeObject()).to.deep.equal({
				hrs24: 13,
				hrs12: 1,
				min: 0,
				mode: 'PM',
			})
		})
		it('Expect "11:30 PM" to be {hrs24: 23, hrs12: 11, min: 30, mode: "PM"}', () => {
			expect(convert.string12hr('11:30 PM').toTimeObject()).to.deep.equal({
				hrs24: 23,
				hrs12: 11,
				min: 30,
				mode: 'PM',
			})
		})
		it('Expect "13:30" to fail', () => {
			failTest(
				() => convert.string12hr('13:30').toTimeObject(),
				'"13:30" is not a valid 12 hour time, use the format "HH:MM AM/PM"',
			)
		})
		it('Expect "13:30 PM" to fail', () => {
			failTest(
				() => convert.string12hr('13:30 PM').toTimeObject(),
				'"13:30 PM" is not a valid 12 hour time, use the format "HH:MM AM/PM"',
			)
		})
	})
})

describe('convert time object', () => {
	describe('time object validation', () => {
		const invalidMessage = extra => {
			const formattedExtra = typeof extra === 'string' ? `"${extra}"` : JSON.stringify(extra)
			return `${formattedExtra} is not a valid time object. Must be in the format {hrs24: 0, hrs12: 12, min:0, mode: 'AM'} (12:00 AM)`
		}
		it('"12:00 AM" => fail', () => {
			failTest(() => convert.timeObject('12:00 AM').to12hr(), invalidMessage('12:00 AM'))
		})
		it('"00:00" => fail', () => {
			failTest(() => convert.timeObject('00:00').to12hr(), invalidMessage('00:00'))
		})
		it('{} => fail', () => {
			failTest(() => convert.timeObject({}).to12hr(), invalidMessage({}))
		})
		it('{hrs24: 0} => fail', () => {
			failTest(() => convert.timeObject({ hrs24: 0 }).to12hr(), invalidMessage({ hrs24: 0 }))
		})
		it('{hrs24: 0, hrs12: 12} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs24: 0, hrs12: 12 }).to12hr(),
				invalidMessage({ hrs24: 0, hrs12: 12 }),
			)
		})
		it('{hrs24: 0, hrs12: 12, min: 0} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs24: 0, hrs12: 12, min: 0 }).to12hr(),
				invalidMessage({ hrs24: 0, hrs12: 12, min: 0 }),
			)
		})
		it('{hrs: 12, min: 0, mode: AM} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs: 12, min: 0, mode: 'AM' }).to12hr(),
				invalidMessage({ hrs: 12, min: 0, mode: 'AM' }),
			)
		})
		it('{hrs: 12, hrs24: 0, hrs12: 12, min: 0, mode: AM} => fail', () => {
			failTest(
				() =>
					convert
						.timeObject({ hrs: 12, hrs24: 0, hrs12: 12, min: 0, mode: 'AM' })
						.to12hr(),
				invalidMessage({ hrs: 12, hrs24: 0, hrs12: 12, min: 0, mode: 'AM' }),
			)
		})
		it('{hrs24: 24, hrs12: 12, min: 0, mode: AM} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs24: 24, hrs12: 12, min: 0, mode: 'AM' }).to12hr(),
				'hrs24 (24) cannot be higher than 23, use 0 instead for 24',
			)
		})
		it('{hrs24: 0, hrs12: 13, min: 0, mode: AM} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs24: 0, hrs12: 13, min: 0, mode: 'AM' }).to12hr(),
				'hrs12 (13) cannot be higher than 12',
			)
		})
		it('{hrs24: 2, hrs12: 3, min: 0, mode: AM} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs24: 2, hrs12: 3, min: 0, mode: 'AM' }).to12hr(),
				'hrs12 (3) and hrs24 (2) do not appear to match each other',
			)
		})
		it('{hrs24: 2, hrs12: 2, min: 0, mode: PM} => fail', () => {
			failTest(
				() => convert.timeObject({ hrs24: 2, hrs12: 2, min: 0, mode: 'PM' }).to12hr(),
				'Mode (PM) does not match up with hrs24 (2)',
			)
		})
	})

	const timeTest = method => {
		return (timeObject, result) => {
			const objectString = JSON.stringify(timeObject)
			it(`Expect ${objectString} to be "${result}"`, () => {
				expect(convert.timeObject(timeObject)[method]()).to.deep.equal(result)
			})
		}
	}

	describe('time object to 24hr', () => {
		const timeTest24hr = timeTest('to24hr')
		timeTest24hr(
			{
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: '--',
			},
			'',
		)

		timeTest24hr(
			{
				hrs24: 1,
				hrs12: 1,
				min: '--',
				mode: '--',
			},
			'',
		)

		timeTest24hr(
			{
				hrs24: '--',
				hrs12: '--',
				min: 2,
				mode: '--',
			},
			'',
		)

		timeTest24hr(
			{
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: 'AM',
			},
			'',
		)

		timeTest24hr(
			{
				hrs24: 0,
				hrs12: 12,
				min: 0,
				mode: 'AM',
			},
			'00:00',
		)

		timeTest24hr(
			{
				hrs24: 5,
				hrs12: 5,
				min: 30,
				mode: 'AM',
			},
			'05:30',
		)

		timeTest24hr(
			{
				hrs24: 11,
				hrs12: 11,
				min: 0,
				mode: 'AM',
			},
			'11:00',
		)

		timeTest24hr(
			{
				hrs24: 12,
				hrs12: 12,
				min: 0,
				mode: 'PM',
			},
			'12:00',
		)

		timeTest24hr(
			{
				hrs24: 13,
				hrs12: 1,
				min: 0,
				mode: 'PM',
			},
			'13:00',
		)

		timeTest24hr(
			{
				hrs24: 23,
				hrs12: 11,
				min: 30,
				mode: 'PM',
			},
			'23:30',
		)
	})

	describe('time object to 12hr', () => {
		const timeTest12hr = timeTest('to12hr')
		timeTest12hr(
			{
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: '--',
			},
			'--:-- --',
		)

		timeTest12hr(
			{
				hrs24: 1,
				hrs12: 1,
				min: '--',
				mode: '--',
			},
			'01:-- --',
		)

		timeTest12hr(
			{
				hrs24: '--',
				hrs12: '--',
				min: 2,
				mode: '--',
			},
			'--:02 --',
		)

		timeTest12hr(
			{
				hrs24: '--',
				hrs12: '--',
				min: '--',
				mode: 'AM',
			},
			'--:-- AM',
		)

		timeTest12hr(
			{
				hrs24: 0,
				hrs12: 12,
				min: 0,
				mode: 'AM',
			},
			'12:00 AM',
		)

		timeTest12hr(
			{
				hrs24: 5,
				hrs12: 5,
				min: 30,
				mode: 'AM',
			},
			'05:30 AM',
		)

		timeTest12hr(
			{
				hrs24: 11,
				hrs12: 11,
				min: 0,
				mode: 'AM',
			},
			'11:00 AM',
		)

		timeTest12hr(
			{
				hrs24: 12,
				hrs12: 12,
				min: 0,
				mode: 'PM',
			},
			'12:00 PM',
		)

		timeTest12hr(
			{
				hrs24: 13,
				hrs12: 1,
				min: 0,
				mode: 'PM',
			},
			'01:00 PM',
		)

		timeTest12hr(
			{
				hrs24: 23,
				hrs12: 11,
				min: 30,
				mode: 'PM',
			},
			'11:30 PM',
		)
	})
})
