import { RuleFunction } from '../types'

/**
 * Check if the value is string and contains at least one character.
 * It also detects whitespace characters.
 */
export const notBlankRule: RuleFunction = (val: any, message = 'Should not be blank') => (typeof val === 'string' && val.trim().length > 0) || message
