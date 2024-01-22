export type RuleFunction = (
  val: any,
  /**
   * The whole unvalidated form data to validate
   * depending on other fields in the form.
   */
  formData?: any,
  messageCb?: (...args: any[]) => string
) => true | string
export type Rule = {
  rule: RuleFunction,
  groups?: string | string[],
}
export type RulesConfiguration = RuleFunction | Rule | (Rule | RuleFunction)[]
export type TransformFunction = (val: any) => any
export type BaseField = {
  /**
   * The human-readable name. Used for error message.
   */
  readableName?: string,

  /**
   * Add multiple fields to one group.
   * A group can get validated together. It represents a form which is a part of multiple forms.
   * Imagine tabs, where each tab has his own form but all forms reference to one data object.
   */
  groups?: string | string[]

  /**
   * If the value which should get validated is undefined, this defaultValue will
   * be injected in each rule function.
   */
  defaultValue?: any,

  /**
   * Transform the value before validating it.
   * This is useful if you want to parse a string "1" to a number 1 for example.
   */
  transform?: TransformFunction
}
export type Field = BaseField & {
  rules: RulesConfiguration
}
export type Fields = { [key: string]: Field | Fields }
