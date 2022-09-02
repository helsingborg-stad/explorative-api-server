import { ApplicationContext } from '../../application/types'
import { makeGqlEndpoint } from '../../gql/make-gql-endpoint'
import { makeGqlMiddleware } from '../../gql/make-gql-middleware'

import { createWpJsonClient } from '../../utility/wp-json-client'

const stationFromWp = raw => ({
    title: raw?.title?.plain_text || null,
    place: raw?.place?.map(({name}) => name).filter(v => v)[0] || null,
})

const smallDisturbanceFromWp = raw => ({
    date: raw?.date || null,
    title: raw?.title?.plain_text || null,
    content: raw?.content?.plain_text || null,
})

const AlarmEntity = {
    schema: `
        type Station {
            title: String,
            place: String
        }
        type SmallDisturbance {
            date: String
            title: String
            content: String
        }
        type Query {
            stations: [Station]
            smallDisturbances: [SmallDisturbance]
        }
        `,
    resolvers: {
        Station: {
            title: o => o.title,
            // title: ({title}) => title,
            place: ({place}) => place,
        },
        SmallDisturbance: {
            date: ({date}) => date,
            title: ({title}) => title,
            content: ({content}) => content,
        },
        Query: {
            stations: () => createWpJsonClient()
                .getPaginated('https://api.helsingborg.se/alarm/json/wp/v2/station')
                .then(raw => raw.map(stationFromWp)),
            smallDisturbances: () => createWpJsonClient()
                .getPaginated('https://api.helsingborg.se/alarm/json/wp/v2/small-disturbance?_fields=title,content,date')
                .then(raw => raw.map(smallDisturbanceFromWp))
        }
    }
}

const makeAlarmEndpoint = () => makeGqlEndpoint(AlarmEntity)

const makeAlarmMiddleware = () => makeGqlMiddleware(makeAlarmEndpoint())


const alarmModule = ({api}: ApplicationContext) => {
    const alarmGqlHandler = makeAlarmMiddleware()
    api.register({
        alarmGql: (c, ctx) => alarmGqlHandler(ctx)
    })
}

export default alarmModule
