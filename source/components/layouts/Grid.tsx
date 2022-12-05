import { FunctionComponent, ReactNode } from 'react'
import { SxProps } from '@mui/joy/styles/types'

import { Frame } from 'nifty/components/atoms'

interface Properties {
    minimumItemWidth: string
    spacing?: number
    sx?: SxProps
    children?: ReactNode
}

/**
 * A CSS Grid that automatically adjusts the width of items based on the total number of items that can fit in a row
 */
const Grid: FunctionComponent<Properties> = ({
    minimumItemWidth,
    spacing = 2,
    sx,
    children,
    ...properties
}: Properties) => {
    return (
        <Frame
            sx={{
                display: 'grid',
                gap: (theme) => theme.spacing(spacing),
                gridTemplateColumns: `repeat(auto-fill, minmax(${minimumItemWidth}, auto))`,
                ...sx
            }}
            {...properties}
        >
            {children}
        </Frame>
    )
}

export default Grid
