import { describe, test, expect } from 'vitest'
import { notBlankRule } from '../notBlank.rule'

describe('Not blank rule test', () => {
  test('Should validate blank content correctly', () => {
    [
      'content',
      'a',
      '{"and": "json-content"}'
    ].forEach(value => expect(notBlankRule(value)).toBe(true));

    [
      ' ',
      '    ',
      '   ',
      '\n',
      '\t',
      '\n\t',
      10,
      0,
      0.1,
      0.0,
      [],
      ['with content'],
      { with: 'property' },
      {}
    ].forEach(value => expect(
      notBlankRule(value, undefined, () => 'message')
    ).toBe('message'))
  })
})
