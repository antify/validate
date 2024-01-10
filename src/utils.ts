/**
 * Emit if the given needle is included in the haystack.
 *
 * @param needle
 * @param haystack
 */
export function hasGroup (needle: string | string[] | undefined, haystack?: string | string[]): boolean {
  if (needle === undefined) {
    return true
  }

  if (haystack === undefined) {
    return false
  }

  const _needle = Array.isArray(needle) ? needle : [needle]
  const _haystack = Array.isArray(haystack) ? haystack : [haystack]

  return _needle.some(n => _haystack.includes(n))
}
