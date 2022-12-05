'use client'

import { FunctionComponent } from 'react'

import { ErrorMessage } from 'nifty/components/widgets'

interface Properties {
    error: Error
    reset: () => void
}

const Error: FunctionComponent<Properties> = ({ reset }: Properties) => {
    return <ErrorMessage onClose={reset} />
}

export default Error
