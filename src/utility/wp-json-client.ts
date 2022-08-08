import * as request from 'superagent'

interface WpJsonClient {
    getPaginated(url: string): Promise<any[]>
}

const isNonEmptyArray = (a: any) => Array.isArray(a) && (a.length > 0)


async function getPaginated ({url, offset, pageSize, total}: {url: string, offset: number, pageSize: number, total: number}) {
    if (total <= offset) return []
    let {headers, body} = await request
        .get(url)
        .accept('application/json')
        .query({offset, per_page: pageSize})
    if (!isNonEmptyArray(body)) return []
    let tail = await getPaginated({
        url,
        offset: offset + Number(body.length),
        pageSize,
        total: Number(headers['x-wp-total']) || 0
    })
    return body.concat(tail)
}

type createWpJsonClientArgs = {pageSize: number}
export const createWpJsonClient = ({pageSize = 100}: createWpJsonClientArgs = {pageSize: 100}): WpJsonClient => ({
    getPaginated: url => getPaginated({url, offset: 0, pageSize, total: 1000})
})
