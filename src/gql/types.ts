type ResolverFn<TContext, TModel> = (source?: TModel, context?: TContext) => any
type ResolverMap<TContext, TModel> = Record<string, Record<string, ResolverFn<TContext, TModel>>>

type GQLEndpointArgs<TContext, TModel> = {
    context?: TContext, 
    model?: TModel, 
    query: string, 
    variables: Record<string, any>
}

type GQLEndpoint<TContext, TModel> = (args: GQLEndpointArgs<TContext, TModel>) => Promise<any>
