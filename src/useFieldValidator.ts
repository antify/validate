import { RuleFunction } from './types'

export class FieldValidator {
  readonly rules: RuleFunction[]
  errorMap: string[] = []

  constructor (rules: RuleFunction | RuleFunction[]) {
    this.rules = typeof rules === 'function' ? [rules] : rules
  }

  validate (data: any): any {
    this.errorMap = []

    this.rules.forEach((rule: Function) => {
      const errorMessage = rule(data)

      if (typeof errorMessage === 'string') {
        this.errorMap.push(errorMessage)
      }
    })

    return data
  }

  hasErrors (): boolean {
    return this.errorMap.length > 0
  }

  getErrors () {
    return this.errorMap
  }

  getErrorsAsString (): string {
    const delimiter = '- '
    const newLine = '\n'
    let stringMessage = ''

    this.errorMap.forEach((error, index) => {
      if (index > 0) {
        stringMessage += newLine
      }

      stringMessage += `${delimiter}${error}`
    })

    return stringMessage
  }
}

export const useFieldValidator = (rules: RuleFunction | RuleFunction[]) => new FieldValidator(rules)
