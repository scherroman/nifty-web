import zod from 'zod'
import { FunctionComponent, useRef, Fragment } from 'react'

import { useClickAway } from 'react-use'
import { useColorScheme } from '@mui/joy/styles'
import { useLockBodyScroll } from 'react-use'

import CloseIcon from '@mui/icons-material/CloseRounded'
import { Stack, IconButton, Typography, FormLabel } from '@mui/joy'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import Brightness4Icon from '@mui/icons-material/Brightness4'

import { Frame } from 'nifty/components/atoms'
import { SegmentedControl } from 'nifty/components/atoms'

const WIDTH = 300

const ColorMode = zod.enum(['light', 'dark', 'system'] as const)

interface Properties {
    onClose(): void
}

const SettingsPanel: FunctionComponent<Properties> = ({
    onClose
}: Properties) => {
    useLockBodyScroll()
    let { mode: colorMode, setMode: setColorMode } = useColorScheme()
    let ref = useRef(null)

    useClickAway(
        ref,
        () => {
            onClose()
        },
        ['mouseup']
    )

    return (
        <Fragment>
            <Frame
                variant='outlined'
                color='neutral'
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${WIDTH}px`,
                    borderRight: 0,
                    borderTop: 0,
                    borderBottom: 0,
                    backgroundColor: 'body',
                    zIndex: 'drawer'
                }}
                initial={{ x: WIDTH }}
                animate={{ x: 0 }}
                exit={{ x: WIDTH }}
                ref={ref}
            >
                <Frame
                    variant='outlined'
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 2,
                        borderLeft: 0,
                        borderRight: 0,
                        borderTop: 0
                    }}
                >
                    <Typography level='h5'>Settings</Typography>
                    <IconButton
                        size='sm'
                        color='neutral'
                        variant='plain'
                        aria-label='close'
                    >
                        <CloseIcon onClick={(): void => onClose()} />
                    </IconButton>
                </Frame>
                <Stack direction='column' sx={{ padding: 2 }}>
                    <FormLabel>Appearance</FormLabel>
                    <SegmentedControl
                        options={[
                            {
                                label: 'Light',
                                icon: <LightModeIcon />,
                                selected: colorMode === 'light',
                                key: 'light'
                            },
                            {
                                label: 'System',
                                icon: <Brightness4Icon />,
                                selected: colorMode === 'system',
                                key: 'system'
                            },
                            {
                                label: 'Dark',
                                icon: <DarkModeIcon />,
                                selected: colorMode === 'dark',
                                key: 'dark'
                            }
                        ]}
                        sx={{ marginTop: 1 }}
                        onSelect={(option): void => {
                            setColorMode(ColorMode.parse(option.key))
                        }}
                    />
                </Stack>
            </Frame>
            <Frame
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    bgcolor: 'background.backdrop',
                    backdropFilter: 'blur(8px)',
                    zIndex: 'drawerBackdrop'
                }}
            />
        </Fragment>
    )
}

export default SettingsPanel
