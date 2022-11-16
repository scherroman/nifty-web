import {
    useRef,
    useState,
    useContext,
    createContext,
    useCallback,
    FunctionComponent,
    ReactNode
} from 'react'
import { useClickAway } from 'react-use'
import { AnimatePresence } from 'framer-motion'

import { sleep } from '../utilities/general'

import { Alert, IconButton } from '@mui/joy'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ReportIcon from '@mui/icons-material/Report'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import { Frame } from '../../components/atoms'

const ANIMATION_DURATION_IN_MILLISECONDS = 300
const SLIDE_ANIMATION_DISTANCE = 50

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
    let ref = useRef(null)
    let [isOpen, _setIsOpen] = useState(false)
    let isOpenRef = useRef(isOpen)
    let [notification, setNotification] = useState<Notification | undefined>()

    let setIsOpen = useCallback((value: boolean) => {
        _setIsOpen(value)
        isOpenRef.current = value
    }, [])

    useClickAway(
        ref,
        () => {
            setIsOpen(false)
        },
        ['mouseup']
    )

    let notify = useCallback(
        async ({ message, type = 'info' }: NotifyArguments) => {
            let configuration = NOTIFICATION_TYPES_CONFIGURATION[type]

            if (isOpenRef.current) {
                setIsOpen(false)
                await sleep(ANIMATION_DURATION_IN_MILLISECONDS)
            }
            setNotification({
                message,
                type,
                color: configuration.color,
                icon: configuration.icon
            })
            setIsOpen(true)
        },
        [setIsOpen]
    )

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <AnimatePresence>
                {notification && isOpen && (
                    <Frame
                        initial={{ x: SLIDE_ANIMATION_DISTANCE, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: SLIDE_ANIMATION_DISTANCE, opacity: 0 }}
                        transition={{
                            duration: ANIMATION_DURATION_IN_MILLISECONDS / 1000
                        }}
                        sx={{
                            position: 'absolute',
                            top: (theme) => theme.spacing(1),
                            right: (theme) => theme.spacing(1),
                            zIndex: 'notification'
                        }}
                    >
                        <Alert
                            color={notification.color}
                            startDecorator={notification.icon}
                            endDecorator={
                                <IconButton
                                    variant='plain'
                                    size='sm'
                                    color={notification.color}
                                    onClick={(): void => {
                                        setIsOpen(false)
                                    }}
                                >
                                    <CloseRoundedIcon />
                                </IconButton>
                            }
                            ref={ref}
                        >
                            {notification.message}
                        </Alert>
                    </Frame>
                )}
            </AnimatePresence>
        </NotificationContext.Provider>
    )
}
