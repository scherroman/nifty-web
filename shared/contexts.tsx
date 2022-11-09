import { createContext } from 'react'

import NIFTY from '../contracts/nftMarketplace'

interface NftMarketplaceContext {
    address: string
    abi: typeof NIFTY.abi
}

export const NftMarketplaceContext = createContext<NftMarketplaceContext>({
    address: '',
    abi: NIFTY.abi
})

interface InterfaceContext {
    openSettingsPanel: () => void
    closeSettingsPanel: () => void
}

export const InterfaceContext = createContext<InterfaceContext>({
    openSettingsPanel: () => void 0,
    closeSettingsPanel: () => void 0
})
