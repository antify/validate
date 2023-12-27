import { describe, test, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useFormValidator, FormValidator } from '../useFormValidator'

describe('FormValidator test', () => {
  let formValidator: FormValidator

  beforeEach(() => {
    formValidator = useFormValidator({
      truthy: {
        readableName: 'Truthy field',
        rules: [() => true, () => true, () => true]
      },
      falsy: {
        readableName: 'Falsy field',
        rules: [() => 'Message']
      },
      truthyAndFalsy: {
        readableName: 'Truthy and falsy field',
        rules: [() => true, () => 'Message']
      },
      falsyAndFalsy: {
        readableName: 'Falsy and falsy field',
        rules: [() => 'Message', () => 'Message']
      },
      dynamic: {
        readableName: 'Dynamic field',
        rules: [(val: unknown) => val === true || 'Message']
      }
    })
  })

  test('should validate a property correctly', () => {
    formValidator.validateProperty('truthy', true)
    expect(formValidator.getErrors()).toStrictEqual({})
    expect(formValidator.hasErrors()).toBeFalsy()

    formValidator.validateProperty('falsy', true)
    expect(formValidator.getErrors()).toStrictEqual({
      falsy: ['Message']
    })
    expect(formValidator.hasErrors()).toBeTruthy()
  })

  test('should validate all properties correctly', () => {
    formValidator.validate({
      truthy: true,
      falsy: true,
      truthyAndFalsy: true,
      dynamic: true
    })

    expect(formValidator.getErrors()).toStrictEqual({
      falsy: [
        'Message'
      ],
      truthyAndFalsy: [
        'Message'
      ],
      falsyAndFalsy: [
        'Message',
        'Message'
      ]
    })
    expect(formValidator.getErrorsAsString()).toStrictEqual('Falsy field\n- Message\nTruthy and falsy field\n- Message\nFalsy and falsy field\n- Message\n- Message')
  })

  test('should validate reactive types correctly', () => {
    const _formValidator = useFormValidator({
      truthy: {
        rules: [val => val === true || '']
      },
      falsy: {
        rules: [val => val === false || '']
      }
    })

    _formValidator.validate({
      truthy: ref(true),
      falsy: ref(false)
    })

    expect(_formValidator.hasErrors()).toBeFalsy()
  })

  test('should validate all properties with object as param only', () => {
    expect.assertions(5);

    [true, 'string', 0, 0.0, []].forEach((val: unknown) => {
      try {
        // @ts-ignore
        formValidator.validate(val)
      } catch (e) {
        expect(e.message).toBe(`Can not validate data of type ${typeof val}`)
      }
    })
  })

  test('should not validate a not existing property', () => {
    expect.assertions(1)

    try {
      formValidator.validateProperty('notExistingOne', true)
    } catch (e) {
      expect(e.message).toBe('There is no field for property notExistingOne')
    }
  })

  test('should return the correct validated values', () => {
    const _formValidator = useFormValidator({
      truthy: {
        rules: [val => val === true || '']
      },
      falsy: {
        rules: [val => val === false || '']
      }
    })

    const values = _formValidator.validate({
      truthy: true,
      falsy: ref(false),
      withoutRule: 'string'
    })

    expect(values).toStrictEqual({
      truthy: true,
      falsy: false
    })
  })
})
