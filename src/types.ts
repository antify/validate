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
}
export type Field = BaseField & {
  rules: RulesConfiguration
}
export type Fields = {[key: string]: Field | Fields}
