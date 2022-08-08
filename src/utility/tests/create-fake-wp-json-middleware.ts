const inRange = (n: number, min: number, max: number) => (min <= n) && (n <= max)

type PaginatedDataMapperResult = {pageData: any[], length: number}
type PaginatedDataMapper = ({offset, count}: {offset: number, count: number}) => PaginatedDataMapperResult | Promise<PaginatedDataMapperResult>

export const createFakeWpJsonMiddleware = (mapper: PaginatedDataMapper) =>  async ctx => {
    const {page, per_page, offset } = ctx.request.query

    const pageSize = parseInt(per_page)
    if (!inRange(pageSize, 1, 100)) {
        return ctx.throw(400, 'Bad Request')
    }
    const start = page ? (parseInt(page) - 1) * pageSize : parseInt(offset, 10)
    if (!(start >= 0)) {
        return ctx.throw(400, 'Bad Request')
    }
    const {pageData, length} = await mapper({offset: start, count: pageSize})
    ctx.body = pageData

    ctx.set('X-WP-Total', length)
    ctx.set('X-WP-TotalPages', Math.floor(length + pageSize - 1) % pageSize)
}

export const createFakeWpJsonMiddleware2 = (data: any[]) =>  async ctx => {
    const {page, per_page, offset } = ctx.request.query

    const pageSize = parseInt(per_page)
    if (!inRange(pageSize, 1, 100)) {
        return ctx.throw(400, 'Bad Request')
    }
    const start = page ? parseInt(page) * pageSize : parseInt(offset, 10)
    if (!inRange(start, 0, data.length)) {
        ctx.body = []
    } else {
        ctx.body = data.slice(start, start+ pageSize)
    }

    ctx.set('X-WP-Total', data.length)
    ctx.set('X-WP-TotalPages', Math.floor(data.length + pageSize - 1) % pageSize)
}