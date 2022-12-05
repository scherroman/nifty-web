import React, { Component, ErrorInfo, ReactNode } from 'react'

import { AlertProps } from '@mui/joy'

import ErrorMessage from './ErrorMessage'

interface Properties extends AlertProps {
    children?: ReactNode
}

interface State {
    error: Error | null
}

class ErrorBoundary extends Component<Properties, State> {
    public state: State = {
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { error: error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Uncaught error: ', error, errorInfo)
    }

    dismiss = (): void => {
        this.setState({ error: null })
    }

    public render(): ReactNode {
        let { error } = this.state
        let { children, ...properties } = this.props

        if (error) {
            return <ErrorMessage onClose={this.dismiss} {...properties} />
        }

        return children
    }
}

export default ErrorBoundary
