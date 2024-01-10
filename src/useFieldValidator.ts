import { Rule, RuleFunction, RulesConfiguration } from './types'
import { hasGroup } from './utils'

export class FieldValidator {
  readonly rules: Rule[]
  errorMap: string[] = []

  constructor (rules: RulesConfiguration) {
    const resolveRule = (rule: RuleFunction | Rule): Rule => {
      if (typeof rule === 'function') {
        return { rule }
      }

      return rule
    }

    if (typeof rules === 'function') {
      // Rule is type of RuleFunction
      this.rules = [{ rule: rules }]
    } else if (Array.isArray(rules)) {
      // Rule is type of Rule[]
      this.rules = rules.map(resolveRule)
    } else if (typeof rules === 'object') {
      // Rule is type of Rule
      this.rules = [resolveRule(rules)]
    } else {
      throw new TypeError(`Invalid rules configuration. Can not use ${JSON.stringify(rules)} as rule configuration.`)
    }
  }

  validate (data: any, group?: string | string[]): any {
    this.errorMap = []

    this.rules.forEach((rule: Rule) => {
      if (!hasGroup(group, rule.group)) {
        return
      }

      const errorMessage = rule.rule(data)

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

export const useFieldValidator = (rules: RulesConfiguration) => new FieldValidator(rules)
