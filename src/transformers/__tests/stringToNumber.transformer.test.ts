import { describe, test, expect } from 'vitest'
import { stringToNumberTransformer } from '../stringToNumber.transformer'

describe('String to number transformer test', () => {
  test('Should transform valid strings correctly', () => {
    [
      ['-1', -1],
      ['0', 0],
      ['+1', 1],
      ['1', 1],
      ['.1', 0.1],
      ['0.1', 0.1],
      [' 1 ', 1],
      [-1, -1],
      [0, 0],
      [+1, 1],
      [1, 1],
      [0.1, 0.1]
    ].forEach((data) => {
      const result = stringToNumberTransformer(data[0])
      expect(result).toBe(data[1])
      expect(result).toBeTypeOf('number')
    })
  })

  test('Should handle invalid data correctly', () => {
    [
      () => 'string',
      { key: 'val' },
      [],
      null,
      undefined,
      true,
      'test1'
    ].forEach(data => expect(stringToNumberTransformer(data)).toBe(data))
  })
})
