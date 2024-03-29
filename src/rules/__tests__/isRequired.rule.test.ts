import { describe, test, expect } from 'vitest'
import { isRequiredRule } from '../isRequired.rule'

describe('Is required rule test', () => {
  test('Should validate correctly', () => {
    [
      'content',
      ' ',
      true,
      false,
      NaN,
      10,
      0,
      0.1,
      0.0,
      [],
      ['with content'],
      { with: 'property' },
      {}
    ].forEach(value => expect(isRequiredRule(value)).toBe(true));

    [
      null,
      undefined,
      ''
    ].forEach(value => expect(
      isRequiredRule(value, undefined, () => 'message')).toBe('message')
    )
  })
})
