import * as Koa from 'koa' 
import * as Router from 'koa-router'
const debug = require('debug')('test')

export async function createSimpleWebServer(port: number, init: ({app, router}: {app: typeof Koa, router: typeof Router}) => Promise<any>) {
    const app = new Koa()
    const router = new Router()
    await init({app, router})
    app
        .use(router.routes())
        .use(router.allowedMethods())

    let server = await new Promise((resolve, reject) => {
        let v = app.listen(port, err => err ? reject(err) : resolve(v))
    })

    return {
        app,
        stopServer: () => new Promise(resolve => (server as typeof Koa).close(resolve))
    }
}