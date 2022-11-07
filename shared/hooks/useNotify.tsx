import { useContext } from 'react'
import {
    useState,
    createContext,
    useCallback,
    FunctionComponent,
    ReactNode,
    Fragment
} from 'react'

import { Alert, IconButton } from '@mui/joy'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export function useNotify(): ({ message, type }: NotifyArguments) => void {
    let { notify } = useContext(NotificationContext)
    return notify
}

interface Notification {
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    color: undefined | 'success' | 'warning' | 'danger'
    icon: ReactNode
}

export type NotifyArguments = Pick<Notification, 'message'> &
    Partial<Notification>

interface NotificationContext {
    notify: ({ message, type }: NotifyArguments) => void
}

export const NotificationContext = createContext<NotificationContext>({
    notify: () => void 0
})

const NOTIFICATION_TYPES_CONFIGURATION: Record<
    'info' | 'success' | 'warning' | 'error',
    Pick<Notification, 'color' | 'icon'>
> = {
    info: {
        color: undefined,
        icon: <InfoIcon />
    },
    success: {
        color: 'success',
        icon: <CheckCircleIcon />
    },
    warning: {
        color: 'warning',
        icon: <WarningIcon />
    },
    error: {
        color: 'danger',
        icon: <ReportIcon />
    }
}

interface NotificationProviderProperties {
    children?: ReactNode
}

export const NotificationProvider: FunctionComponent<
    NotificationProviderProperties
> = ({ children }: NotificationProviderProperties) => {
    let [isClosed, setIsClosed] = useState(false)
    let [notification, setNotification] = useState<Notification | undefined>()

    let notify = useCallback(({ message, type = 'info' }: NotifyArguments) => {
        let configuration = NOTIFICATION_TYPES_CONFIGURATION[type]
        setNotification({
            message,
            type,
            color: configuration.color,
            icon: configuration.icon
        })
        setIsClosed(false)
    }, [])

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Fragment>
                {notification && !isClosed && (
                    <Alert
                        color={notification.color}
                        startDecorator={notification.icon}
                        endDecorator={
                            <IconButton
                                variant='plain'
                                size='sm'
                                color={notification.color}
                                onClick={(): void => {
                                    setIsClosed(true)
                                }}
                            >
                                <CloseRoundedIcon />
                            </IconButton>
                        }
                        sx={{
                            position: 'absolute',
                            top: (theme) => theme.spacing(1),
                            right: (theme) => theme.spacing(1)
                        }}
                    >
                        {notification.message}
                    </Alert>
                )}
            </Fragment>
        </NotificationContext.Provider>
    )
}
