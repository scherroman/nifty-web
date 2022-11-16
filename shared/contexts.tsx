import { createContext } from 'react'

import NIFTY from '../contracts/nifty'
import IERC721 from '../contracts/ierc721'

interface ContractsContext {
    nifty: {
        address: string
        abi: typeof NIFTY.abi
    }
    ierc721: {
        abi: typeof IERC721.abi
    }
}

export const ContractsContext = createContext<ContractsContext>({
    nifty: {
        address: '',
        abi: NIFTY.abi
    },
    ierc721: {
        abi: IERC721.abi
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
