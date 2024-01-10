export type RuleFunction = (val: any) => true | string
export type Rule = {
  rule: RuleFunction,
  group?: string | string[],
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
  group?: string | string[]
}
export type Field = BaseField & {
  rules: RulesConfiguration
}
export type Fields = {[key: string]: Field | Fields}
