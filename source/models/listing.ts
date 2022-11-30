import zod from 'zod'
import axios from 'axios'
import { BigNumber } from 'ethers'
import { readContract } from 'wagmi/actions'

import { ContractsContext } from '../shared/contexts'

const IPFS_PROTOCOL_URL_PREFIX = 'ipfs://'
const IPFS_GATEWAY_URL_PREFIX = 'https://ipfs.io/ipfs/'

interface UnhydratedListing {
    id: string
    nft: UnhydratedNft
    price: BigNumber
    seller?: string
}

interface UnhydratedNft {
    id: string
    address: string
    tokenId: BigNumber
}

export interface Listing extends UnhydratedListing {
    nft: Nft
    price: BigNumber
}

interface Nft extends UnhydratedNft {
    symbol: string
    tokenUri: string
    displayName: string
    imageUrl: string
    metadata: TokenMetadata
}

const TokenAttribute = zod
    .object({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        trait_type: zod.string(),
        value: zod.number()
    })
    .transform((attribute) => {
        let { trait_type: traitType, ...rest } = attribute
        return {
            traitType,
            ...rest
        }
    })

export const TokenMetadata = zod.object({
    name: zod.string(),
    description: zod.string(),
    image: zod.string(),
    attributes: zod.array(TokenAttribute)
})

type TokenMetadata = zod.TypeOf<typeof TokenMetadata>

export async function getHydratedListings({
    listings,
    erc721Interface
}: {
    listings: UnhydratedListing[] | undefined
    erc721Interface: ContractsContext['erc721Interface']
}): Promise<Listing[] | null> {
    if (listings === undefined) {
        return null
    }

    let hydratedListings = []
    for (let listing of listings) {
        hydratedListings.push(
            await getHydratedListing({ listing, erc721Interface })
        )
    }

    return hydratedListings
}

async function getHydratedListing({
    listing,
    erc721Interface
}: {
    listing: UnhydratedListing
    erc721Interface: ContractsContext['erc721Interface']
}): Promise<Listing> {
    let _symbol = await readContract({
        address: listing.nft.address,
        abi: erc721Interface.abi,
        functionName: 'symbol'
    })
    let _tokenUri = await readContract({
        address: listing.nft.address,
        abi: erc721Interface.abi,
        functionName: 'tokenURI',
        args: [listing.nft.tokenId]
    })
    let symbol = zod.string().parse(_symbol)
    let tokenUri = zod.string().parse(_tokenUri)
    let response = await axios.get(
        tokenUri.replace(IPFS_PROTOCOL_URL_PREFIX, IPFS_GATEWAY_URL_PREFIX)
    )
    let metadata = TokenMetadata.parse(response.data)
    let hydratedListing: Listing = {
        ...listing,
        nft: {
            ...listing.nft,
            symbol,
            tokenUri,
            displayName: `${symbol} #${listing.nft.tokenId}`,
            imageUrl: metadata.image.replace(
                IPFS_PROTOCOL_URL_PREFIX,
                IPFS_GATEWAY_URL_PREFIX
            ),
            metadata
        }
    }

    return hydratedListing
}
