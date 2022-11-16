import { FunctionComponent, ReactNode } from 'react'
import { useMedia, useMeasure } from 'react-use'

import {
    Modal as JoyModal,
    ModalDialog,
    ModalClose,
    Typography,
    Divider,
    useTheme
} from '@mui/joy'

interface ModalProperties {
    title: string
    children?: ReactNode
    onClose(): void
}

const Modal: FunctionComponent<ModalProperties> = ({
    title,
    children,
    onClose,
    ...properties
}: ModalProperties) => {
    let theme = useTheme()
    let isMobile = useMedia(`(max-width: ${theme.breakpoints.values.tablet}px)`)
    let [ref, { width: closeButtonWidth }] = useMeasure<HTMLButtonElement>()

    return (
        <JoyModal open onClose={onClose} sx={{ zIndex: 'modal' }}>
            <ModalDialog
                layout={isMobile ? 'fullscreen' : 'center'}
                {...properties}
            >
                <ModalClose ref={ref} />
                <Typography
                    level='h5'
                    sx={{
                        marginRight: `${2 * closeButtonWidth}px`,
                        marginBottom: 2
                    }}
                >
                    {title}
                </Typography>
                <Divider />
                {children}
            </ModalDialog>
        </JoyModal>
    )
}

export default Modal
