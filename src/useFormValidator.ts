import { Validator } from './useValidator'
import { Field } from './types'

export class FormValidator {
  readonly validatorMap: Record<string, Validator> = {}
  readonly fieldMap: Record<string, Field> = {}

  constructor (fields: Record<string, Field>) {
    Object.keys(fields).forEach((key) => {
      this.validatorMap[key] = new Validator(fields[key].rules)
      this.fieldMap[key] = fields[key]
    })
  }

  validate (data: Record<string, any | { value: any }>): Record<string, any> {
    const values: Record<string, any | { value: any }> = {}

    Object.keys(this.validatorMap).forEach((key: string) => {
      if (typeof data !== 'object' || Array.isArray(data) || !data) {
        throw new Error(`Can not validate data of type ${typeof data}`)
      }

      this.validateProperty(key, data[key])

      values[key] = data[key]?.value !== undefined ? data[key].value : data[key]
    })

    return values
  }

  validateProperty (
    property: string,
    data: any | { value: any }
  ) {
    if (!this.validatorMap[property]) {
      throw new Error(`There is no field for property ${property}`)
    }

    this.validatorMap[property].validate(data)
  }

  hasErrors (): boolean {
    return Object.values(this.validatorMap).some(validator => validator.hasErrors())
  }

  getErrors (): Record<string, string[]> {
    const errorMap = {}

    Object.keys(this.validatorMap).forEach((key) => {
      if (this.validatorMap[key].hasErrors()) {
        errorMap[key] = this.validatorMap[key].getErrors()
      }
    })

    return errorMap
  }

  getErrorsAsString (): string {
    const newLine = '\n'
    let stringMessage = ''

    Object.keys(this.validatorMap).forEach((key) => {
      if (this.validatorMap[key].hasErrors()) {
        if (stringMessage) {
          stringMessage += newLine
        }

        stringMessage += `${this.fieldMap[key].readableName || key}${newLine}${this.validatorMap[key].getErrorsAsString()}`
      }
    })

    return stringMessage
  }
}

export const useFormValidator = (fields: Record<string, Field>) => new FormValidator(fields)
