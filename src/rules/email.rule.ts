import { RuleFunction } from '../types'

const regex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const emailRule: RuleFunction = (
  val: any,
  formData?: any,
  messageCb = (val: any) => 'Invalid email'
) => (typeof val === 'string' && regex.test(val)) || messageCb(val)
