import { FunctionComponent } from 'react'

import { Card as JoyCard, CardProps } from '@mui/joy'

type CardProperties = CardProps

const Card: FunctionComponent<CardProperties> = ({
    variant = 'outlined',
    sx,
    children,
    ...properties
}: CardProperties) => {
    return (
        <JoyCard
            variant={variant}
            sx={{ boxShadow: 'none', ...sx }}
            {...properties}
        >
            {children}
        </JoyCard>
    )
}

export default Card
