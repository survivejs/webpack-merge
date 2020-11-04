export type Key = string;

export type Customize = (a: any, b: any, key: Key) => any;

export interface ICustomizeOptions {
  customizeArray?: Customize;
  customizeObject?: Customize;
}

export enum CustomizeRule {
  Match = "match",
  Append = "append",
  AppendOnly = "append-only",
  Prepend = "prepend",
  PrependOnly = "prepend-only",
  Replace = "replace",
  ReplaceOnly = "replace-only",
}
