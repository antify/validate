export const isOneOfRule = (
  val: any,
  items: any[],
  messageCb: (val: any, items: any) => string = (val, items) => `${JSON.stringify(val)} is not one of ${JSON.stringify(items)}`
): true | string =>
  items.includes(val) || messageCb(val, items)
