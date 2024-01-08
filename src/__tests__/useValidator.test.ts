import { describe, test, expect, beforeEach } from 'vitest'
import { useValidator, Validator } from '../useValidator'

describe('Validator test', () => {
  let validator: Validator<{
    firstFormGroupFirstItem: boolean
    firstFormGroupSecondItem: boolean
    secondFormGroup: {
      firstItem: boolean
      secondItem: boolean
      thirdItem: {
        firstItem: boolean
        secondItem: boolean
      }
    }
  }>
  let groupedValidator

  beforeEach(() => {
    validator = useValidator({
      first: {
        readableName: 'First',
        rules: val => val === true || 'Value is not true'
      },
      second: {
        readableName: 'Second',
        rules: val => val === true || 'Value is not true'
      },
      third: {
        thirdFirst: {
          readableName: 'First',
          rules: val => val === true || 'Value is not true'
        },
        thirdSecond: {
          readableName: 'Second',
          rules: val => val === true || 'Value is not true'
        },
        thirdThird: {
          thirdThirdFirst: {
            readableName: 'First',
            rules: val => val === true || 'Value is not true'
          },
          thirdThirdSecond: {
            readableName: 'Second',
            rules: val => val === true || 'Value is not true'
          }
        }
      }
    })

    groupedValidator = useValidator<{
      firstFormGroupFirstItem: boolean
      firstFormGroupSecondItem: boolean
      secondFormGroup: {
        firstItem: boolean
        secondItem: boolean
        thirdItem: {
          firstItem: boolean
          secondItem: boolean
        }
      },
      fourth: boolean
    }>({
      first: {
        readableName: 'First',
        rules: val => val === true || 'Value is not true',
        group: 'firstGroup'
      },
      second: {
        readableName: 'Second',
        rules: val => val === true || 'Value is not true',
        group: 'firstGroup'
      },
      third: {
        thirdFirst: {
          readableName: 'First',
          rules: val => val === true || 'Value is not true',
          group: 'secondGroup'
        },
        thirdSecond: {
          readableName: 'Second',
          rules: val => val === true || 'Value is not true',
          group: 'secondGroup'
        },
        thirdThird: {
          thirdThirdFirst: {
            readableName: 'First',
            rules: val => val === true || 'Value is not true',
            group: 'secondGroup'
          },
          thirdThirdSecond: {
            readableName: 'Second',
            rules: val => val === true || 'Value is not true',
            group: 'anotherGroup'
          }
        }
      },
      fourth: {
        readableName: 'Fourth',
        rules: val => val === true || 'Value is not true',
        group: 'secondGroup'
      }
    })
  })

  test('should validate correct values correctly', () => {
    const data = validator.validate({
      first: true,
      second: true,
      third: {
        thirdFirst: true,
        thirdSecond: true,
        thirdThird: {
          thirdThirdFirst: true,
          thirdThirdSecond: true,
          notExistingInConfiguration: true
        },
        notExistingInConfiguration: true
      },
      notExistingInConfiguration: true
    })

    expect(data).toStrictEqual({
      first: true,
      second: true,
      third: {
        thirdFirst: true,
        thirdSecond: true,
        thirdThird: {
          thirdThirdFirst: true,
          thirdThirdSecond: true
        }
      }
    })
    expect(validator.hasErrors()).toBeFalsy()
    expect(validator.getErrors()).toStrictEqual({})
    expect(validator.getErrorsAsString()).toStrictEqual('')
  })

  test('should validate missing values correctly', () => {
    [true, false, 'string', 10, 0.0, ['content'],
      null, undefined, {}, { wrong: 'field' }].forEach((val: unknown) => {
      const data = validator.validate(val)

      expect(data).toStrictEqual({
        first: undefined,
        second: undefined,
        third: {
          thirdFirst: undefined,
          thirdSecond: undefined,
          thirdThird: {
            thirdThirdFirst: undefined,
            thirdThirdSecond: undefined
          }
        }
      })
      expect(validator.hasErrors()).toBeTruthy()
      expect(validator.getErrors()).toStrictEqual({
        first: [
          'Value is not true'
        ],
        second: [
          'Value is not true'
        ],
        third: {
          thirdFirst: [
            'Value is not true'
          ],
          thirdSecond: [
            'Value is not true'
          ],
          thirdThird: {
            thirdThirdFirst: [
              'Value is not true'
            ],
            thirdThirdSecond: [
              'Value is not true'
            ]
          }
        }
      })
      expect(validator.getErrorsAsString()).toStrictEqual('First\n- Value is not true\nSecond\n' +
        '- Value is not true\nFirst\n- Value is not true\nSecond\n- Value is not true\nFirst\n' +
        '- Value is not true\nSecond\n- Value is not true')
    })
  })

  test('should emit and show errors correctly', () => {
    const data = validator.validate({
      first: true,
      second: false,
      third: {
        thirdFirst: true,
        thirdSecond: false,
        thirdThird: {
          thirdThirdFirst: true,
          thirdThirdSecond: true,
          notExistingInConfiguration: true
        },
        notExistingInConfiguration: true
      },
      notExistingInConfiguration: true
    })

    expect(data).toStrictEqual({
      first: true,
      second: false,
      third: {
        thirdFirst: true,
        thirdSecond: false,
        thirdThird: {
          thirdThirdFirst: true,
          thirdThirdSecond: true
        }
      }
    })
    expect(validator.hasErrors()).toBeTruthy()
    expect(validator.getErrors()).toStrictEqual({
      second: ['Value is not true'],
      third: {
        thirdSecond: ['Value is not true']
      }
    })
    expect(validator.getErrorsAsString()).toStrictEqual('Second\n- Value is not true\nSecond\n- Value is not true')
  })

  test('should validate groups correct', () => {
    const data = groupedValidator.validate({
      first: true,
      second: true,
      third: {
        thirdFirst: true,
        thirdSecond: true,
        thirdThird: {
          thirdThirdFirst: true,
          thirdThirdSecond: true
        }
      },
      fourth: true
    }, 'secondGroup')

    expect(data).toStrictEqual({
      third: {
        thirdFirst: true,
        thirdSecond: true,
        thirdThird: {
          thirdThirdFirst: true
        }
      },
      fourth: true
    })
    expect(validator.hasErrors()).toBeFalsy()
    expect(validator.getErrors()).toStrictEqual({})
    expect(validator.getErrorsAsString()).toStrictEqual('')
  })

  test('should emit and show errors for groups correct', () => {
    const data = groupedValidator.validate({
      first: false,
      second: false,
      third: {
        thirdFirst: false,
        thirdSecond: false,
        thirdThird: {
          thirdThirdFirst: false,
          thirdThirdSecond: false
        }
      },
      fourth: false
    }, 'secondGroup')

    expect(data).toStrictEqual({
      third: {
        thirdFirst: false,
        thirdSecond: false,
        thirdThird: {
          thirdThirdFirst: false
        }
      },
      fourth: false
    })
    expect(groupedValidator.hasErrors()).toBeTruthy()
    expect(groupedValidator.getErrors()).toStrictEqual({
      third: {
        thirdFirst: [
          'Value is not true'
        ],
        thirdSecond: [
          'Value is not true'
        ],
        thirdThird: {
          thirdThirdFirst: [
            'Value is not true'
          ]
        }
      },
      fourth: [
        'Value is not true'
      ]
    })
    expect(groupedValidator.getErrorsAsString()).toStrictEqual('First\n- Value is not true\nSecond\n- Value is not true\n' +
      'First\n- Value is not true\nFourth\n- Value is not true')
  })

  test('should reset correctly', () => {
    const data = validator.validate({
      first: false,
      second: false,
      third: {
        thirdFirst: false,
        thirdSecond: false,
        thirdThird: {
          thirdThirdFirst: false,
          thirdThirdSecond: false,
          notExistingInConfiguration: false
        },
        notExistingInConfiguration: false
      },
      notExistingInConfiguration: false
    })

    expect(validator.hasErrors()).toBeTruthy()

    validator.reset()

    expect(validator.hasErrors()).toBeFalsy()
    expect(validator.getErrors()).toStrictEqual({})
    expect(validator.getErrorsAsString()).toStrictEqual('')
  })
})
