'use client'

import { FunctionComponent } from 'react'

import { ErrorMessage } from 'nifty/components/widgets'

interface ErrorProperties {
    error: Error
    reset: () => void
}

const Error: FunctionComponent<ErrorProperties> = ({
    reset
}: ErrorProperties) => {
    return <ErrorMessage onClose={reset} />
}

export default Error
