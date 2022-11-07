import { FunctionComponent, useContext } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { InterfaceContext } from '../shared/contexts'
import { useIsMounted } from '../shared/hooks'

import { Box, Stack, Typography, Button, IconButton, Tooltip } from '@mui/joy'
import SettingsIcon from '@mui/icons-material/Settings'
import { SxProps } from '@mui/joy/styles/types'

import Frame from './Frame'

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

    let connector = connectors[0]

    return (
        <Frame
            variant='outlined'
            sx={{
                display: 'flex',
                flexDirection: { mobile: 'column', tablet: 'row' },
                justifyContent: 'space-between',
                padding: 1,
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
                ...sx
            }}
        >
            <Typography level='h4' marginLeft={1}>
                Nft Marketplace
            </Typography>
            {isMounted && (
                <Stack direction='row' sx={{ alignItems: 'center' }}>
                    {isConnected && (
                        <Tooltip title={address}>
                            <Box
                                width='120px'
                                overflow='hidden'
                                textOverflow='ellipsis'
                            >
                                <Typography noWrap level='body2'>
                                    {address}
                                </Typography>
                            </Box>
                        </Tooltip>
                    )}
                    <Button
                        size='sm'
                        variant={isConnected ? 'soft' : 'solid'}
                        color={isConnected ? 'neutral' : 'primary'}
                        loading={isConnecting}
                        loadingIndicator='Connecting...'
                        sx={{ marginLeft: 1 }}
                        onClick={(): void =>
                            isConnected ? disconnect() : connect({ connector })
                        }
                    >
                        {isConnected ? 'Disconnect' : 'Connect'}
                    </Button>
                    <IconButton
                        color='neutral'
                        variant='plain'
                        size='sm'
                        sx={{ marginLeft: 1 }}
                        onClick={(): void => openSettingsPanel()}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Stack>
            )}
        </Frame>
    )
}

export default Header
