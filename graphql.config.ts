import type { IGraphQLConfig } from 'graphql-config'

const CONFIG: IGraphQLConfig = {
    schema: './subgraph/schema.json',
    documents: ['pages/**/*.tsx', 'source/**/*.tsx']
}

export default CONFIG
