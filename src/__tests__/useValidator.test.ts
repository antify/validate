import { describe, test, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useValidator, Validator } from '../useValidator'

describe('Validator test', () => {
  let validator: Validator

  beforeEach(() => {
    validator = useValidator([
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
    const singleRuleValidator = useValidator((val: unknown) => val === true || 'Message')

    singleRuleValidator.validate(true)
    expect(singleRuleValidator.getErrors()).toStrictEqual([])
    expect(singleRuleValidator.hasErrors()).toBeFalsy()

    singleRuleValidator.validate(false)
    expect(singleRuleValidator.getErrors()).toStrictEqual(['Message'])
    expect(singleRuleValidator.hasErrors()).toBeTruthy()
  })

  test('should validate reactive types correctly', () => {
    const truthy = ref(true)
    const falsy = ref(false)

    validator.validate(truthy)
    expect(validator.hasErrors()).toBeFalsy()

    validator.validate(falsy)
    expect(validator.hasErrors()).toBeTruthy()
  })
})
