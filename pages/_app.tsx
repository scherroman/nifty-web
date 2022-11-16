import { produce } from 'immer'
import { FunctionComponent, useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
    chain as CHAINS,
    configureChains,
    createClient,
    WagmiConfig,
    useNetwork
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import { MotionConfig } from 'framer-motion'

import { ContractsContext } from '../shared/contexts'
import { NotificationProvider } from '../shared/hooks/useNotify'
import { NIFTY, IERC721 } from '../contracts'

import { Layout } from '../components/layouts'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

if (ALCHEMY_API_KEY === undefined) {
    throw new Error('Missing Alchemy API Key')
}

let queryClient = new QueryClient()

let { provider, webSocketProvider } = configureChains(
    [CHAINS.mainnet, CHAINS.goerli, CHAINS.hardhat],
    [
        alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
        jsonRpcProvider({
            rpc: (chain) => {
                if (chain.id !== CHAINS.hardhat.id) return null
                return { http: chain.rpcUrls.default }
            }
        })
    ]
)

let client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider
})

interface ZindexOptions {
    navbar: number
    drawerBackdrop: number
    drawer: number
    modalBackdrop: number
    modal: number
    tooltip: number
    notification: number
}

declare module '@mui/joy/styles' {
    interface BreakpointOverrides {
        xs: false
        sm: false
        md: false
        lg: false
        xl: false
        mobile: true
        tablet: true
        laptop: true
        desktop: true
    }
    interface Theme {
        zIndex: ZindexOptions
    }
    interface CssVarsThemeOptions {
        zIndex?: ZindexOptions
    }
}

let theme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                background: {
                    surface: 'var(--joy-palette-neutral-900)'
                }
            }
        }
    },
    breakpoints: {
        values: {
            mobile: 0,
            tablet: 640,
            laptop: 1024,
            desktop: 1200
        }
    },
    zIndex: {
        navbar: 9,
        drawerBackdrop: 10,
        drawer: 11,
        modalBackdrop: 12,
        modal: 13,
        tooltip: 14,
        notification: 15
    }
})

const App: FunctionComponent<AppProps> = ({
    Component,
    pageProps
}: AppProps) => {
    let { chain } = useNetwork()
    let chainId = chain?.id ?? ''
    let niftyAddress =
        chainId in NIFTY.addresses ? NIFTY.addresses[chainId] : ''
    let [contracts, setContracts] = useState({
        nifty: {
            address: niftyAddress,
            abi: NIFTY.abi
        },
        ierc721: {
            abi: IERC721.abi
        }
    })

    useEffect(() => {
        setContracts(
            produce((draft) => {
                draft.nifty.address = niftyAddress
            })
        )
    }, [niftyAddress])

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiConfig client={client}>
                <ContractsContext.Provider value={contracts}>
                    <CssVarsProvider theme={theme}>
                        <CssBaseline />
                        <MotionConfig
                            transition={{ type: 'tween', duration: 0.2 }}
                        >
                            <NotificationProvider>
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                            </NotificationProvider>
                        </MotionConfig>
                    </CssVarsProvider>
                </ContractsContext.Provider>
            </WagmiConfig>
        </QueryClientProvider>
    )
}

export default App
