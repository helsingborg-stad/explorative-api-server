import OpenAPIBackend from 'openapi-backend'
import * as Router from 'koa-router'
import * as Koa from 'koa'

export interface ApplicationContext {
    app: Koa,
    api: OpenAPIBackend,
    router: typeof Router,
    application: Application
}

export type ApplicationModule = (context: ApplicationContext) => void


export interface Application {
    use(module: ApplicationModule): Application
    start(port: number|string): Application
}
