import { GQLEndpoint } from "./types"
const debug = require('debug')('gql-middleware')

export function makeGqlMiddleware<TContext, TModel>(
    endpoint: GQLEndpoint<TContext, TModel>,
    {
        mapQuery = q => q,
        mapVariables = v => v
    }: {
        mapQuery?: (q: any) => any,
        mapVariables?: (q: any) => any
    } = {}
    ){
    debug('creating middleware')
    return async ctx => {
        const {request: {body: {query, variables}}} = ctx
        debug({query, variables})
        let result = await endpoint({
            query: mapQuery(query),
            variables: mapVariables(variables)
        })
        ctx.body = result
    }
}