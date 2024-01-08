export type RuleFunction = (val: any) => true | string
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
  group?: string
}
export type Field = BaseField & {
  rules: RuleFunction | RuleFunction[]
}
export type Fields = {[key: string]: Field | Fields}
