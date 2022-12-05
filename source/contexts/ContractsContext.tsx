import {
    createContext,
    ReactNode,
    FunctionComponent,
    useState,
    useEffect
} from 'react'
import { useNetwork } from 'wagmi'

import { produce } from 'immer'

import { NIFTY, ERC721_INTERFACE } from 'nifty/contracts'

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

interface Properties {
    children?: ReactNode
}

export const ContractsProvider: FunctionComponent<Properties> = ({
    children
}: Properties) => {
    let { chain } = useNetwork()
    let chainId = chain?.id ?? ''
    let niftyAddress =
        chainId in NIFTY.addresses ? NIFTY.addresses[chainId] : ''
    let [contracts, setContracts] = useState({
        nifty: {
            address: niftyAddress,
            abi: NIFTY.abi
        },
        erc721Interface: {
            abi: ERC721_INTERFACE.abi
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
        <ContractsContext.Provider value={contracts}>
            {children}
        </ContractsContext.Provider>
    )
}
