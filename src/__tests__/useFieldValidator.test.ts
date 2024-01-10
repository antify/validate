import { describe, test, expect } from 'vitest'
import { useFieldValidator } from '../useFieldValidator'

describe('Validator test', () => {
  const ruleFunction = (val: unknown) => val === true || 'Message'

  test('Should validate with multiple rule functions as param correctly', () => {
    const validator = useFieldValidator([ruleFunction, ruleFunction])
    validator.validate(true)
    expect(validator.getErrors()).toStrictEqual([])
    expect(validator.getErrorsAsString()).toStrictEqual('')
    expect(validator.hasErrors()).toBeFalsy()

    validator.validate(false)
    expect(validator.getErrors()).toStrictEqual(['Message', 'Message'])
    expect(validator.getErrorsAsString()).toStrictEqual('- Message\n- Message')
    expect(validator.hasErrors()).toBeTruthy()
  })

  test('Should validate with one rule function as param correctly', () => {
    const validator = useFieldValidator(ruleFunction)

    validator.validate(true)
    expect(validator.getErrors()).toStrictEqual([])
    expect(validator.getErrorsAsString()).toStrictEqual('')
    expect(validator.hasErrors()).toBeFalsy()

    validator.validate(false)
    expect(validator.getErrors()).toStrictEqual(['Message'])
    expect(validator.getErrorsAsString()).toStrictEqual('- Message')
    expect(validator.hasErrors()).toBeTruthy()
  })

  test('Should validate with oen rule as param correctly', () => {
    const validator = useFieldValidator({
      rule: ruleFunction
    })
    validator.validate(true)
    expect(validator.getErrors()).toStrictEqual([])
    expect(validator.getErrorsAsString()).toStrictEqual('')
    expect(validator.hasErrors()).toBeFalsy()

    validator.validate(false)
    expect(validator.getErrors()).toStrictEqual(['Message'])
    expect(validator.getErrorsAsString()).toStrictEqual('- Message')
    expect(validator.hasErrors()).toBeTruthy()
  })

  test('Should validate with multiple and mixed rules as param correctly', () => {
    const validator = useFieldValidator([
      {
        rule: ruleFunction
      },
      ruleFunction,
      {
        rule: ruleFunction
      },
      ruleFunction
    ])
    validator.validate(true)
    expect(validator.getErrors()).toStrictEqual([])
    expect(validator.getErrorsAsString()).toStrictEqual('')
    expect(validator.hasErrors()).toBeFalsy()

    validator.validate(false)
    expect(validator.getErrors()).toStrictEqual(['Message', 'Message', 'Message', 'Message'])
    expect(validator.getErrorsAsString()).toStrictEqual('- Message\n- Message\n- Message\n- Message')
    expect(validator.hasErrors()).toBeTruthy()
  })

  test('Should validate with groups correctly', () => {
    const validator = useFieldValidator([
      {
        rule: (val: unknown) => val === true || 'First message',
        group: ['first']
      }, {
        rule: (val: unknown) => val === true || 'Second message',
        group: 'second'
      }, {
        rule: (val: unknown) => val === true || 'Not defined message',
        group: undefined
      }, {
        rule: (val: unknown) => val === true || 'Twice message',
        group: ['foo', 'twice']
      }, {
        rule: (val: unknown) => val === true || 'Twice message',
        group: 'twice'
      }
    ])

    validator.validate(false, 'first')
    expect(validator.getErrors()).toStrictEqual(['First message'])
    expect(validator.hasErrors()).toBeTruthy()

    validator.validate(false, 'second')
    expect(validator.getErrors()).toStrictEqual(['Second message'])
    expect(validator.hasErrors()).toBeTruthy()

    validator.validate(false)
    expect(validator.getErrors()).toStrictEqual([
      'First message',
      'Second message',
      'Not defined message',
      'Twice message',
      'Twice message'
    ])
    expect(validator.hasErrors()).toBeTruthy()

    validator.validate(false, 'twice')
    expect(validator.getErrors()).toStrictEqual(['Twice message', 'Twice message'])
    expect(validator.hasErrors()).toBeTruthy()

    validator.validate(false, ['twice', 'first'])
    expect(validator.getErrors()).toStrictEqual(['First message', 'Twice message', 'Twice message'])
    expect(validator.hasErrors()).toBeTruthy()
  })
})
