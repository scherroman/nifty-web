import { useState, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useContractWrite } from 'wagmi'

import { Listing, getHydratedListings, dummyListings } from '../models/listing'
import { ContractsContext } from '../shared/contexts'
import { useIsMounted, useNotify } from '../shared/hooks'

import { NextPage } from 'next'
import { Typography } from '@mui/joy'

import { Frame, CircularLoader } from '../components/atoms'
import { ErrorMessage, ListingCard } from '../components/widgets'
import { MINIMUM_LISTING_CARD_WIDTH } from '../components/widgets/ListingCard'

const Home: NextPage = () => {
    let { nifty } = useContext(ContractsContext)
    let notify = useNotify()
    let isMounted = useIsMounted()
    let [buyingListing, setBuyingListing] = useState<Listing | null>(null)

    let {
        data: listings,
        isLoading: isLoadingListings,
        isError: didLoadingListingsError,
        refetch: _refetchListings,
        remove: clearListings
    } = useQuery({
        queryKey: [{ name: 'listings', listings: dummyListings }],
        queryFn: async ({ queryKey }) => {
            let { listings } = queryKey[0]
            return getHydratedListings(listings)
        }
    })
    let { write: buyNft } = useContractWrite({
        address: nifty.address,
        abi: nifty.abi,
        functionName: 'buyNft',
        mode: 'recklesslyUnprepared',
        onError(error) {
            console.log(error)
            if (!error.message.includes('ACTION_REJECTED')) {
                notify({ message: 'Transaction failed', type: 'error' })
            }
        },
        async onSuccess(transaction) {
            await transaction.wait(1)
            notify({ message: 'Transaction successful', type: 'success' })
        },
        onSettled() {
            setBuyingListing(null)
        }
    })

    async function refetchListings(): Promise<void> {
        clearListings()
        await _refetchListings()
    }

    let isLoading = isLoadingListings
    let didError = didLoadingListingsError

    if (!isMounted || isLoading) {
        return <CircularLoader />
    }

    if (didError || !listings) {
        return <ErrorMessage onClose={refetchListings} />
    }

    return (
        <Frame>
            <Typography level='h3' fontWeight='lg'>
                All listings
            </Typography>
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
                        // href={`/explore?address=${listing.nft.address}&id=${listing.nft.id}`}
                        isBuyable
                        isLoading={listing === buyingListing}
                        onButtonClick={(): void => {
                            setBuyingListing(listing)
                            buyNft?.({
                                recklesslySetUnpreparedArgs: [
                                    listing.nft.address,
                                    listing.nft.id
                                ],
                                recklesslySetUnpreparedOverrides: {
                                    value: listing.price
                                }
                            })
                        }}
                        key={`${listing.nft.address}-${listing.nft.id}`}
                    />
                ))}
            </Frame>
        </Frame>
    )
}

export default Home
