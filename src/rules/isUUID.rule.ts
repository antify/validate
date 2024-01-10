import { RuleFunction } from '../types'

const regex =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i

/**
 * Validate RFC 4122 compliant UUIDs for version 1, 3, 4, and 5
 * Using the official uuid package regex.
 *
 * @see: https://www.ietf.org/rfc/rfc4122.txt
 * @see: https://www.npmjs.com/package/uuid
 */
export const isUUIDRule: RuleFunction = (
  val: any,
  message = 'Invalid UUID'
) => (typeof val === 'string' && regex.test(val)) || message
