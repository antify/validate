import { describe, test, expect, beforeEach } from 'vitest'
import { useFieldValidator, Validator } from '../useFieldValidator'

describe('Validator test', () => {
  let validator: Validator

  beforeEach(() => {
    validator = useFieldValidator([
      (val: unknown) => val === true || 'Message',
      (val: unknown) => val === true || 'Message'
    ])
  })

  test('should validate correctly', () => {
    validator.validate(true)
    expect(validator.getErrors()).toStrictEqual([])
    expect(validator.hasErrors()).toBeFalsy()

    validator.validate(false)
    expect(validator.getErrors()).toStrictEqual(['Message', 'Message'])
    expect(validator.getErrorsAsString()).toStrictEqual('- Message\n- Message')
    expect(validator.hasErrors()).toBeTruthy()
  })

  test('should validate with one rule as param correctly', () => {
    const singleRuleValidator = useFieldValidator((val: unknown) => val === true || 'Message')

    singleRuleValidator.validate(true)
    expect(singleRuleValidator.getErrors()).toStrictEqual([])
    expect(singleRuleValidator.hasErrors()).toBeFalsy()

    singleRuleValidator.validate(false)
    expect(singleRuleValidator.getErrors()).toStrictEqual(['Message'])
    expect(singleRuleValidator.hasErrors()).toBeTruthy()
  })
})
