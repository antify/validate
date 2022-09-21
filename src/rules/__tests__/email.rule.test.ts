import { describe, test, expect } from 'vitest'
import { emailRule } from '../email.rule'

describe('Email rule test', async () => {
    test('should validate email correctly', () => {
        [
            'email@example.com',
            'firstname.lastname@example.com',
            'email@subdomain.example.com',
            'firstname+lastname@example.com',
            '“email”@example.com',
            '1234567890@example.com',
            'email@example-one.com',
            '_______@example.com',
            'email@example.name',
            'email@example.museum',
        ].forEach(validEmail => expect(emailRule(validEmail)).toBe(true));

        [
            'plainaddress',
            '#@%^%#$@#$@#.com',
            '@example.com',
            'Joe Smith <email@example.com>',
            'email.example.com',
            'email@example@example.com',
            '.email@example.com',
            'email.@example.com',
            'email..email@example.com',
            'email@example.com (Joe Smith)',
            'email@example',
            'email@111.222.333.44444',
            'email@example..com',
            'Abc..123@example.com',
            '“(),:;<>[\]@example.com',
            'just"not"right@example.com',
            'this\ is"really"not\allowed@example.com',
        ].forEach(invalidEmail => expect(emailRule(invalidEmail, 'message')).toBe('message'));
    })
})