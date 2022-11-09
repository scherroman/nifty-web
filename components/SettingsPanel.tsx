import { FunctionComponent, useRef, Fragment } from 'react'
import { useClickAway } from 'react-use'
import { useColorScheme } from '@mui/joy/styles'

import { Box, Stack, IconButton, Typography, Switch, FormLabel } from '@mui/joy'
import CloseIcon from '@mui/icons-material/Close'

import Frame from '../components/Frame'

const SETTINGS_PANEL_WIDTH = 300

interface SettingsPanelProperties {
    onClose(): void
}

const SettingsPanel: FunctionComponent<SettingsPanelProperties> = ({
    onClose
}: SettingsPanelProperties) => {
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
            <style jsx global>{`
                body {
                    overflow: hidden;
                }
            `}</style>
            <Box
                position='fixed'
                top={0}
                right={0}
                width='100%'
                height='100%'
                sx={{
                    bgcolor: 'background.backdrop',
                    backdropFilter: 'blur(8px)',
                    zIndex: 'backdrop'
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
                    padding: 2,
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
                <Stack
                    direction='row'
                    sx={{ justifyContent: 'space-between', marginBottom: 2 }}
                >
                    <Typography level='h5'>Settings</Typography>
                    <IconButton size='sm' color='neutral' variant='plain'>
                        <CloseIcon onClick={(): void => onClose()} />
                    </IconButton>
                </Stack>
                <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
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
