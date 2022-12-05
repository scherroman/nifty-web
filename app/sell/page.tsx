'use client'

import { useState, useEffect, useContext, FunctionComponent } from 'react'
import { useQuery } from '@apollo/client'
import { useQuery as useRestQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useToggle } from 'react-use'

import { Listing, getHydratedListings } from 'nifty/models/listing'
import { useIsMounted } from 'nifty/hooks'
import { ContractsContext } from 'nifty/contexts'
import { graphql } from 'nifty/subgraph/types/gql'
import { ETHEREUM_BLOCK_TIME_MILLISECONDS } from 'nifty/constants'

import AddIcon from '@mui/icons-material/Add'
import { Typography, Button } from '@mui/joy'

import { Frame, CircularLoader } from 'nifty/components/atoms'
import {
    ErrorMessage,
    ErrorBoundary,
    ListingCard
} from 'nifty/components/widgets'
import { MINIMUM_LISTING_CARD_WIDTH } from 'nifty/components/widgets/ListingCard'
import ProceedsCard from './ProceedsCard'
import {
    Grid,
    UpdateListingModal,
    CreateListingModal
} from 'nifty/components/layouts'

const USER_LISTINGS = graphql(`
    query getUserListings($seller: Bytes!) {
        listings(first: 100, orderBy: createdAt, where: { seller: $seller }) {
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

const SellPage: FunctionComponent = () => {
    return (
        <Frame>
            <ErrorBoundary>
                <Grid minimumItemWidth='200px'>
                    <ProceedsCard />
                </Grid>
            </ErrorBoundary>
            <Frame sx={{ marginTop: 2 }}>
                <ErrorBoundary>
                    <UserListings />
                </ErrorBoundary>
            </Frame>
        </Frame>
    )
}

const UserListings: FunctionComponent = () => {
    let { erc721Interface } = useContext(ContractsContext)
    let isMounted = useIsMounted()
    let { address: userAddress } = useAccount()
    let [updatingListing, setUpdatingListing] = useState<Listing | null>(null)
    let [isCreatingListing, toggleIsCreatingListing] = useToggle(false)

    let {
        data,
        loading: isLoadingListings,
        error: loadListingsError,
        startPolling
    } = useQuery(USER_LISTINGS, {
        variables: { seller: userAddress }
    })

    let ownedListings = data?.listings

    let {
        data: listings,
        isLoading: isHydratingListings,
        isError: didHydratingListingsError,
        refetch: _refetchListings,
        remove: clearListings
    } = useRestQuery({
        queryKey: [{ name: 'userListings', listings: ownedListings }],
        queryFn: async ({ queryKey }) => {
            let { listings } = queryKey[0]
            return getHydratedListings({ listings, erc721Interface })
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
    let didError = Boolean(loadListingsError) || didHydratingListingsError

    if (!isMounted || isLoading) {
        return <CircularLoader />
    }

    if (didError || !listings) {
        return <ErrorMessage onClose={refetchListings} />
    }

    return (
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
                    {listings.length > 0 ? 'Your listings' : 'No listings'}
                </Typography>
                <Button
                    variant='outlined'
                    startDecorator={<AddIcon />}
                    onClick={toggleIsCreatingListing}
                >
                    Create listing
                </Button>
            </Frame>
            <Grid
                minimumItemWidth={MINIMUM_LISTING_CARD_WIDTH}
                sx={{
                    marginTop: 2
                }}
            >
                {listings.map((listing) => (
                    <ListingCard
                        listing={listing}
                        // href={`/sell?address=${listing.nft.address}&id=${listing.nft.tokenId}`}
                        isUpdatable
                        onButtonClick={(): void => {
                            setUpdatingListing(listing)
                        }}
                        key={listing.nft.id}
                    />
                ))}
            </Grid>
            {updatingListing && (
                <UpdateListingModal
                    listing={updatingListing}
                    onSave={async (): Promise<void> => {
                        setUpdatingListing(null)
                        await refetchListings()
                    }}
                    onClose={(): void => {
                        setUpdatingListing(null)
                    }}
                />
            )}
            {isCreatingListing && (
                <CreateListingModal
                    onList={async (): Promise<void> => {
                        toggleIsCreatingListing()
                        await refetchListings()
                    }}
                    onClose={toggleIsCreatingListing}
                />
            )}
        </Frame>
    )
}

export default SellPage
