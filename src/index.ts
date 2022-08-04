import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'

import { makeFsMiddleware } from './fs-ns'
import { makeAlarmMiddleware } from './alarm-ns'

const app = new Koa()
const router = new Router()
const PORT = process.env.PORT || 3000

router
    .post('/alarm/graphql', makeAlarmMiddleware())
    .post('/localfs/graphql', makeFsMiddleware())

app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
