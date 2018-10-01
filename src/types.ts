export type CustomizeArray = (a: any, b: any, key: Key) => any;
export type CustomizeObject = (a: any, b: any, key: Key) => any;

export type Key = string;

interface IConfigurationUnit {
  customizeArray: CustomizeArray;
  customizeObject: CustomizeObject;
}
export type Configuration = IConfigurationUnit[] | IConfigurationUnit;

export enum ArrayRule {
  PreLoaders = "preLoaders",
  Loaders = "loaders",
  PostLoaders = "postLoaders",
  Rules = "rules"
}

export interface ICustomizeRules {
  [s: string]: CustomizeRule;
}
export enum CustomizeRule {
  Append = "append",
  Prepend = "prepend",
  Replace = "replace"
}
