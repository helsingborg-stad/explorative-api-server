import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql } from 'graphql'
import { GQLEndpoint, GQLEndpointArgs, ResolverMap } from './types'


export function makeGqlEndpoint<TContext = any, TModel = any>({
        schema,
        resolvers
    }: {
        schema: string,
        resolvers: ResolverMap<TContext, TModel> | ResolverMap<TContext, TModel>[]
    }): GQLEndpoint<TContext, TModel> {
    let es = makeExecutableSchema({
        typeDefs:schema,
        resolvers
    })

    return ({context, model, query, variables}: GQLEndpointArgs<TContext, TModel>) => graphql({
        schema: es,
        source: query,
        rootValue: model,
        contextValue: context,
        variableValues: variables
    })
}
