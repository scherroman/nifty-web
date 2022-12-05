import { FunctionComponent } from 'react'

import ReportIcon from '@mui/icons-material/Report'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { Alert, AlertProps, IconButton, Typography } from '@mui/joy'

interface Properties extends AlertProps {
    message?: string
    onClose: () => void
}

/**
 * Fixes buggy onClose behavior of regular Joy UI errorMessage, so that it doesn't fire a close event until the click is finished
 */
const ErrorMessage: FunctionComponent<Properties> = ({
    message = 'Something went wrong',
    onClose = (): void => void 0,
    ...properties
}: Properties) => {
    return (
        <Alert
            variant='soft'
            color='danger'
            startDecorator={<ReportIcon />}
            endDecorator={
                <IconButton
                    variant='soft'
                    size='sm'
                    color='danger'
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            }
            {...properties}
        >
            <div>
                <Typography level='body1'>{message}</Typography>
            </div>
        </Alert>
    )
}

export default ErrorMessage
