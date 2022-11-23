import {
    useState,
    useContext,
    useCallback,
    ReactNode,
    FunctionComponent
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useIsMounted } from '../../shared/hooks'

import { ContractsContext } from '../../shared/contexts'
import { InterfaceContext } from '../../shared/contexts'

import Head from 'next/head'

import { Frame } from '../atoms'
import Header, { HEIGHT as HEADER_HEIGHT } from './Header'
import SettingsPanel from './SettingsPanel'

interface LayoutProperties {
    children?: ReactNode
}

const Layout: FunctionComponent<LayoutProperties> = ({ children }) => {
    let isMounted = useIsMounted()
    let { isConnected } = useAccount()
    let { nifty } = useContext(ContractsContext)
    let [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)

    let openSettingsPanel = useCallback(() => {
        setIsSettingsPanelOpen(true)
    }, [])

    let closeSettingsPanel = useCallback(() => {
        setIsSettingsPanelOpen(false)
    }, [])

    let message = ''
    if (!isConnected) {
        message = 'Connect to get started!'
    } else if (nifty.address === '') {
        message = 'Nifty smart contract not found'
    }

    return (
        <InterfaceContext.Provider
            value={{
                openSettingsPanel,
                closeSettingsPanel
            }}
        >
            <Head>
                <title>Nifty</title>
                <meta
                    name='description'
                    content='A nifty marketplace for NFTs'
                />
                <meta
                    name='viewport'
                    content='initial-scale=1, width=device-width'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Header />
            <Frame sx={{ paddingTop: HEADER_HEIGHT }}>
                {isMounted &&
                    (isConnected && nifty.address ? (
                        <Frame sx={{ padding: 2 }}>{children}</Frame>
                    ) : (
                        <Frame
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: `calc(100vh - ${HEADER_HEIGHT})`
                            }}
                        >
                            {message}
                        </Frame>
                    ))}
            </Frame>
            <AnimatePresence>
                {isSettingsPanelOpen && (
                    <SettingsPanel
                        onClose={(): void => setIsSettingsPanelOpen(false)}
                    />
                )}
            </AnimatePresence>
        </InterfaceContext.Provider>
    )
}

export default Layout
