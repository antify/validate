import { describe, test, expect } from 'vitest'
import { isOneOfRule } from '../isOneOf.rule'

describe('Is one of rule test', () => {
  test('Should validate correctly', () => {
    expect(isOneOfRule('bar', ['foo', 'bar'])).toBeTruthy()
    expect(isOneOfRule('baz', ['foo', 'bar'])).toBe('"baz" is not one of ["foo","bar"]')

    expect(isOneOfRule(2, [1, 2])).toBeTruthy()
    expect(isOneOfRule(3, [1, 2])).toBe('3 is not one of [1,2]')
  })
})
