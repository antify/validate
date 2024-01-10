import { RuleFunction } from '../types'

const regex = /^[a-f\d]{24}$/i

/**
 * Validate RFC 4122 compliant UUIDs for version 1, 3, 4, and 5
 * Using the official uuid package regex.
 *
 * @see: https://www.ietf.org/rfc/rfc4122.txt
 * @see: https://www.npmjs.com/package/uuid
 */
export const isMongoDbObjectIdRule: RuleFunction = (
  val: any,
  message = 'Invalid id'
) => (typeof val === 'string' && regex.test(val)) || message
