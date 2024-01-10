import { FieldValidator } from './useFieldValidator'
import { BaseField, Field, Fields } from './types'
import { hasGroup } from './utils'

type ValidType = Record<string, any>
type FieldMapField = BaseField & {
  validator: FieldValidator

  /**
   * Type differentiator to detect the difference type of
   * Field and just a Record with Fields only.
   */
  _isField: true
}
type FieldMap = { [key: string]: FieldMapField | FieldMap }
type ErrorMap = { [key: string]: string[] | ErrorMap }

export class Validator<V = ValidType> {
  // TODO:: Typescript is loosing the object structure through the recursive function.
  // Calling validator.fieldMap.X would result in a unresolved variable error.
  readonly fieldMap: FieldMap = {}

  constructor (fields: Fields) {
    const generateFieldMap = (fields: Fields, fieldMap: FieldMap = {}): FieldMap => {
      Object.keys(fields).forEach((key) => {
        if (fields[key]?.rules !== undefined) {
          fieldMap[key] = {
            ...fields[key],
            validator: new FieldValidator(fields[key].rules as Field['rules']),
            _isField: true
          }
        } else {
          fieldMap[key] = generateFieldMap(fields[key] as Fields, fieldMap[key] as FieldMap)
        }
      })

      return fieldMap
    }

    this.fieldMap = generateFieldMap(fields)
  }

  validate<T> (data: any, group?: string | string[]): V {
    const validateInDepth = <T = Partial<ValidType>>(fieldMap: FieldMap, data: any, values: T, group?: string | string[]): T => {
      Object.keys(fieldMap).forEach((key) => {
        if (fieldMap[key]._isField) {
          if (!hasGroup(group, fieldMap[key]?.group)) {
            return
          }

          values[key] = (fieldMap[key].validator as FieldValidator).validate(data?.[key])
        } else {
          const _values = validateInDepth(fieldMap[key] as FieldMap, data?.[key], values[key] || {}, group)

          if (Object.keys(_values).length > 0) {
            values[key] = _values
          }
        }
      })

      return values
    }

    return validateInDepth<V>(this.fieldMap, data, {} as V, group)
  }

  hasErrors (group?: string): boolean {
    return Object.keys(this.getErrors(group)).length > 0
  }

  getErrors (group?: string): ErrorMap {
    const getErrorsInDepth = (fieldMap: FieldMap, errors: ErrorMap, group?: string): ErrorMap => {
      Object.keys(fieldMap).forEach((key) => {
        if (fieldMap[key]._isField) {
          if (group && fieldMap[key].group !== group) {
            return
          }

          if ((fieldMap[key] as FieldMapField).validator.hasErrors()) {
            errors[key] = (fieldMap[key] as FieldMapField).validator.getErrors()
          }
        } else {
          const _errors = getErrorsInDepth(fieldMap[key] as FieldMap, errors[key] as ErrorMap || {}, group)

          if (Object.keys(_errors).length > 0) {
            errors[key] = _errors
          }
        }
      })

      return errors
    }

    return getErrorsInDepth(this.fieldMap, {}, group)
  }

  /**
   * Return all fields as a one dimensional array.
   *
   * @param group
   */
  getFieldsFlat (group?: string): FieldMapField[] {
    const getFieldsInDepth = (fieldMap: FieldMap, fields: FieldMapField[] = [], group?: string): FieldMapField[] => {
      Object.keys(fieldMap).forEach((key) => {
        if (fieldMap[key]._isField) {
          if (group && fieldMap[key].group !== group) {
            return
          }

          fields.push(fieldMap[key] as FieldMapField)
        } else {
          getFieldsInDepth(fieldMap[key] as FieldMap, fields, group)
        }
      })

      return fields
    }

    return getFieldsInDepth(this.fieldMap, [], group)
  }

  getErrorsAsString (group?: string): string {
    const newLine = '\n'
    let stringMessage = ''

    this.getFieldsFlat(group).forEach((field) => {
      if (field.validator.hasErrors()) {
        if (stringMessage) {
          stringMessage += newLine
        }

        stringMessage += `${field.readableName || ''}${newLine}${field.validator.getErrorsAsString()}`
      }
    })

    return stringMessage
  }

  reset (): void {
    this.getFieldsFlat().forEach((field) => {
      field.validator.errorMap = []
    })
  }
}

export const useValidator = <V = ValidType>(fields: Fields) => new Validator<V>(fields)
