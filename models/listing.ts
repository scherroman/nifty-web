import zod from 'zod'
import axios from 'axios'
import { produce } from 'immer'

const IPFS_PROTOCOL_URL_PREFIX = 'ipfs://'
const IPFS_GATEWAY_URL_PREFIX = 'https://ipfs.io/ipfs/'

export interface Listing {
    nft: Nft
    price: string
    seller: string
}

interface Nft {
    symbol: string
    address: string
    id: string
    tokenUri: string
    displayName?: string
    imageUrl?: string
    metadata?: TokenMetadata
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

export async function getHydratedListings(
    listings: Listing[]
): Promise<Listing[]> {
    let hydratedListings = []
    for (let listing of listings) {
        hydratedListings.push(await getHydratedListing(listing))
    }

    return hydratedListings
}

export async function getHydratedListing(listing: Listing): Promise<Listing> {
    let response = await axios.get(
        listing.nft.tokenUri.replace(
            IPFS_PROTOCOL_URL_PREFIX,
            IPFS_GATEWAY_URL_PREFIX
        )
    )
    let metadata = TokenMetadata.parse(response.data)
    let hydratedListing = produce(listing, (draft) => {
        draft.nft.displayName = `${listing.nft.symbol} #${listing.nft.id}`
        draft.nft.metadata = metadata
        draft.nft.imageUrl = metadata.image.replace(
            IPFS_PROTOCOL_URL_PREFIX,
            IPFS_GATEWAY_URL_PREFIX
        )
    })

    return hydratedListing
}

let dummyListing = {
    nft: {
        symbol: 'DOGS',
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        id: '0',
        tokenUri:
            'ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json'
    },
    price: '120000000000000000',
    seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
}

export let dummyListings: Listing[] = [
    dummyListing,
    {
        ...dummyListing,
        nft: {
            ...dummyListing.nft,
            id: '1'
        },
        price: '220000000000000000'
    },
    {
        ...dummyListing,
        nft: {
            ...dummyListing.nft,
            id: '2'
        },
        price: '320000000000000000'
    }
]
