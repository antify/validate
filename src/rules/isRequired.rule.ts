import { RuleFunction } from '../types'

/**
 * Check if the value is not type of undefined or null.
 */
export const isRequiredRule: RuleFunction = (val: any, message = 'This field is required') => (val !== null && val !== undefined) || message