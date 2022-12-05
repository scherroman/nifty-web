import { createContext } from 'react'

interface DashboardContext {
    openSettingsPanel: () => void
    closeSettingsPanel: () => void
}

export const DashboardContext = createContext<DashboardContext>({
    openSettingsPanel: () => void 0,
    closeSettingsPanel: () => void 0
})
