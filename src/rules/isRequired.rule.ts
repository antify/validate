import { RuleFunction } from '../types'

/**
 * Check if the value is not type of undefined, null or empty string.
 */
export const isRequiredRule: RuleFunction = (
  val: any,
  formData?: any,
  messageCb = (val: any) => 'This field is required'
) => (val !== null && val !== undefined && val !== '') || messageCb(val)
