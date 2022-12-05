'use client'

import { FunctionComponent } from 'react'

import { CircularProgress, CircularProgressProps } from '@mui/joy'

import Frame from './Frame'

type Properties = CircularProgressProps

/**
 * Circular loader that centers itself within its parent
 */
const CircularLoader: FunctionComponent<Properties> = ({
    ...properties
}: Properties) => {
    return (
        <Frame
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
            }}
        >
            <CircularProgress thickness={4} {...properties} />
        </Frame>
    )
}

export default CircularLoader
