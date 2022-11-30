import { useState, useEffect, useContext } from 'react'
import type { NextPage } from 'next'
import { useQuery } from '@apollo/client'
import { useQuery as useRestQuery } from '@tanstack/react-query'
import { useAccount, useContractRead } from 'wagmi'
import { useToggle } from 'react-use'
import { BigNumber } from 'ethers'
import { graphql } from '../subgraph/types/gql'

import { Listing, getHydratedListings } from '../source/models/listing'
import { useIsMounted } from '../source/shared/hooks'
import { ContractsContext } from '../source/shared/contexts'
import { ETHEREUM_BLOCK_TIME_MILLISECONDS } from '../source/shared/constants'

import AddIcon from '@mui/icons-material/Add'
import { Typography, Button } from '@mui/joy'

import { Frame, CircularLoader } from '../source/components/atoms'
import {
    ErrorMessage,
    ListingCard,
    ProceedsCard
} from '../source/components/widgets'
import { MINIMUM_LISTING_CARD_WIDTH } from '../source/components/widgets/ListingCard'
import {
    Grid,
    UpdateListingModal,
    CreateListingModal
} from '../source/components/layouts'

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

const SellPage: NextPage = () => {
    let { nifty, erc721Interface } = useContext(ContractsContext)
    let isMounted = useIsMounted()
    let { address: userAddress } = useAccount()
    let [updatingListing, setUpdatingListing] = useState<Listing | null>(null)
    let [isCreatingListing, toggleIsCreatingListing] = useToggle(false)

    let {
        data: _proceeds,
        isLoading: isLoadingProceeds,
        isError: didLoadingProceedsError
    } = useContractRead({
        address: nifty.address,
        abi: nifty.abi,
        functionName: 'proceeds',
        args: [userAddress],
        watch: true
    })

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

    let proceeds: BigNumber | undefined
    if (BigNumber.isBigNumber(_proceeds)) {
        proceeds = _proceeds
    }

    let isLoading =
        isLoadingProceeds || isLoadingListings || isHydratingListings
    let didError =
        didLoadingProceedsError ||
        Boolean(loadListingsError) ||
        didHydratingListingsError

    if (!isMounted || isLoading) {
        return <CircularLoader />
    }

    if (didError || proceeds === undefined || !listings) {
        return <ErrorMessage onClose={refetchListings} />
    }

    return (
        <Frame>
            <Grid minimumItemWidth='200px' spacing={2}>
                <ProceedsCard proceeds={proceeds} />
            </Grid>
            <Frame>
                <Frame
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 2
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
                    spacing={2}
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
        </Frame>
    )
}

export default SellPage
