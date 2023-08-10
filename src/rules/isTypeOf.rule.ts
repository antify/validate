export enum Types {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    OBJECT = 'object',
    ARRAY = 'array',
}
export const isTypeOfRule = (val: any, type: Types, message: string = `${JSON.stringify(val)} is not type of ${type}`): true | string => {
    if (typeof val === Types.OBJECT) {
        if (type === Types.ARRAY && Array.isArray(val)) {
            return true;
        }

        if (type === Types.OBJECT && !Array.isArray(val)) {
            return true;
        }

        return message;
    }

    return typeof val === type ? true : message;
};