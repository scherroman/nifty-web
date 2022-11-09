import {
    FunctionComponent,
    useState,
    useContext,
    useCallback,
    Fragment
} from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { InterfaceContext } from '../shared/contexts'
import { useIsMounted } from '../shared/hooks'
import { SxProps } from '@mui/joy/styles/types'

import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
    Stack,
    Typography,
    Button,
    IconButton,
    MenuItem,
    ListItemDecorator
} from '@mui/joy'

import Menu from './Menu'
import Frame from './Frame'
import NavigationTab from './NavigationTab'

const DESKTOP_LEFT_HALF_MARGIN = { mobile: 0, tablet: 0.5 }
const MOBILE_TOP_MARGIN = { mobile: 1, tablet: 0 }

interface HeaderProperties {
    sx?: SxProps
}

const Header: FunctionComponent<HeaderProperties> = ({
    sx
}: HeaderProperties) => {
    let { openSettingsPanel } = useContext(InterfaceContext)
    let isMounted = useIsMounted()
    let { address, isConnected, isConnecting } = useAccount()
    let { connect, connectors } = useConnect()
    let { disconnect } = useDisconnect()
    let [accountDropdownAnchorElement, setAccountDropdownAnchorElement] =
        useState<null | HTMLElement>(null)
    let [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false)

    let closeAccountDropdownMenu = useCallback(() => {
        setAccountDropdownAnchorElement(null)
        setIsAccountDropdownOpen(false)
    }, [])

    let handleAccountDropdownClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            if (isAccountDropdownOpen) {
                closeAccountDropdownMenu()
            } else {
                setAccountDropdownAnchorElement(event.currentTarget)
                setIsAccountDropdownOpen(true)
            }
        },
        [isAccountDropdownOpen, closeAccountDropdownMenu]
    )

    let connector = connectors[0]

    return (
        <Frame
            variant='outlined'
            sx={{
                display: 'flex',
                flexDirection: { mobile: 'column', tablet: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1,
                minHeight: '57px',
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
                ...sx
            }}
        >
            <Stack direction={{ mobile: 'column', tablet: 'row' }}>
                <NavigationTab title='Explore' href='/' />
                <NavigationTab
                    title='Sell'
                    href='/sell'
                    sx={{
                        marginLeft: DESKTOP_LEFT_HALF_MARGIN,
                        marginTop: MOBILE_TOP_MARGIN
                    }}
                />
            </Stack>

            <Stack direction={{ mobile: 'column', tablet: 'row' }}>
                {isMounted && (
                    <Stack
                        direction='row'
                        sx={{
                            alignItems: 'center',
                            marginTop: MOBILE_TOP_MARGIN
                        }}
                    >
                        {isConnected ? (
                            <Fragment>
                                <Button
                                    variant='outlined'
                                    color='neutral'
                                    size='sm'
                                    endDecorator={<KeyboardArrowDownIcon />}
                                    disabled={isAccountDropdownOpen}
                                    onClick={(event): void =>
                                        handleAccountDropdownClick(event)
                                    }
                                >
                                    <Typography
                                        noWrap
                                        level='body2'
                                        width='120px'
                                    >
                                        {address}
                                    </Typography>
                                </Button>
                                <Menu
                                    anchorEl={accountDropdownAnchorElement}
                                    open={Boolean(accountDropdownAnchorElement)}
                                    onClose={(): void =>
                                        closeAccountDropdownMenu()
                                    }
                                >
                                    <MenuItem
                                        onClick={(): void => {
                                            closeAccountDropdownMenu()
                                            disconnect()
                                        }}
                                    >
                                        <ListItemDecorator>
                                            <LogoutIcon />
                                        </ListItemDecorator>
                                        Disconnect
                                    </MenuItem>
                                </Menu>
                            </Fragment>
                        ) : (
                            <Button
                                size='sm'
                                variant='solid'
                                color='primary'
                                loading={isConnecting}
                                loadingIndicator='Connecting...'
                                sx={{ marginLeft: 1 }}
                                onClick={(): void => connect({ connector })}
                            >
                                Connect
                            </Button>
                        )}
                    </Stack>
                )}
                <IconButton
                    variant='outlined'
                    color='neutral'
                    size='sm'
                    sx={{
                        marginLeft: 1,
                        display: { mobile: 'none', tablet: 'inline-flex' }
                    }}
                    onClick={(): void => openSettingsPanel()}
                >
                    <SettingsIcon />
                </IconButton>
                <Button
                    color='neutral'
                    variant='outlined'
                    size='sm'
                    startDecorator={<SettingsIcon />}
                    sx={{
                        marginTop: 1,
                        display: { mobile: 'inline-flex', tablet: 'none' }
                    }}
                    onClick={(): void => openSettingsPanel()}
                >
                    Settings
                </Button>
            </Stack>
        </Frame>
    )
}

export default Header
