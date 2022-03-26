import { String12hr } from '../../types/index'
import { convertString12hr } from '../convert/convert'
import { Flash24hrTime } from './flash24hrTime.types'

// Used for quickly switching an input from 12hr to 24hr then back to 12hr.
// This is useful when the user submits forms.
// It will sends 24hr time to the server on submit like modern browsers do.
// Not adding a form event listener, different frameworks might handle submit differently
/** Briefly switch an input element to display 24 hour time instead of 12 hour time. Primarily useful when submitting forms. */
export const flash24hrTime: Flash24hrTime = ($input) => {
	const value12hr = $input.value as String12hr
	$input.value = convertString12hr(value12hr).to24hr()
	setTimeout(() => {
		$input.value = value12hr
	})
}
