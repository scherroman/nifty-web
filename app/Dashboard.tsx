'use client'

import {
    ReactNode,
    FunctionComponent,
    useState,
    useContext,
    useCallback
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

import { ContractsContext, DashboardContext } from 'nifty/contexts'
import { useIsMounted } from 'nifty/hooks'

import { Frame } from 'nifty/components/atoms'
import Header, {
    HEIGHT as HEADER_HEIGHT
} from 'nifty/components/layouts/Header'
import SettingsPanel from 'nifty/components/layouts/SettingsPanel'

interface Properties {
    children?: ReactNode
}

const Dashboard: FunctionComponent<Properties> = ({ children }) => {
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
        <DashboardContext.Provider
            value={{
                openSettingsPanel,
                closeSettingsPanel
            }}
        >
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
        </DashboardContext.Provider>
    )
}

export default Dashboard
