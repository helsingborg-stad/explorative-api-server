import { makeGqlEndpoint } from '../gql/make-gql-endpoint'
import { makeGqlMiddleware } from '../gql/make-gql-middleware'
import * as request from 'superagent'

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
            title: raw => raw?.title?.plain_text || null,
            place: raw => raw?.place?.map(({name}) => name).filter(v => v)[0] || null,
        },
        SmallDisturbance: {
            date: raw => raw?.date || null,
            title: raw => raw?.title?.plain_text || null,
            content: raw => raw?.content?.plain_text || null,
        },
        Query: {
            stations: () => request
                .get('https://api.helsingborg.se/alarm/json/wp/v2/station')
                .then(({body}) => body),
            smallDisturbances: () => request
                .get('https://api.helsingborg.se/alarm/json/wp/v2/small-disturbance?_fields=title,content,date')
                .then(({body}) => body)
        }
    }
}

export const makeAlarmEndpoint = () => makeGqlEndpoint(AlarmEntity)

export const makeAlarmMiddleware = () => makeGqlMiddleware(makeAlarmEndpoint())