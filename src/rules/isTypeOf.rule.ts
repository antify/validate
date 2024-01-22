export enum Types {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  NULL = 'null',
  UNDEFINED = 'undefined'
}

const isTypeOf = (val: any, type: Types): boolean => {
  // eslint-disable-next-line valid-typeof
  if (typeof val === Types.OBJECT) {
    if (val === null) {
      return type === Types.NULL
    }

    if (type === Types.ARRAY && Array.isArray(val)) {
      return true
    }

    if (type === Types.OBJECT && !Array.isArray(val)) {
      return true
    }

    return false
  }

  // eslint-disable-next-line valid-typeof
  return typeof val === type
}

export const isTypeOfRule = (
  val: any,
  /**
   * Multiple types get compared with OR operator.
   */
  type: Types | Types[],
  messageCb: (val: any, types: Types[]) => string = (val: any, types: Types[]) => `${JSON.stringify(val)} is not type of ${types.join(' | ')}`
): true | string => {
  const _type = Array.isArray(type) ? type : [type]

  if (_type.some(t => isTypeOf(val, t))) {
    return true
  }

  return messageCb(val, _type)
}
