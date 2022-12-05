import { FunctionComponent } from 'react'

import { Card as JoyCard, CardProps } from '@mui/joy'

type Properties = CardProps

const Card: FunctionComponent<Properties> = ({
    variant = 'outlined',
    sx,
    children,
    ...properties
}: Properties) => {
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
