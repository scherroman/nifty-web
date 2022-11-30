import type { CodegenConfig } from '@graphql-codegen/cli'

/* eslint-disable @typescript-eslint/naming-convention */
const CONFIG: CodegenConfig = {
    schema: 'subgraph/schema.json',
    documents: ['pages/**/*.tsx', 'source/**/*.tsx'],
    generates: {
        'subgraph/types/': {
            preset: 'client',
            plugins: []
        }
    },
    ignoreNoDocuments: true
}
/* eslint-enable @typescript-eslint/naming-convention */

export default CONFIG
