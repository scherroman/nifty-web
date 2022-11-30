import { createContext } from 'react'

import { NIFTY, ERC721_INTERFACE } from '../../contracts'

export interface ContractsContext {
    nifty: {
        address: string
        abi: typeof NIFTY.abi
    }
    erc721Interface: {
        abi: typeof ERC721_INTERFACE.abi
    }
}

export const ContractsContext = createContext<ContractsContext>({
    nifty: {
        address: '',
        abi: NIFTY.abi
    },
    erc721Interface: {
        abi: ERC721_INTERFACE.abi
    }
})

interface InterfaceContext {
    openSettingsPanel: () => void
    closeSettingsPanel: () => void
}

export const InterfaceContext = createContext<InterfaceContext>({
    openSettingsPanel: () => void 0,
    closeSettingsPanel: () => void 0
})
