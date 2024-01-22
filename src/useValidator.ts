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

  validate (formData: any, groups?: string | string[]): V {
    const validateInDepth = <T = Partial<ValidType>>(fieldMap: FieldMap, currentData: any, values: T, groups?: string | string[]): T => {
      Object.keys(fieldMap).forEach((key) => {
        if (fieldMap[key]._isField) {
          const field = fieldMap[key] as FieldMapField

          if (!hasGroup(groups, field?.groups)) {
            return
          }

          let value = field.defaultValue !== undefined && currentData?.[key] === undefined ? field.defaultValue : currentData?.[key]

          if (field.transform) {
            value = field.transform(value)
          }

          values[key] = field.validator.validate(value, formData, groups)
        } else {
          const _values = validateInDepth(fieldMap[key] as FieldMap, currentData?.[key], values[key] || {}, groups)

          if (Object.keys(_values).length > 0) {
            values[key] = _values
          }
        }
      })

      return values
    }

    return validateInDepth<V>(this.fieldMap, formData, {} as V, groups)
  }

  hasErrors (groups?: string | string[]): boolean {
    return Object.keys(this.getErrors(groups)).length > 0
  }

  getErrors (groups?: string | string[]): ErrorMap {
    const getErrorsInDepth = (fieldMap: FieldMap, errors: ErrorMap): ErrorMap => {
      Object.keys(fieldMap).forEach((key) => {
        if (fieldMap[key]._isField) {
          if (!hasGroup(groups, (fieldMap[key] as FieldMapField).groups)) {
            return
          }

          if ((fieldMap[key] as FieldMapField).validator.hasErrors()) {
            errors[key] = (fieldMap[key] as FieldMapField).validator.getErrors()
          }
        } else {
          const _errors = getErrorsInDepth(fieldMap[key] as FieldMap, errors[key] as ErrorMap || {})

          if (Object.keys(_errors).length > 0) {
            errors[key] = _errors
          }
        }
      })

      return errors
    }

    return getErrorsInDepth(this.fieldMap, {})
  }

  /**
   * Return all fields as a one dimensional array.
   *
   * @param groups
   */
  getFieldsFlat (groups?: string | string[]): FieldMapField[] {
    const getFieldsInDepth = (fieldMap: FieldMap, fields: FieldMapField[] = []): FieldMapField[] => {
      Object.keys(fieldMap).forEach((key) => {
        if (fieldMap[key]._isField) {
          if (!hasGroup(groups, (fieldMap[key] as FieldMapField).groups)) {
            return
          }

          fields.push(fieldMap[key] as FieldMapField)
        } else {
          getFieldsInDepth(fieldMap[key] as FieldMap, fields)
        }
      })

      return fields
    }

    return getFieldsInDepth(this.fieldMap, [])
  }

  getErrorsAsString (groups?: string | string[]): string {
    const newLine = '\n'
    let stringMessage = ''

    this.getFieldsFlat(groups).forEach((field) => {
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
