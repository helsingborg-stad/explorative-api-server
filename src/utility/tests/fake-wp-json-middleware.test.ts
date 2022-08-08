import {parseWpJsonPaginationQuery} from './fake-wp-json-middleware'

describe('parseWpJsonPaginationQuery', () => {
    const cases: [any, any][] = [
        // no pagination info
        [undefined, {offset: 0, count: 100, valid: true}],
        [null, {offset: 0, count: 100, valid: true}],
        [{}, {offset: 0, count: 100, valid: true}],
        [{foo: 'bar'}, {offset: 0, count: 100, valid: true}],

        // default page size = 100
        [{offset: '10'}, {offset: 10, count: 100, valid: true}],
        [{page: '5'}, {offset: 400, count: 100, valid: true}],

        // explicit page size
        [{offset: '10', per_page: '5'}, {offset: 10, count: 5, valid: true}],
        [{page: '9', per_page: '5'}, {offset: 40, count: 5, valid: true}],

        // invalid args
        [{per_page: '150'}, {offset: 0, count: 0, valid: false}],
        [{per_page: '0'}, {offset: 0, count: 0, valid: false}],
        [{per_page: '-5'}, {offset: 0, count: 0, valid: false}],
        [{per_page: 'FIVE'}, {offset: 0, count: 0, valid: false}],
        [{offset: '-10'}, {offset: 0, count: 0, valid: false}],
    ]

    test.each(cases)('parseWpJsonPaginationQuery(%s) should return %s', (query, expected) => expect(parseWpJsonPaginationQuery(query)).toStrictEqual(expected))
})