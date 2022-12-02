import type { CodegenConfig } from '@graphql-codegen/cli'

/* eslint-disable @typescript-eslint/naming-convention */
const CONFIG: CodegenConfig = {
    schema: 'source/subgraph/schema.json',
    documents: ['app/**/*.tsx', 'source/**/*.tsx'],
    generates: {
        'source/subgraph/types/': {
            preset: 'client',
            plugins: []
        }
    },
    ignoreNoDocuments: true
}
/* eslint-enable @typescript-eslint/naming-convention */

export default CONFIG
