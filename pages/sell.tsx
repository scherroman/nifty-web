import { useState } from 'react'
import type { NextPage } from 'next'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { Listing, dummyListings, getHydratedListings } from '../models/listing'
import { useIsMounted } from '../shared/hooks'

import SellIcon from '@mui/icons-material/SellOutlined'
import { Typography, Button } from '@mui/joy'

import { Frame, CircularLoader } from '../components/atoms'
import { ErrorMessage, ListingCard } from '../components/widgets'
import { MINIMUM_LISTING_CARD_WIDTH } from '../components/widgets/ListingCard'
import { UpdateListingModal } from '../components/layouts'

const SellPage: NextPage = () => {
    let isMounted = useIsMounted()
    let { address } = useAccount()
    let [updatingListing, setUpdatingListing] = useState<Listing | null>(null)

    let ownedListings = dummyListings.filter(
        (listing) => listing.seller === address
    )

    let {
        data: listings,
        isLoading: isLoadingListings,
        isError: didLoadingListingsError,
        refetch: _refetchListings,
        remove: clearListings
    } = useQuery({
        queryKey: [{ name: 'listings', listings: ownedListings }],
        queryFn: async ({ queryKey }) => {
            let { listings } = queryKey[0]
            return getHydratedListings(listings)
        }
    })

    async function refetchListings(): Promise<void> {
        clearListings()
        await _refetchListings()
    }

    let isLoading = isLoadingListings
    let didError = didLoadingListingsError

    if (isLoading) {
        return <CircularLoader />
    }

    if (didError) {
        return <ErrorMessage onClose={refetchListings} />
    }

    return (
        <Frame>
            {isMounted && listings && (
                <Frame>
                    <Frame
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography level='h3'>
                            {listings.length > 0
                                ? 'Your listings'
                                : 'No listings'}
                        </Typography>
                        <Button startDecorator={<SellIcon />}>
                            Create listing
                        </Button>
                    </Frame>
                    <Frame
                        sx={{
                            display: 'grid',
                            gap: (theme) => theme.spacing(2),
                            gridTemplateColumns: `repeat(auto-fill, minmax(${MINIMUM_LISTING_CARD_WIDTH}, auto))`,
                            marginTop: 2
                        }}
                    >
                        {listings.map((listing) => (
                            <ListingCard
                                listing={listing}
                                // href={`/sell?address=${listing.nft.address}&id=${listing.nft.id}`}
                                isUpdatable
                                onButtonClick={(): void => {
                                    setUpdatingListing(listing)
                                }}
                                key={`${listing.nft.address}-${listing.nft.id}`}
                            />
                        ))}
                    </Frame>
                    {updatingListing && (
                        <UpdateListingModal
                            listing={updatingListing}
                            onClose={(): void => {
                                setUpdatingListing(null)
                            }}
                            onSave={(): void => {
                                setUpdatingListing(null)
                            }}
                        />
                    )}
                </Frame>
            )}
        </Frame>
    )
}

export default SellPage
