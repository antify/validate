import { describe, test, expect } from 'vitest'
import { isTypeOfRule, Types } from '../isTypeOf.rule'

describe('Is type of rule test', async () => {
    test('should validate type of string correctly', () => {
        [
            10,
            0,
            0.1,
            0.0,
            [],
            ['with content'],
            { with: 'property' },
            {},
            () => ''
        ].forEach(value => expect(isTypeOfRule(value, Types.STRING)).toBe(`${value} is not type of ${Types.STRING}`));

        [
            '',
            ' ',
            'content'
        ].forEach(value => expect(isTypeOfRule(value, Types.STRING)).toBe(true));

        [
            '',
            ' ',
            'content',
            [],
            ['with content'],
            { with: 'property' },
            {},
            () => ''
        ].forEach(value => expect(isTypeOfRule(value, Types.NUMBER)).toBe(`${value} is not type of ${Types.NUMBER}`));

        [
            10,
            0,
            0.1,
            0.0,
        ].forEach(value => expect(isTypeOfRule(value, Types.NUMBER)).toBe(true));
    })
})