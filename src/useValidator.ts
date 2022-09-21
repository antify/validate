export class Validator {
  readonly ruleMap: Record<string, Function[]>;
  errorMap: Record<string, string[]> = {};

  constructor(ruleMap: Record<string, Function[]>) {
    this.ruleMap = ruleMap;
  }

  validate(data: unknown, errorLimitPerProperty: number | null = null) {
    this.errorMap = {};

    Object.keys(this.ruleMap).forEach((key: string) => {
      if (typeof data !== "object" || Array.isArray(data) || !data) {
        throw new Error(`Can not validate data of type ${typeof data}`);
      }

      this.validateProperty(key, data[key], errorLimitPerProperty);
    });
  }

  validateProperty(
    property: string,
    data: unknown,
    errorLimit: number | null = null
  ) {
    if (!this.ruleMap[property]) {
      throw new Error(`There is no rule for property ${property}`);
    }

    delete this.errorMap[property];

    this.ruleMap[property].every((ruleFunction) => {
      const errorMessage = ruleFunction(data);
      const hasError = typeof errorMessage === "string";

      if (hasError) {
        if (!this.errorMap[property]) {
          this.errorMap[property] = [];
        }

        this.errorMap[property].push(errorMessage);
      }

      return (
        errorLimit === null ||
        errorLimit > (this.errorMap[property]?.length || 0)
      );
    });
  }

  hasErrors(): boolean {
    return Object.values(this.errorMap).length > 0;
  }

  getErrors() {
    const errorList = [];

    Object.values(this.errorMap).forEach((errors) =>
      errors.forEach((error) => errorList.push(error))
    );

    return errorList;
  }

  getErrorsAsString(): string {
    const delimiter = "\n- ";
    let stringMessage = "";

    Object.values(this.errorMap).forEach((errors) =>
      errors.forEach((error) => (stringMessage += `${delimiter}${error}`))
    );

    return stringMessage;
  }

  getErrorsOfProperty(property: string): string {
    // TODO:: implement me
    return "";
  }
}

export const useValidator = (map: Record<string, Function[]>) => {
  return new Validator(map);
};
