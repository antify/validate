import { describe, test, expect } from 'vitest'
import { isMongoDbObjectIdRule } from '../isMongoDbObjectId.rule'

describe('Is mongoDb object id rule test', () => {
  test('Should validate correctly', () => {
    [
      '659e767dd1afad698fef0dd9',
      '659e7686cea3ec34b02585ab'
    ].forEach(n => expect(isMongoDbObjectIdRule(n)).toBe(true));

    [
      '659e767dd1afad698fef0dd9-1',
      '659e767dd1afad698fef0dd9 ',
      false,
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
    ].forEach(invalidEmail => expect(isMongoDbObjectIdRule(invalidEmail, 'message')).toBe('message'))
  })
})
