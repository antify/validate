import { describe, test, expect } from 'vitest'
import { notBlankRule } from '../notBlank.rule'

describe('Not blank rule test', async () => {
    test('should validate blank content correctly', () => {
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
            {},
        ].forEach(value => expect(notBlankRule(value, 'message')).toBe('message'));

        [
            'content',
            'a',
            '{"and": "json-content"}'
        ].forEach(value => expect(notBlankRule(value)).toBe(true));
    })
})