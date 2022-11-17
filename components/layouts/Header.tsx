import {
    FunctionComponent,
    useState,
    useContext,
    useCallback,
    Fragment
} from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { InterfaceContext } from '../../shared/contexts'
import { useIsMounted } from '../../shared/hooks'
import { useToggle } from 'react-use'
import { SxProps } from '@mui/joy/styles/types'

import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
    Stack,
    Typography,
    Button,
    IconButton,
    MenuItem,
    ListItemDecorator,
    Divider
} from '@mui/joy'
import Link from 'next/link'

import { Frame, NavigationTab } from '../atoms'
import { Menu } from '../widgets'
import { formatAddressForDisplay } from '../../shared/utilities/strings'

export const HEIGHT = '57px'
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
    let [isExpanded, toggleIsExpanded] = useToggle(false)

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
                position: 'fixed',
                width: '100%',
                minHeight: HEIGHT,
                display: 'flex',
                flexDirection: { mobile: 'column', tablet: 'row' },
                alignItems: 'center',
                justifyContent: { mobile: 'center', tablet: null },
                padding: 1,
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
                bgcolor: 'background.body',
                zIndex: 'navbar',
                ...sx
            }}
        >
            <Frame
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <Stack direction='row' sx={{ alignItems: 'center' }}>
                    <IconButton
                        variant='outlined'
                        color='neutral'
                        size='sm'
                        sx={{
                            marginLeft: 1,
                            display: { mobile: 'inline-flex', tablet: 'none' }
                        }}
                        onClick={toggleIsExpanded}
                    >
                        {isExpanded ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Link href='/'>
                        <a style={{ textDecoration: 'none' }}>
                            <Typography
                                level='h5'
                                fontWeight='lg'
                                sx={{ marginLeft: 1 }}
                            >
                                Nifty
                            </Typography>
                        </a>
                    </Link>
                    <Divider
                        orientation='vertical'
                        sx={{
                            marginLeft: 2,
                            display: { mobile: 'none', tablet: 'block' }
                        }}
                    />
                    <NavigationTabs
                        sx={{
                            marginLeft: 2,
                            display: {
                                mobile: 'none',
                                tablet: 'flex'
                            }
                        }}
                    />
                </Stack>
                <Stack direction='row' sx={{ alignItems: 'center' }}>
                    {isMounted && (
                        <Stack
                            direction='row'
                            sx={{
                                alignItems: 'center'
                            }}
                        >
                            {isConnected ? (
                                <Fragment>
                                    <Button
                                        variant='outlined'
                                        color='neutral'
                                        size='sm'
                                        endDecorator={
                                            isAccountDropdownOpen ? (
                                                <KeyboardArrowUpIcon />
                                            ) : (
                                                <KeyboardArrowDownIcon />
                                            )
                                        }
                                        disabled={isAccountDropdownOpen}
                                        onClick={(event): void =>
                                            handleAccountDropdownClick(event)
                                        }
                                    >
                                        <Typography noWrap level='body2'>
                                            {formatAddressForDisplay(address)}
                                        </Typography>
                                    </Button>

                                    <Menu
                                        anchorEl={accountDropdownAnchorElement}
                                        open={Boolean(
                                            accountDropdownAnchorElement
                                        )}
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
                                    disabled={isConnecting}
                                    sx={{ marginLeft: 1 }}
                                    onClick={(): void => connect({ connector })}
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect'}
                                </Button>
                            )}
                        </Stack>
                    )}
                    <IconButton
                        variant='outlined'
                        color='neutral'
                        size='sm'
                        sx={{
                            marginLeft: 1
                        }}
                        onClick={(): void => openSettingsPanel()}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Stack>
            </Frame>
            <NavigationTabs
                onSelect={(): void => {
                    console.log('toggled')
                    toggleIsExpanded()
                }}
                sx={{
                    marginTop: 1,
                    display: {
                        mobile: isExpanded ? 'flex' : 'none',
                        tablet: 'none'
                    }
                }}
            />
        </Frame>
    )
}

interface NavigationTabsProperties {
    sx?: SxProps
    onSelect?: () => void
}

const NavigationTabs: FunctionComponent<NavigationTabsProperties> = ({
    sx,
    onSelect = (): void => void 0
}: NavigationTabsProperties) => {
    return (
        <Stack
            direction={{ mobile: 'column', tablet: 'row' }}
            sx={{
                alignItems: 'center',
                ...sx
            }}
        >
            <NavigationTab title='Explore' href='/' onClick={onSelect} />
            <NavigationTab
                title='Sell'
                href='/sell'
                onClick={onSelect}
                sx={{
                    marginLeft: DESKTOP_LEFT_HALF_MARGIN,
                    marginTop: MOBILE_TOP_MARGIN
                }}
            />
        </Stack>
    )
}

export default Header
