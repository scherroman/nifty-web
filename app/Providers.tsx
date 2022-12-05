'use client'
import '@fontsource/public-sans'

import { FunctionComponent, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import {
    chain as CHAINS,
    configureChains,
    createClient,
    WagmiConfig
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import { MotionConfig } from 'framer-motion'
import { getInitColorSchemeScript } from '@mui/joy/styles'

import { ContractsProvider } from 'nifty/contexts'
import { NotificationProvider } from 'nifty/hooks/useNotify'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const SUBGRAPH_API_ENDPOINT = process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT

if (ALCHEMY_API_KEY === undefined) {
    throw new Error('Missing Alchemy API Key')
}

if (SUBGRAPH_API_ENDPOINT === undefined) {
    throw new Error('Missing Subgraph API Endpoint')
}

let apolloClient = new ApolloClient({
    uri: SUBGRAPH_API_ENDPOINT,
    cache: new InMemoryCache()
})

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

let wagmiClient = createClient({
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

interface Properties {
    children?: ReactNode
}

const Providers: FunctionComponent<Properties> = ({ children }: Properties) => {
    return (
        <>
            {getInitColorSchemeScript()}
            <ApolloProvider client={apolloClient}>
                <QueryClientProvider client={queryClient}>
                    <WagmiConfig client={wagmiClient}>
                        <ContractsProvider>
                            <CssVarsProvider theme={theme} defaultMode='system'>
                                <CssBaseline />
                                <MotionConfig
                                    transition={{
                                        type: 'tween',
                                        duration: 0.2
                                    }}
                                >
                                    <NotificationProvider>
                                        {children}
                                    </NotificationProvider>
                                </MotionConfig>
                            </CssVarsProvider>
                        </ContractsProvider>
                    </WagmiConfig>
                </QueryClientProvider>
            </ApolloProvider>
        </>
    )
}

export default Providers
