import {realpath, stat, readdir} from 'node:fs/promises'
import {basename, join} from 'node:path'
import { ApplicationContext } from '../../application/types'
import { makeGqlEndpoint } from '../../gql/make-gql-endpoint'
import { makeGqlMiddleware } from '../../gql/make-gql-middleware'

const makeEntry = async (path: string) => {
    var rp = await realpath(path)
    var s = await stat(rp)
    return {
        path: rp,
        stat: s
    }
}

const FSEntity = {
    schema: `
        type Entry {
            name: String
            path: String
            children: [Entry]
        }
        type Query {
            root: Entry
        }
        `,
    resolvers: {
        Entry: {
            name: ({path}) => basename(path),
            path: ({path}) => path,
            children: ({path, stat}) => 
                stat.isDirectory() 
                ? readdir(path)
                    .then(names => names.map(name => join(path, name)))
                    .then(paths => paths.reduce<Promise<any[]>>(
                        async (list, path) => ([...await list, await makeEntry(path)]),
                        Promise.resolve([])))
                : Promise.resolve([])
        },
        Query: {
            root: () => makeEntry('.')
        }
    }
}

function makeFsEndpoint () {
    return makeGqlEndpoint(FSEntity)
}

function makeFsMiddleware () {
    return makeGqlMiddleware(makeFsEndpoint())
}

const localfsModule = ({api}: ApplicationContext) => {
    const fsGqlHandler = makeFsMiddleware()
    api.register({
        localfsGql: (c, ctx) => fsGqlHandler(ctx)
    })
}

export default localfsModule
