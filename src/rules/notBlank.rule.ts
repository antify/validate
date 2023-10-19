export const notBlankRule = (val: any, message = 'Should not be blank'): true | string => (typeof val === 'string' && val.trim().length > 0) || message
