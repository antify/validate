import { describe, test, expect } from 'vitest'
import { hasGroup } from '../utils'

describe('Utils test', () => {
  test('Should emit groups correctly', () => {
    expect(hasGroup('a', 'a')).toBeTruthy()
    expect(hasGroup('a', 'b')).toBeFalsy()
    expect(hasGroup(['a', 'b'], 'a')).toBeTruthy()
    expect(hasGroup(['a', 'b'], 'b')).toBeTruthy()
    expect(hasGroup(['a', 'b'], 'c')).toBeFalsy()
    expect(hasGroup(['a', 'b'], ['b', 'c', 'a'])).toBeTruthy()
    expect(hasGroup(['a', 'b'], ['c', 'd'])).toBeFalsy()
    expect(hasGroup(['a', 'b'], undefined)).toBeFalsy()
    expect(hasGroup(undefined, ['a', 'b'])).toBeTruthy()
    expect(hasGroup(undefined, undefined)).toBeTruthy()
  })
})
