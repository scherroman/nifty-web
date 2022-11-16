import { FunctionComponent, useRef, Fragment } from 'react'

import { useClickAway } from 'react-use'
import { useColorScheme } from '@mui/joy/styles'
import { useLockBodyScroll } from 'react-use'

import CloseIcon from '@mui/icons-material/CloseRounded'
import { Stack, IconButton, Typography, Switch, FormLabel } from '@mui/joy'

import { Frame } from '../atoms'

const SETTINGS_PANEL_WIDTH = 300

interface SettingsPanelProperties {
    onClose(): void
}

const SettingsPanel: FunctionComponent<SettingsPanelProperties> = ({
    onClose
}: SettingsPanelProperties) => {
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
                sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'background.backdrop',
                    backdropFilter: 'blur(8px)',
                    zIndex: 'drawerBackdrop'
                }}
            />
            <Frame
                variant='outlined'
                color='neutral'
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: `${SETTINGS_PANEL_WIDTH}px`,
                    borderRight: 0,
                    borderTop: 0,
                    borderBottom: 0,
                    zIndex: 'drawer'
                }}
                initial={{ x: SETTINGS_PANEL_WIDTH }}
                animate={{ x: 0 }}
                exit={{ x: SETTINGS_PANEL_WIDTH }}
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
                    <IconButton size='sm' color='neutral' variant='plain'>
                        <CloseIcon onClick={(): void => onClose()} />
                    </IconButton>
                </Frame>
                <Stack
                    direction='row'
                    sx={{ justifyContent: 'space-between', padding: 2 }}
                >
                    <FormLabel>Dark mode</FormLabel>
                    <Switch
                        checked={colorMode === 'dark'}
                        onClick={(): void => {
                            setColorMode(
                                colorMode === 'light' ? 'dark' : 'light'
                            )
                        }}
                    />
                </Stack>
            </Frame>
        </Fragment>
    )
}

export default SettingsPanel
