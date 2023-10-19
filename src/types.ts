export type RuleFunction = (val: any) => true | string
export type Field = {
  /**
   * The human-readable name. Used for error message.
   */
  readableName?: string,
  rules: RuleFunction | RuleFunction[]
}
