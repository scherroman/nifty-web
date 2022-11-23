import { FunctionComponent, ReactNode } from 'react'
import { SxProps } from '@mui/joy/styles/types'

import { Frame } from '../atoms'

interface GridProperties {
    minimumItemWidth: string
    spacing: number
    sx?: SxProps
    children?: ReactNode
}

/**
 * A CSS Grid that automatically adjusts the width of items based on the total number of items that can fit in a row
 */
const Grid: FunctionComponent<GridProperties> = ({
    minimumItemWidth,
    spacing = 2,
    sx,
    children,
    ...properties
}: GridProperties) => {
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