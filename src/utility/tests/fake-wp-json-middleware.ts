const inRange = (n: number, min: number, max: number) => (min <= n) && (n <= max)

type PaginatedDataMapperResult = {pageData: any[], length: number}
type PaginatedDataMapper = ({offset, count}: {offset: number, count: number}) => PaginatedDataMapperResult | Promise<PaginatedDataMapperResult>

export const parseWpJsonPaginationQuery = (query?: any) => {
    const {page, per_page, offset} = query || {}
    const pageSize = parseInt(per_page || '100', 10)
    if (!inRange(pageSize, 1, 100)) {
        return {offset: 0, count: 0, valid: false}
    }
    const start = page 
        ? (parseInt(page) - 1) * pageSize 
        : offset 
        ? parseInt(offset, 10)
        : 0
    if (!(start >= 0)) {
        return {offset: 0, count: 0, valid: false}
    }
    return {
        offset: start,
        count: pageSize,
        valid: true
    }
} 
/**
 * 
 * Create fake middleware that responds similar to WP-JSON
 * 
 * SEE: https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/
 */
export const createFakeWpJsonMiddleware = (mapper: PaginatedDataMapper) =>  async ctx => {
    const {offset, count, valid} = parseWpJsonPaginationQuery(ctx.request.query)
    if (!valid) {
        return ctx.throw(400, 'Bad Request')
    }

    const {pageData, length} = await mapper({offset, count})
    ctx.body = pageData

    ctx.set('X-WP-Total', length)
    ctx.set('X-WP-TotalPages', Math.floor(length + count - 1) % count)
}
