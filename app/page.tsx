'use client'

import { useState, useEffect, useContext, FunctionComponent } from 'react'
import { useQuery } from '@apollo/client'
import { useQuery as useRestQuery } from '@tanstack/react-query'
import { useContractWrite } from 'wagmi'

import { Listing, getHydratedListings } from 'nifty/models/listing'
import { ContractsContext } from 'nifty/contexts'
import { useIsMounted, useNotify } from 'nifty/hooks'
import { getNotifications } from 'nifty/hooks/useNotify'
import { graphql } from 'nifty/subgraph/types/gql'
import {
    ETHEREUM_BLOCK_TIME_MILLISECONDS,
    TRANSACTION_FAILED_STATUS
} from 'nifty/constants'

import { Typography } from '@mui/joy'

import { Frame, CircularLoader } from 'nifty/components/atoms'
import {
    ErrorMessage,
    ErrorBoundary,
    ListingCard
} from 'nifty/components/widgets'
import { MINIMUM_LISTING_CARD_WIDTH } from 'nifty/components/widgets/ListingCard'
import { Grid } from 'nifty/components/layouts'

const PURCHASE_NOTIFICATIONS = getNotifications('Purchase')

const ALL_LISTINGS = graphql(`
    query AllListings {
        listings(first: 100, orderBy: createdAt) {
            id
            nft {
                id
                address
                tokenId
            }
            price
        }
    }
`)

const Explore: FunctionComponent = () => {
    return (
        <Frame>
            <Typography level='h3' fontWeight='lg'>
                All listings
            </Typography>
            <Frame sx={{ marginTop: 2 }}>
                <ErrorBoundary>
                    <AllListings />
                </ErrorBoundary>
            </Frame>
        </Frame>
    )
}

const AllListings: FunctionComponent = () => {
    let { nifty, erc721Interface } = useContext(ContractsContext)
    let notify = useNotify()
    let isMounted = useIsMounted()
    let [buyingListing, setBuyingListing] = useState<Listing | null>(null)

    let {
        data,
        loading: isLoadingListings,
        error: didLoadListingsError,
        startPolling
    } = useQuery(ALL_LISTINGS)

    let _listings = data?.listings

    let {
        data: listings,
        isLoading: isHydratingListings,
        isError: didHydrateListingsError,
        refetch: _refetchListings,
        remove: clearListings
    } = useRestQuery({
        queryKey: [{ name: 'allListings', listings: _listings }],
        queryFn: async ({ queryKey }) => {
            let { listings } = queryKey[0]
            return getHydratedListings({ listings, erc721Interface })
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
                notify(PURCHASE_NOTIFICATIONS.failed)
            }
        },
        async onSuccess(transaction) {
            let receipt = await transaction.wait()
            if (receipt.status === TRANSACTION_FAILED_STATUS) {
                notify(PURCHASE_NOTIFICATIONS.failed)
            } else {
                notify(PURCHASE_NOTIFICATIONS.succeeded)
                await refetchListings()
            }
        },
        onSettled() {
            setBuyingListing(null)
        }
    })

    async function refetchListings(): Promise<void> {
        clearListings()
        await _refetchListings()
    }

    useEffect(() => {
        startPolling(ETHEREUM_BLOCK_TIME_MILLISECONDS)
    }, [startPolling])

    let isLoading = isLoadingListings || isHydratingListings
    let didError = didLoadListingsError ?? didHydrateListingsError

    if (!isMounted || isLoading) {
        return <CircularLoader />
    }

    if (didError || !listings) {
        return <ErrorMessage onClose={refetchListings} />
    }

    return (
        <Grid minimumItemWidth={MINIMUM_LISTING_CARD_WIDTH}>
            {listings.map((listing) => (
                <ListingCard
                    listing={listing}
                    // href={`/explore?address=${listing.nft.address}&id=${listing.nft.tokenId}`}
                    isBuyable
                    isLoading={listing === buyingListing}
                    onButtonClick={(): void => {
                        setBuyingListing(listing)
                        buyNft?.({
                            recklesslySetUnpreparedArgs: [
                                listing.nft.address,
                                listing.nft.tokenId
                            ],
                            recklesslySetUnpreparedOverrides: {
                                value: listing.price
                            }
                        })
                    }}
                    key={listing.nft.id}
                />
            ))}
        </Grid>
    )
}

export default Explore
