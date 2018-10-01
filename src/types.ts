export type CustomizeArray = () => void;
export type CustomizeObject = () => void;

interface IConfigurationUnit {
  customizeArray: CustomizeArray;
  customizeObject: CustomizeObject;
}
export type Configuration = IConfigurationUnit[] | IConfigurationUnit;
