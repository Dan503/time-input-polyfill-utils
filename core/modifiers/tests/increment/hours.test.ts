import { String12hr, String24hr, TimeObject } from '../../../../types'
import { modifierTest, deepModifierTest, current } from '../../modifiers.test'

interface BeforeAfterString {
	before: String12hr | String24hr
	after: String12hr | String24hr
}

interface BeforeAfterObject {
	before: TimeObject
	after: TimeObject
}

interface CommonSettingsString {
	format: 'string24hr' | 'string12hr'
	action: 'increment' // | 'decrement'
	target: 'hours' // | 'minutes' | 'mode'
}

interface CommonSettingsObject {
	format: 'timeObject'
	action: 'increment' // | 'decrement'
	target: 'hours' // | 'minutes' | 'mode'
}

export default () => {
	describe('Increment hours', () => {
		//////////////////////////////////////////

		describe('12 hour time', () => {
			const settings: CommonSettingsString = {
				format: 'string12hr',
				action: 'increment',
				target: 'hours',
			}

			describe('Ignoring mode (12hr)', () => {
				const increment12hrIsolated = ({ before, after }: BeforeAfterString) => {
					modifierTest({
						...settings,
						before,
						after,
						integration: 'isolated',
					})
				}
				increment12hrIsolated({ before: '--:-- --', after: `${current.hrs12}:-- --` })
				increment12hrIsolated({ before: '--:00 AM', after: `${current.hrs12}:00 AM` })
				increment12hrIsolated({ before: '09:00 AM', after: '10:00 AM' })
				increment12hrIsolated({ before: '12:30 PM', after: '01:30 PM' })
				// incrementing hours does not affect AM/PM
				increment12hrIsolated({ before: '11:30 AM', after: '12:30 AM' })
				increment12hrIsolated({ before: '11:00 PM', after: '12:00 PM' })
			})

			describe('Affecting mode (12hr)', () => {
				const increment12hrIntegrated = ({ before, after }: BeforeAfterString) => {
					modifierTest({
						...settings,
						before,
						after,
						integration: 'integrated',
					})
				}
				increment12hrIntegrated({ before: '--:-- --', after: `${current.hrs12}:-- --` })
				increment12hrIntegrated({ before: '--:00 AM', after: `${current.hrs12}:00 AM` })
				increment12hrIntegrated({ before: '09:00 AM', after: '10:00 AM' })
				increment12hrIntegrated({ before: '12:30 PM', after: '01:30 PM' })
				// incrementing hours DOES affect AM/PM
				increment12hrIntegrated({ before: '11:30 AM', after: '12:30 PM' })
				increment12hrIntegrated({ before: '11:00 PM', after: '12:00 AM' })
			})
		})

		describe('24 hour time', () => {
			const settings: CommonSettingsString = {
				format: 'string24hr',
				action: 'increment',
				target: 'hours',
			}
			describe('Ignoring mode (24hr)', () => {
				const increment24hrIsolated = ({ before, after }: BeforeAfterString) => {
					modifierTest({
						...settings,
						before,
						after,
						integration: 'isolated',
					})
				}
				increment24hrIsolated({ before: '09:00', after: '10:00' })
				increment24hrIsolated({ before: '11:30', after: '00:30' })
				increment24hrIsolated({ before: '12:30', after: '13:30' })
				increment24hrIsolated({ before: '23:00', after: '12:00' })
			})

			describe('Affecting mode (24hr)', () => {
				const increment24hrIntegrated = ({ before, after }: BeforeAfterString) => {
					modifierTest({
						...settings,
						before,
						after,
						integration: 'integrated',
					})
				}
				increment24hrIntegrated({ before: '09:00', after: '10:00' })
				increment24hrIntegrated({ before: '11:30', after: '12:30' })
				increment24hrIntegrated({ before: '12:30', after: '13:30' })
				increment24hrIntegrated({ before: '23:00', after: '00:00' })
			})
		})

		describe('Time object', () => {
			const settings: CommonSettingsObject = {
				format: 'timeObject',
				action: 'increment',
				target: 'hours',
			}
			describe('Ignoring mode (timeObject)', () => {
				const incrementObjectIsolated = ({ before, after }: BeforeAfterObject) => {
					deepModifierTest({
						...settings,
						before,
						after,
						integration: 'isolated',
					})
				}

				incrementObjectIsolated({
					before: {
						hrs24: 9,
						hrs12: 9,
						min: 0,
						mode: 'AM',
					},
					after: {
						hrs24: 10,
						hrs12: 10,
						min: 0,
						mode: 'AM',
					},
				})

				incrementObjectIsolated({
					before: {
						hrs24: 11,
						hrs12: 11,
						min: 30,
						mode: 'AM',
					},
					after: {
						hrs24: 0,
						hrs12: 12,
						min: 30,
						mode: 'AM',
					},
				})

				incrementObjectIsolated({
					before: {
						hrs24: 12,
						hrs12: 12,
						min: 30,
						mode: 'PM',
					},
					after: {
						hrs24: 13,
						hrs12: 1,
						min: 30,
						mode: 'PM',
					},
				})

				incrementObjectIsolated({
					before: {
						hrs24: 23,
						hrs12: 11,
						min: 0,
						mode: 'PM',
					},
					after: {
						hrs24: 12,
						hrs12: 12,
						min: 0,
						mode: 'PM', // modifying hrs does not modify mode
					},
				})
			})

			describe('Affecting mode (timeObject)', () => {
				const incrementObjectIntegrated = ({ before, after }: BeforeAfterObject) => {
					deepModifierTest({
						...settings,
						before,
						after,
						integration: 'integrated',
					})
				}

				incrementObjectIntegrated({
					before: {
						hrs24: 9,
						hrs12: 9,
						min: 0,
						mode: 'AM',
					},
					after: {
						hrs24: 10,
						hrs12: 10,
						min: 0,
						mode: 'AM',
					},
				})

				incrementObjectIntegrated({
					before: {
						hrs24: 11,
						hrs12: 11,
						min: 30,
						mode: 'AM',
					},
					after: {
						hrs24: 12,
						hrs12: 12,
						min: 30,
						mode: 'PM',
					},
				})

				incrementObjectIntegrated({
					before: {
						hrs24: 12,
						hrs12: 12,
						min: 30,
						mode: 'PM',
					},
					after: {
						hrs24: 13,
						hrs12: 1,
						min: 30,
						mode: 'PM',
					},
				})

				incrementObjectIntegrated({
					before: {
						hrs24: 23,
						hrs12: 11,
						min: 0,
						mode: 'PM',
					},
					after: {
						hrs24: 0,
						hrs12: 12,
						min: 0,
						mode: 'AM', // modifying hrs does not modify mode
					},
				})
			})
		})
	})
}