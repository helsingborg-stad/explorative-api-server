export type ResolverFn<TContext, TModel> = (source?: TModel, context?: TContext) => any
export type ResolverMap<TContext, TModel> = Record<string, Record<string, ResolverFn<TContext, TModel>>>

export type GQLEndpointArgs<TContext, TModel> = {
    context?: TContext, 
    model?: TModel, 
    query: string, 
    variables: Record<string, any>
}

export type GQLEndpoint<TContext, TModel> = (args: GQLEndpointArgs<TContext, TModel>) => Promise<any>
