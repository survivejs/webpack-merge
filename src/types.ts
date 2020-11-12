export type Key = string;

export type Customize = (a: any, b: any, key: Key) => any;

export interface ICustomizeOptions {
  customizeArray?: Customize;
  customizeObject?: Customize;
}

export enum CustomizeRule {
  Match = "match",
  Append = "append",
  Prepend = "prepend",
  Replace = "replace",
}
