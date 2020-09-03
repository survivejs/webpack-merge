export type Key = string;

export type Customize = (a: any, b: any, key: Key) => any;

export interface ICustomizeOptions {
  customizeArray?: Customize;
  customizeObject?: Customize;
}

export interface ICustomizeRules {
  [s: string]: CustomizeRule;
}
export enum CustomizeRule {
  Append = "append",
  Merge = "merge",
  Prepend = "prepend",
  Replace = "replace",
}
