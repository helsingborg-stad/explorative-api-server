import {createSimpleWebServer} from './create-simple-web-server'
import {createWpJsonClient} from '../wp-json-client'
import {createFakeWpJsonMiddleware} from './fake-wp-json-middleware'

const PORT = 4001

describe ('wp-json-client', () => {
    test("can do paginated requests", async () => {
        // fake data to be retuned in slices/pages from fake server
        const data = Array.from({length: 100}, (_, i) =>  ({slug: `item-${i}`}))

        // start a fake server mimicking WP-JSON
        const { stopServer } = await createSimpleWebServer(
            PORT,
            async ({router}) => router.get('/test-endpoint', createFakeWpJsonMiddleware(({offset, count}) => ({
                pageData: data.slice(offset, offset + count),
                length: data.length
            }))))

        try {
            const client = await createWpJsonClient({pageSize: 10})
            const result = await client.getPaginated(`http://localhost:${PORT}/test-endpoint?f=1`)

            expect(JSON.stringify(data)).toBe(JSON.stringify(result))

        } finally {
            await stopServer()
        }
    })
})
