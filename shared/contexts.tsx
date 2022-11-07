import { createContext } from 'react'

import NFT_MARKETPLACE from '../contracts/nftMarketplace'

interface NftMarketplaceContext {
    address: string
    abi: typeof NFT_MARKETPLACE.abi
}

export const NftMarketplaceContext = createContext<NftMarketplaceContext>({
    address: '',
    abi: NFT_MARKETPLACE.abi
})

interface InterfaceContext {
    openSettingsPanel: () => void
    closeSettingsPanel: () => void
}

export const InterfaceContext = createContext<InterfaceContext>({
    openSettingsPanel: () => void 0,
    closeSettingsPanel: () => void 0
})
