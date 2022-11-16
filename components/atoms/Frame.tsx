import { forwardRef } from 'react'

import { Sheet, SheetProps } from '@mui/joy'
import { motion, HTMLMotionProps } from 'framer-motion'

type FrameProperties = SheetProps & HTMLMotionProps<'div'>

const Frame = forwardRef<HTMLDivElement, FrameProperties>(
    ({ children, ...properties }: FrameProperties, ref) => {
        return (
            <Sheet component={motion.div} {...properties} ref={ref}>
                {children}
            </Sheet>
        )
    }
)

Frame.displayName = 'Frame'

export default Frame
