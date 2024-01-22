import { TransformFunction } from '../types'

export const stringToBooleanTransformer: TransformFunction = (val: string | boolean | any): boolean | any => {
  if (typeof val === 'boolean' || val === 'true') {
    return !!val
  }

  if (val === 'false') {
    return false
  }

  return val
}
