import { describe, test, expect } from 'vitest'
import { isUUIDRule } from '../isUUID.rule'

describe('Is UUID rule test', () => {
  test('Should validate correctly', () => {
    [
      // Version 1
      'e86d95d6-afa2-11ee-a506-0242ac120002',
      'e86d987e-afa2-11ee-a506-0242ac120002',
      // Version 3
      '47ffd175-0489-3355-8d13-a8f009f20c14',
      '50bf16fa-8559-3be4-9c21-0257115dc6f0',
      // Version 4
      'd42ea606-04d5-4a28-8058-fe76e96f31d5',
      'd90444ce-30cf-4881-888a-be081b652bdb',
      // Version 5
      '9a35c975-d047-5f65-9722-d40e044fdb91',
      'cb8750e0-2666-5d81-a4dd-6c2e3faf6ca7',
      // Nil
      '00000000-0000-0000-0000-000000000000'
    ].forEach(n => expect(isUUIDRule(n)).toBe(true));

    [
      'e86d95d6-afa2-11ee-a506-0242ac120002 ',
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
    ].forEach(invalidEmail => expect(isUUIDRule(invalidEmail, 'message')).toBe('message'))
  })
})
