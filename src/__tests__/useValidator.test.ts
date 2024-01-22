import { describe, test, expect, beforeEach } from 'vitest'
import { useValidator, Validator } from '../useValidator'

describe('Validator test', () => {
  const ruleFunction = val => val === true || 'Value is not true'
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
  let groupedValidator: Validator

  beforeEach(() => {
    validator = useValidator({
      first: {
        readableName: 'First',
        rules: ruleFunction
      },
      second: {
        readableName: 'Second',
        rules: ruleFunction
      },
      third: {
        thirdFirst: {
          readableName: 'First',
          rules: ruleFunction
        },
        thirdSecond: {
          readableName: 'Second',
          rules: ruleFunction
        },
        thirdThird: {
          thirdThirdFirst: {
            readableName: 'First',
            rules: ruleFunction
          },
          thirdThirdSecond: {
            readableName: 'Second',
            rules: ruleFunction
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
        rules: ruleFunction,
        groups: 'firstGroup'
      },
      second: {
        readableName: 'Second',
        rules: ruleFunction,
        groups: 'firstGroup'
      },
      third: {
        thirdFirst: {
          readableName: 'First',
          rules: [
            ruleFunction,
            {
              rule: ruleFunction,
              groups: 'anotherGroup'
            }
          ],
          groups: 'secondGroup'
        },
        thirdSecond: {
          readableName: 'Second',
          rules: [
            ruleFunction,
            {
              rule: ruleFunction,
              groups: 'secondGroup'
            }
          ],
          groups: 'secondGroup'
        },
        thirdThird: {
          thirdThirdFirst: {
            readableName: 'First',
            rules: ruleFunction,
            groups: 'secondGroup'
          },
          thirdThirdSecond: {
            readableName: 'Second',
            rules: ruleFunction,
            groups: 'anotherGroup'
          }
        }
      },
      fourth: {
        readableName: 'Fourth',
        rules: ruleFunction,
        groups: 'secondGroup'
      }
    })
  })

  test('Should validate correct values correctly', () => {
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

  test('Should validate missing values correctly', () => {
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

  test('Should emit and show errors correctly', () => {
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

  test('Should validate groups correct', () => {
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

  test('Should emit and show errors for groups correct', () => {
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
    expect(groupedValidator.getErrors()).toStrictEqual({
      third: {
        thirdFirst: [
          'Value is not true'
        ],
        thirdSecond: [
          'Value is not true',
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
    expect(groupedValidator.hasErrors()).toBeTruthy()
    expect(groupedValidator.getErrorsAsString()).toStrictEqual('First\n- Value is not true\n' +
      'Second\n- Value is not true\n- Value is not true\n' +
      'First\n- Value is not true\nFourth\n- Value is not true')
  })

  test('Should reset correctly', () => {
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

  test('Should set default values correctly', () => {
    const _validator = useValidator({
      first: {
        rules: ruleFunction,
        defaultValue: true
      }
    })
    const data = _validator.validate({})

    expect(_validator.hasErrors()).toBeFalsy()
    expect(data).toStrictEqual({
      first: true
    })
  })

  test('Should call transformers correctly', () => {
    const _validator = useValidator({
      first: {
        rules: ruleFunction,
        transform: () => true
      }
    })

    expect(_validator.validate({
      first: 'true'
    })).toStrictEqual({
      first: true
    })
    expect(_validator.hasErrors()).toBeFalsy()
  })
})
