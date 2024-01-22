import { TransformFunction } from '../types'

export const stringToNumberTransformer: TransformFunction = (val: string | number | any): number | any => {
  if (['string', 'number'].includes(typeof val)) {
    const valAsNumber = Number(val)

    if (!Number.isNaN(valAsNumber)) {
      return valAsNumber
    }
  }

  return val
}
