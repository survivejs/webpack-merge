// Type definitions for webpack-merge
// Project: https://github.com/survivejs/webpack-merge
// Definitions by: Sergey Homa <https://github.com/BjornMelgaard>

import { Configuration } from 'webpack'

export = Merge

declare namespace Merge {
  interface ConfigurationJoiner {
    (...configuration: Configuration[]): Configuration
    (configuration: Configuration[]): Configuration
  }

  type CustomizeFunc = (a: any, b: any, key: string) => any
  type CustomizationObj = {
    customizeArray?: CustomizeFunc
    customizeObject?: CustomizeFunc
  }

  type StrategyType = 'prepend' | 'append' | 'replace'
  type StrategyMap = { [feild: string]: StrategyType }

  /**
   * Unique merge strategy
   */
  const unique: (key: string, uniques: string[], getter: (a: any) => any) => any

  /**
   * Merging with a customizable merge strategy
   */
  const strategy: (options: StrategyMap) => ConfigurationJoiner

  /**
   * Merging with a customizable smart merge strategy
   */
  const smartStrategy: (options: StrategyMap) => ConfigurationJoiner

  interface NonstandartConfigurationJoiner {
    (...configuration: any[]): Configuration
    (configuration: any[]): Configuration
  }

  /**
   * Merging with a smart merge strategy
   */
  const smart: NonstandartConfigurationJoiner

  /**
   * Merging with a multiple merge strategy
   */
  const multiple: NonstandartConfigurationJoiner
}

/**
 * Merge multiple webpack configurations into one.
 */
declare function Merge(...configuration: Configuration[]): Configuration

/**
 * Merge array of webpack configurations into one.
 */
declare function Merge(configuration: Configuration[]): Configuration

/**
 * Merge multiple webpack configurations into one with custom behavior.
 */
declare function Merge(
  customizationObj: Merge.CustomizationObj
): Merge.ConfigurationJoiner
