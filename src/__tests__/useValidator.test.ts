import { describe, test, expect, beforeEach } from "vitest";
import { useValidator, Validator } from "../useValidator";

describe("Validator test", async () => {
  let validator: Validator;

  beforeEach(() => {
    validator = useValidator({
      truthly: [() => true, () => true, () => true],
      falshy: [() => "Message"],
      truthlyAndFalshy: [() => "Message", () => true],
      dynamic: [(val: unknown) => val === true || "Message"],
    });
  });

  test("should validate a property correctly", () => {
    validator.validateProperty("truthly", true);
    expect(validator.getErrors()).toStrictEqual([]);

    validator.validateProperty("falshy", true);
    expect(validator.getErrors()).toStrictEqual(["Message"]);
  });

  test("should validate all properties correctly", () => {
    validator.validate({
      truthly: true,
      falshy: true,
      truthlyAndFalshy: true,
      dynamic: true,
    });

    expect(validator.getErrors()).toStrictEqual(["Message", "Message"]);
  });

  test("should validate all properties with object as param only", () => {
    expect.assertions(5);

    [true, "string", 0, 0.0, []].forEach((val: unknown) => {
      try {
        validator.validate(val);
      } catch (e) {
        expect(e.message).toBe(`Can not validate data of type ${typeof val}`);
      }
    });
  });

  test("should not validate a not existing property", () => {
    expect.assertions(1);

    try {
      validator.validateProperty("notExistingOne", true);
    } catch (e) {
      expect(e.message).toBe("There is no rule for property notExistingOne");
    }
  });

  test("should validate one rule only with validateUntilOnRuleFail property", () => {
    const localValidator = useValidator({
      prop: [() => true, () => "FirstMessage", () => "SecondMessage"],
    });

    localValidator.validateProperty("prop", true, 1);
    expect(localValidator.getErrors()).toStrictEqual(["FirstMessage"]);

    localValidator.validateProperty("prop", true);
    expect(localValidator.getErrors()).toStrictEqual([
      "FirstMessage",
      "SecondMessage",
    ]);

    localValidator.validate({ prop: true }, 1);
    expect(localValidator.getErrors()).toStrictEqual(["FirstMessage"]);

    localValidator.validate({ prop: true });
    expect(localValidator.getErrors()).toStrictEqual([
      "FirstMessage",
      "SecondMessage",
    ]);
  });
});
