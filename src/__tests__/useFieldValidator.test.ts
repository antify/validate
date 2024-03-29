import { describe, test, expect } from 'vitest'
import { useFieldValidator } from '../useFieldValidator'
import { RuleFunction } from '../types'

describe('Validator test', () => {
  const ruleFunction: RuleFunction = (val, formData, messageCb = () => 'Message') => val === true || messageCb()

  test('Should emit the RuleFunction`s params correctly', () => {
    const validator = useFieldValidator([
      (val, formData) => {
        expect(val).toStrictEqual(true)
        expect(formData).toStrictEqual(false)
        return true
      }
    ])

    validator.validate(true, false)
  })

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
        groups: ['first']
      }, {
        rule: (val: unknown) => val === true || 'Second message',
        groups: 'second'
      }, {
        rule: (val: unknown) => val === true || 'Not defined message',
        groups: undefined
      }, {
        rule: (val: unknown) => val === true || 'Twice message',
        groups: ['foo', 'twice']
      }, {
        rule: (val: unknown) => val === true || 'Twice message',
        groups: 'twice'
      }
    ])

    validator.validate(false, undefined, 'first')
    expect(validator.getErrors()).toStrictEqual(['First message', 'Not defined message'])
    expect(validator.hasErrors()).toBeTruthy()

    validator.validate(false, undefined, 'second')
    expect(validator.getErrors()).toStrictEqual(['Second message', 'Not defined message'])
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

    validator.validate(false, undefined, 'twice')
    expect(validator.getErrors()).toStrictEqual(['Not defined message', 'Twice message', 'Twice message'])
    expect(validator.hasErrors()).toBeTruthy()

    validator.validate(false, undefined, ['twice', 'first'])
    expect(validator.getErrors()).toStrictEqual(['First message', 'Not defined message', 'Twice message', 'Twice message'])
    expect(validator.hasErrors()).toBeTruthy()
  })
})
