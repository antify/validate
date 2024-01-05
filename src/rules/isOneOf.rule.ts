export const isOneOfRule = (val: any, items: any[]): true | string =>
  items.includes(val) || `${JSON.stringify(val)} is not one of ${JSON.stringify(items)}`
