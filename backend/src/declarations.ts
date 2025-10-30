// For more information about this file see https://dove.feathersjs.com/guides/cli/typescript.html
import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { ApplicationConfiguration } from './configuration'

export type { NextFunction }

// The types for app.get(name) and app.set(name)
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends ApplicationConfiguration {}

// A mapping of service names to types. Will be extended in service files.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

// Extend ServiceOptions to support Swagger docs
declare module '@feathersjs/feathers' {
  interface ServiceOptions {
    docs?: any
  }
}

// The context for hook functions - can be typed with a service class
export type HookContext<S = any> = FeathersHookContext<Application, S>
