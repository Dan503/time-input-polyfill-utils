import { PartialTimeObject, TimeObject } from '../../types/index'
import { ManualEntryLog } from './ManualEntryLog'

const startingFullValue = '12:30 AM'

interface CreateEntryLogProps {
	customStartTime?: PartialTimeObject
	onLimitHit?: (entryLog: ManualEntryLog) => void
	onUpdate?: (entryLog: ManualEntryLog, wasLimitHit: boolean) => void
}

/** Default start time: `12:30 AM` */
const createEntryLog = ({
	customStartTime,
	onLimitHit: onMaxHit,
	onUpdate,
}: CreateEntryLogProps = {}): ManualEntryLog => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const startTime = <TimeObject>{
		hrs12: 12,
		hrs24: 0,
		minutes: 30,
		mode: 'AM',
		...customStartTime,
	}
	return new ManualEntryLog({ timeObject: startTime, onLimitHit: onMaxHit, onUpdate })
}

Initialize()

Add_1()
Add_1_2()
Add_1_2_3()
Add_1_2_3_4()

Add_0()
Add_0_1()
Add_0_1_0()
Add_0_0()
Add_0_0_0()
Add_1_0()

Add_then_reset()
Add_then_clear()

Add_P()

greater_than_max_tests()

Other_cases()

function Initialize(): void {
	describe('Initialize', () => {
		it(`hrs12: ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			expect(entryLog.hrs12.entries).to.deep.equal([])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
		it(`minutes: ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			expect(entryLog.minutes.entries).to.deep.equal([])
			expect(entryLog.minutes.value).to.equal(30)
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
		it(`mode: ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			expect(entryLog.mode.value).to.equal('AM')
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_1(): void {
	describe('Add "1"', () => {
		it(`hrs12: ${startingFullValue} > 01:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('1')
			expect(entryLog.hrs12.entries).to.deep.equal([1])
			expect(entryLog.hrs12.value).to.equal(1)
			expect(entryLog.fullValue12hr).to.equal('01:30 AM')
		})
		it(`minutes: ${startingFullValue} > 12:01 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('1')
			expect(entryLog.minutes.entries).to.deep.equal([1])
			expect(entryLog.minutes.value).to.equal(1)
			expect(entryLog.fullValue12hr).to.equal('12:01 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('1')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_1_2(): void {
	describe('Add "1" > add "2"', () => {
		it('hrs12: 03:30 AM > 12:30 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { hrs12: 3, hrs24: 3 } })
			entryLog.hrs12.add('1')
			entryLog.hrs12.add('2')
			expect(entryLog.hrs12.entries).to.deep.equal([1, 2])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
		it(`minutes: ${startingFullValue} > 12:12 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('1')
			entryLog.minutes.add('2')
			expect(entryLog.minutes.entries).to.deep.equal([1, 2])
			expect(entryLog.minutes.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal('12:12 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('1')
			entryLog.mode.add('2')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_1_2_3(): void {
	describe('Add "1" > add "2" > add "3"', () => {
		it(`hrs12: ${startingFullValue} > 03:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('1')
			entryLog.hrs12.add('2')
			entryLog.hrs12.add('3')
			expect(entryLog.hrs12.entries).to.deep.equal([3])
			expect(entryLog.hrs12.value).to.equal(3)
			expect(entryLog.fullValue12hr).to.equal('03:30 AM')
		})
		it(`minutes: ${startingFullValue} > 12:03 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('1')
			entryLog.minutes.add('2')
			entryLog.minutes.add('3')
			expect(entryLog.minutes.entries).to.deep.equal([3])
			expect(entryLog.minutes.value).to.equal(3)
			expect(entryLog.fullValue12hr).to.equal('12:03 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('1')
			entryLog.mode.add('2')
			entryLog.mode.add('3')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_1_2_3_4(): void {
	describe('Add "1" > add "2" > add "3" > add "4"', () => {
		it(`hrs12: ${startingFullValue} > 04:30 AM`, () => {
			let fullVal
			let hitLimit = false
			let wasUpdateLimitHit = false
			const entryLog = createEntryLog({
				onUpdate({ fullValue12hr }, wasLimitHit) {
					fullVal = fullValue12hr
					wasUpdateLimitHit = wasLimitHit
				},
				onLimitHit() {
					hitLimit = true
				},
			})
			entryLog.hrs12.add('1')
			expect(fullVal).to.equal('01:30 AM')
			expect(hitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			entryLog.hrs12.add('2')
			expect(fullVal).to.equal('12:30 AM')
			expect(hitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			hitLimit = false
			entryLog.hrs12.add('3')
			expect(fullVal).to.equal('03:30 AM')
			expect(hitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			hitLimit = false
			entryLog.hrs12.add('4')
			expect(fullVal).to.equal('04:30 AM')
			expect(hitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			expect(entryLog.hrs12.entries).to.deep.equal([4])
			expect(entryLog.hrs12.value).to.equal(4)
			expect(entryLog.fullValue12hr).to.equal('04:30 AM')
		})
		it(`minutes: ${startingFullValue} > 12:34 AM`, () => {
			let fullVal
			let hitLimit = false
			let wasUpdateLimitHit = false

			const entryLog = createEntryLog({
				onUpdate({ fullValue12hr }, wasLimitHit) {
					fullVal = fullValue12hr
					wasUpdateLimitHit = wasLimitHit
				},
				onLimitHit() {
					hitLimit = true
				},
			})
			entryLog.minutes.add('1')
			expect(fullVal).to.equal('12:01 AM')
			expect(hitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			hitLimit = false
			wasUpdateLimitHit = false
			entryLog.minutes.add('2')
			expect(fullVal).to.equal('12:12 AM')
			expect(hitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			hitLimit = false
			wasUpdateLimitHit = false
			entryLog.minutes.add('3')
			expect(fullVal).to.equal('12:03 AM')
			expect(hitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			hitLimit = false
			wasUpdateLimitHit = false
			entryLog.minutes.add('4')
			expect(fullVal).to.equal('12:34 AM')
			expect(hitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			expect(entryLog.minutes.entries).to.deep.equal([3, 4])
			expect(entryLog.minutes.value).to.equal(34)
			expect(entryLog.fullValue12hr).to.equal('12:34 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('1')
			entryLog.mode.add('2')
			entryLog.mode.add('3')
			entryLog.mode.add('4')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_0(): void {
	describe('Add "0"', () => {
		it(`hrs12: 08:30 PM > 12:30 PM`, () => {
			const entryLog = createEntryLog({
				customStartTime: { hrs12: 8, hrs24: 20, mode: 'PM' },
			})
			entryLog.hrs12.add('0')
			expect(entryLog.hrs12.entries).to.deep.equal([0])
			expect(entryLog.hrs12.value).to.equal(12) // entering "0" once causes hours to set itself to 12
			expect(entryLog.fullValue12hr).to.equal('12:30 PM')
		})
		it(`hrs12: ${startingFullValue} > 12:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('0')
			expect(entryLog.hrs12.entries).to.deep.equal([0])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it('minutes: 12:35 AM > 12:00 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { minutes: 35 } })
			entryLog.minutes.add('0')
			expect(entryLog.minutes.entries).to.deep.equal([0])
			expect(entryLog.minutes.value).to.equal(0)
			expect(entryLog.fullValue12hr).to.equal('12:00 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('0')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_0_1(): void {
	describe('Add "0" > add "1"', () => {
		it(`hrs12: ${startingFullValue} > 01:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('0')
			entryLog.hrs12.add('1')
			expect(entryLog.hrs12.entries).to.deep.equal([0, 1])
			expect(entryLog.hrs12.value).to.equal(1) // entering a number after "0" sets it to "0_"
			expect(entryLog.fullValue12hr).to.equal('01:30 AM')
		})
		it(`minutes: ${startingFullValue} > 12:01 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('0')
			entryLog.minutes.add('1')
			expect(entryLog.minutes.entries).to.deep.equal([0, 1])
			expect(entryLog.minutes.value).to.equal(1)
			expect(entryLog.fullValue12hr).to.equal('12:01 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('0')
			entryLog.mode.add('1')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_0_1_0(): void {
	describe('Add "0" > add "1" > add "0"', () => {
		it(`hrs12: ${startingFullValue} > 12:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('0')
			entryLog.hrs12.add('1') // becomes 1am here
			entryLog.hrs12.add('0')
			expect(entryLog.hrs12.entries).to.deep.equal([0])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it('minutes: 12:35 AM > 12:00 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { minutes: 35 } })
			entryLog.minutes.add('0')
			entryLog.minutes.add('1')
			entryLog.minutes.add('0')
			expect(entryLog.minutes.entries).to.deep.equal([0])
			expect(entryLog.minutes.value).to.equal(0)
			expect(entryLog.fullValue12hr).to.equal('12:00 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('0')
			entryLog.mode.add('1')
			entryLog.mode.add('0')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_0_0(): void {
	describe('Add "0" > add "0"', () => {
		it(`hrs12: 08:30 AM > 12:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('0')
			entryLog.hrs12.add('0')
			expect(entryLog.hrs12.entries).to.deep.equal([0, 0])
			expect(entryLog.hrs12.value).to.equal(12) // 2 zeros in a row sets the value to 12
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it('hrs12: 11:30 AM > 12:30 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { hrs12: 11, hrs24: 11 } })
			entryLog.hrs12.add('0')
			entryLog.hrs12.add('0')
			// Entering "00" in the hours segment should return "12"
			expect(entryLog.hrs12.entries).to.deep.equal([0, 0])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it('minutes: 12:35 AM > 12:00 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { minutes: 35 } })
			entryLog.minutes.add('0')
			entryLog.minutes.add('0')
			expect(entryLog.minutes.entries).to.deep.equal([0, 0])
			expect(entryLog.minutes.value).to.equal(0)
			expect(entryLog.fullValue12hr).to.equal('12:00 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('0')
			entryLog.mode.add('0')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_0_0_0(): void {
	describe('Add "0" > add "0" > add "0"', () => {
		it('hrs12: 11:30 AM > 02:30 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { hrs12: 11, hrs24: 11 } })
			entryLog.hrs12.add('0')
			entryLog.hrs12.add('0') // becomes 12am here
			entryLog.hrs12.add('0')
			expect(entryLog.hrs12.entries).to.deep.equal([0])
			expect(entryLog.hrs12.value).to.equal(12) // adding a 3rd zero is the same as adding 1 zero
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it('minutes: 12:35 AM > 12:00 AM', () => {
			const entryLog = createEntryLog({ customStartTime: { minutes: 35 } })
			entryLog.minutes.add('0')
			entryLog.minutes.add('0')
			entryLog.minutes.add('0')
			expect(entryLog.minutes.entries).to.deep.equal([0])
			expect(entryLog.minutes.value).to.equal(0)
			expect(entryLog.fullValue12hr).to.equal('12:00 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('0')
			entryLog.mode.add('0')
			entryLog.mode.add('0')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_1_0(): void {
	describe('Add "1" > add "0"', () => {
		it(`hrs12: ${startingFullValue} > 10:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('1')
			entryLog.hrs12.add('0')
			expect(entryLog.hrs12.entries).to.deep.equal([1, 0])
			expect(entryLog.hrs12.value).to.equal(10)
			expect(entryLog.fullValue12hr).to.equal('10:30 AM')
		})
		it(`minutes: ${startingFullValue} > 12:10 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('1')
			entryLog.minutes.add('0')
			expect(entryLog.minutes.entries).to.deep.equal([1, 0])
			expect(entryLog.minutes.value).to.equal(10)
			expect(entryLog.fullValue12hr).to.equal('12:10 AM')
		})
		it(`mode: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('1')
			entryLog.mode.add('0')
			expect(entryLog.mode.value).to.equal('AM') // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
	})
}

function Add_then_reset(): void {
	// reset is needed for things like typing "1" then leaving then coming back
	// The tracker should reset if they are returning
	describe('Add "1"/"p" > then reset', () => {
		it(`hrs12 add "1" > reset: ${startingFullValue} > 01:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('1')
			entryLog.hrs12.reset()
			// I don't want to lose the value, just reset the entries array
			expect(entryLog.hrs12.entries).to.deep.equal([])
			expect(entryLog.hrs12.value).to.equal(1)
			expect(entryLog.fullValue12hr).to.equal('01:30 AM')
		})
		it(`minutes add "1" > reset: ${startingFullValue} > 12:01 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('1')
			entryLog.minutes.reset()
			expect(entryLog.minutes.entries).to.deep.equal([])
			expect(entryLog.minutes.value).to.equal(1)
			expect(entryLog.fullValue12hr).to.equal('12:01 AM')
		})
		it(`mode add "p" > reset: ${startingFullValue} > 12:30 PM`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('p')
			entryLog.mode.reset() // reset doesn't really do anything for mode it's just there to prevent errors
			expect(entryLog.mode.value).to.equal('PM')
			expect(entryLog.fullValue12hr).to.equal('12:30 PM')
		})
	})
}

function Add_then_clear(): void {
	describe('Add "1"/"p" > then clear', () => {
		it(`hrs12 add "1" > clear: ${startingFullValue} > --:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('1')
			entryLog.hrs12.clear()
			expect(entryLog.hrs12.entries).to.deep.equal([])
			expect(entryLog.hrs12.value).to.equal(null)
			expect(entryLog.fullValue12hr).to.equal('--:30 AM')
		})
		it(`minutes add "1" > clear: ${startingFullValue} > 12:-- AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('1')
			entryLog.minutes.clear()
			expect(entryLog.minutes.entries).to.deep.equal([])
			expect(entryLog.minutes.value).to.equal(null)
			expect(entryLog.fullValue12hr).to.equal('12:-- AM')
		})
		it(`mode add "p" > clear: ${startingFullValue} > 12:30 --`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('p')
			entryLog.mode.clear()
			expect(entryLog.mode.entries).to.deep.equal([])
			expect(entryLog.mode.value).to.equal(null)
			expect(entryLog.fullValue12hr).to.equal('12:30 --')
		})
	})
}

function Add_P(): void {
	describe('Add "p"', () => {
		it(`hrs12: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('p')
			expect(entryLog.hrs12.entries).to.deep.equal([])
			expect(entryLog.hrs12.value).to.equal(12) // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
		it(`minutes: ${startingFullValue} > ${startingFullValue}`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('p')
			expect(entryLog.minutes.entries).to.deep.equal([])
			expect(entryLog.minutes.value).to.equal(30) // expect no change
			expect(entryLog.fullValue12hr).to.equal(startingFullValue)
		})
		it(`mode: ${startingFullValue} > 12:30 PM`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('p')
			expect(entryLog.mode.value).to.equal('PM')
			expect(entryLog.fullValue12hr).to.equal('12:30 PM')
		})
	})
}

function greater_than_max_tests(): void {
	describe('Greater than max tests', () => {
		it(`Add "7" > "0" to hrs: ${startingFullValue} > 12:30 AM`, () => {
			let hasHitLimit = false
			let wasUpdateLimitHit = false
			const entryLog = createEntryLog({
				onUpdate(_entryLog, wasLimitHit) {
					wasUpdateLimitHit = wasLimitHit
				},
				onLimitHit() {
					hasHitLimit = true
				},
			})
			entryLog.hrs12.add('7')
			expect(hasHitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			hasHitLimit = false
			wasUpdateLimitHit = false
			entryLog.hrs12.add('0')
			expect(hasHitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			expect(entryLog.hrs12.entries).to.deep.equal([0])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it(`Add "7" > "0" to minutes: ${startingFullValue} > 12:07 AM`, () => {
			let hasHitLimit = false
			let wasUpdateLimitHit = false
			const entryLog = createEntryLog({
				onUpdate(_entryLog, wasLimitHit) {
					wasUpdateLimitHit = wasLimitHit
				},
				onLimitHit() {
					hasHitLimit = true
				},
			})
			entryLog.minutes.add('7')
			expect(hasHitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			hasHitLimit = false
			wasUpdateLimitHit = false
			entryLog.minutes.add('0')
			expect(hasHitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			expect(entryLog.minutes.entries).to.deep.equal([0])
			expect(entryLog.minutes.value).to.equal(0)
			expect(entryLog.fullValue12hr).to.equal('12:00 AM')
		})
		it(`Add "7" > "0" > "6" to hrs: ${startingFullValue} > 06:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('7')
			entryLog.hrs12.add('0')
			entryLog.hrs12.add('6')
			expect(entryLog.hrs12.entries).to.deep.equal([0, 6])
			expect(entryLog.hrs12.value).to.equal(6)
			expect(entryLog.fullValue12hr).to.equal('06:30 AM')
		})
		it(`Add "7" > "0" > "6" to minutes: ${startingFullValue} > 12:06 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('7')
			entryLog.minutes.add('0')
			entryLog.minutes.add('6')
			expect(entryLog.minutes.entries).to.deep.equal([0, 6])
			expect(entryLog.minutes.value).to.equal(6)
			expect(entryLog.fullValue12hr).to.equal('12:06 AM')
		})
		it(`Add "2" > "1" > "2" to hrs: ${startingFullValue} > 12:30 AM`, () => {
			let hasHitLimit = false
			let wasUpdateLimitHit = false
			let val
			const entryLog = createEntryLog({
				onUpdate(_entryLog, wasLimitHit) {
					wasUpdateLimitHit = wasLimitHit
				},
				onLimitHit({ hrs12 }) {
					hasHitLimit = true
					val = hrs12.value
				},
			})
			entryLog.hrs12.add('2')
			expect(hasHitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			expect(val).to.equal(2)
			hasHitLimit = false
			wasUpdateLimitHit = false
			entryLog.hrs12.add('1')
			expect(hasHitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			hasHitLimit = false
			wasUpdateLimitHit = false
			entryLog.hrs12.add('2')
			expect(hasHitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			expect(entryLog.hrs12.entries).to.deep.equal([1, 2])
			expect(entryLog.hrs12.value).to.equal(12)
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
		})
		it(`Add "6" > "5" > "6" to minutes: ${startingFullValue} > 12:56 AM`, () => {
			let hasHitLimit = false
			let wasUpdateLimitHit = false
			let val
			const entryLog = createEntryLog({
				onUpdate(_entryLog, wasLimitHit) {
					wasUpdateLimitHit = wasLimitHit
				},
				onLimitHit({ minutes }) {
					hasHitLimit = true
					val = minutes.value
				},
			})
			entryLog.minutes.add('6')
			expect(hasHitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			expect(val).to.equal(6)
			hasHitLimit = false
			wasUpdateLimitHit = false
			entryLog.minutes.add('5')
			expect(hasHitLimit).to.equal(false)
			expect(wasUpdateLimitHit).to.equal(false)
			hasHitLimit = false
			wasUpdateLimitHit = false
			entryLog.minutes.add('6')
			expect(hasHitLimit).to.equal(true)
			expect(wasUpdateLimitHit).to.equal(true)
			expect(entryLog.minutes.entries).to.deep.equal([5, 6])
			expect(entryLog.minutes.value).to.equal(56)
			expect(entryLog.fullValue12hr).to.equal('12:56 AM')
		})
	})
}

function Other_cases(): void {
	describe('Other cases', () => {
		it(`Add "2" to hrs: ${startingFullValue} > 02:30 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.hrs12.add('2')
			expect(entryLog.hrs12.entries).to.deep.equal([2])
			expect(entryLog.hrs12.value).to.equal(2)
			expect(entryLog.fullValue12hr).to.equal('02:30 AM')
		})
		it(`Add "5" to minutes: ${startingFullValue} > 12:05 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('5')
			expect(entryLog.minutes.entries).to.deep.equal([5])
			expect(entryLog.minutes.value).to.equal(5)
			expect(entryLog.fullValue12hr).to.equal('12:05 AM')
		})
		it(`Add "5" > "5" to minutes: ${startingFullValue} > 12:55 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('5')
			entryLog.minutes.add('5')
			expect(entryLog.minutes.entries).to.deep.equal([5, 5])
			expect(entryLog.minutes.value).to.equal(55)
			expect(entryLog.fullValue12hr).to.equal('12:55 AM')
		})
		it(`Add "5" > "0" to minutes: ${startingFullValue} > 12:50 AM`, () => {
			const entryLog = createEntryLog()
			entryLog.minutes.add('5')
			entryLog.minutes.add('0')
			expect(entryLog.minutes.entries).to.deep.equal([5, 0])
			expect(entryLog.minutes.value).to.equal(50)
			expect(entryLog.fullValue12hr).to.equal('12:50 AM')
		})
		it(`Add "p" to mode > add "m" to mode: ${startingFullValue} > 12:30 PM`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('p')
			entryLog.mode.add('m')
			expect(entryLog.mode.value).to.equal('PM')
			expect(entryLog.fullValue12hr).to.equal('12:30 PM')
		})
		it(`Add "p" > "a" > "p" to mode:\n12:30 AM > 12:30 PM > 12:30 AM > 12:30 PM`, () => {
			const entryLog = createEntryLog()
			entryLog.mode.add('p')
			expect(entryLog.mode.value).to.equal('PM')
			expect(entryLog.fullValue12hr).to.equal('12:30 PM')
			entryLog.mode.add('a')
			expect(entryLog.mode.value).to.equal('AM')
			expect(entryLog.fullValue12hr).to.equal('12:30 AM')
			entryLog.mode.add('p')
			expect(entryLog.mode.value).to.equal('PM')
			expect(entryLog.fullValue12hr).to.equal('12:30 PM')
		})
	})
}
