import { forwardRef } from 'react'

import { Sheet, SheetProps } from '@mui/joy'
import { motion, HTMLMotionProps } from 'framer-motion'

type Properties = SheetProps & HTMLMotionProps<'div'>

const Frame = forwardRef<HTMLDivElement, Properties>(
    ({ children, sx, ...properties }: Properties, ref) => {
        return (
            <Sheet
                component={motion.div}
                sx={{ backgroundColor: 'transparent', ...sx }}
                {...properties}
                ref={ref}
            >
                {children}
            </Sheet>
        )
    }
)

Frame.displayName = 'Frame'

export default Frame
