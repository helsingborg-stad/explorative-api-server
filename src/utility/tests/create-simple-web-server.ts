import * as Koa from 'koa' 
import * as Router from 'koa-router'

export async function createSimpleWebServer(port: number, init: ({app, router}: {app: Koa, router: typeof Router}) => Promise<any>) {
    const app = new Koa()
    const router = new Router()
    await init({app, router})
    app
        .use(router.routes())
        .use(router.allowedMethods())

    let server = await new Promise((resolve) => {
        let v = app.listen(port, () => resolve(v))
    })

    return {
        app,
        stopServer: () => new Promise(resolve => (server as any).close(resolve))
    }
}