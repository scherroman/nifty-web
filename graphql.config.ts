import type { IGraphQLConfig } from 'graphql-config'

const CONFIG: IGraphQLConfig = {
    schema: 'source/subgraph/schema.json',
    documents: ['app/**/*.tsx', 'source/**/*.tsx']
}

export default CONFIG
