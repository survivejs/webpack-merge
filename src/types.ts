export type CustomizeArray = () => void
export type CustomizeObject = () => void

type ConfigurationUnit = {
    customizeArray: CustomizeArray
    customizeObject: CustomizeObject
}
export type Configuration = ConfigurationUnit[] | ConfigurationUnit
