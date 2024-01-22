import { describe, test, expect } from 'vitest'
import { stringToBooleanTransformer } from '../stringToBoolean.transformer'

describe('String to boolean transformer test', () => {
  test('Should transform valid strings correctly', () => {
    [
      ['false', false],
      ['true', true],
      [false, false],
      [true, true]
    ].forEach((data) => {
      const result = stringToBooleanTransformer(data[0])
      expect(result).toBe(data[1])
      expect(result).toBeTypeOf('boolean')
    })
  })

  test('Should handle invalid data correctly', () => {
    [
      () => 'string',
      { key: 'val' },
      [],
      null,
      undefined,
      1,
      'test1',
      'TRUE',
      'FALSE',
      'true '
    ].forEach(data => expect(stringToBooleanTransformer(data)).toBe(data))
  })
})
