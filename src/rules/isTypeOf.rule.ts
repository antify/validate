export enum Types {
    STRING = 'string',
    NUMBER = 'number'
}
export const isTypeOfRule = (val: any, type: Types, message: string = `${val} is not type of ${type}`): true | string => typeof val === type || message;