import { createContext } from 'react'

import NIFTY from '../contracts/nifty'

interface NiftyContext {
    address: string
    abi: typeof NIFTY.abi
}

export const NiftyContext = createContext<NiftyContext>({
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
