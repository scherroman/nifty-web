import { useState, useContext } from 'react'
import type { NextPage } from 'next'
import { useQuery } from '@tanstack/react-query'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { useToggle } from 'react-use'
import { ethers, BigNumber } from 'ethers'

import { Listing, dummyListings, getHydratedListings } from '../models/listing'
import { useIsMounted, useNotify } from '../shared/hooks'

import AddIcon from '@mui/icons-material/Add'
import { Typography, Button } from '@mui/joy'

import { ContractsContext } from '../shared/contexts'

import { Frame, CircularLoader } from '../components/atoms'
import { ErrorMessage, Card, ListingCard } from '../components/widgets'
import { MINIMUM_LISTING_CARD_WIDTH } from '../components/widgets/ListingCard'
import {
    Grid,
    UpdateListingModal,
    CreateListingModal
} from '../components/layouts'

const SellPage: NextPage = () => {
    let { nifty } = useContext(ContractsContext)
    let isMounted = useIsMounted()
    let notify = useNotify()
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

    let { isLoading: isWithdrawing, write: withdrawProceeds } =
        useContractWrite({
            mode: 'recklesslyUnprepared',
            address: nifty.address,
            abi: nifty.abi,
            functionName: 'withdrawProceeds',
            onError(error) {
                console.log(error)
                if (!error.message.includes('ACTION_REJECTED')) {
                    notify({ message: 'Withdrawal failed', type: 'error' })
                }
            },
            async onSuccess(transaction) {
                await transaction.wait(1)
                notify({ message: 'Withdrawal successful', type: 'success' })
            }
        })

    let ownedListings = dummyListings.filter(
        (listing) => listing.seller === userAddress
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

    let proceeds: BigNumber | undefined
    if (BigNumber.isBigNumber(_proceeds)) {
        proceeds = _proceeds
    }

    let isLoading = isLoadingProceeds || isLoadingListings
    let didError = didLoadingProceedsError || didLoadingListingsError

    if (!isMounted || isLoading) {
        return <CircularLoader />
    }

    if (didError || !proceeds || !listings) {
        return <ErrorMessage onClose={refetchListings} />
    }

    return (
        <Frame>
            <Grid minimumItemWidth='200px' spacing={2}>
                <Card>
                    <Typography level='h6'>Proceeds</Typography>
                    <Typography level='h4' fontWeight='lg'>
                        {ethers.utils.formatEther(proceeds)} ETH
                    </Typography>
                    <Button
                        size='sm'
                        loading={isWithdrawing}
                        disabled={proceeds.isZero()}
                        sx={{ marginTop: 1 }}
                        onClick={(): void => withdrawProceeds?.()}
                    >
                        Withdraw
                    </Button>
                </Card>
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
                            // href={`/sell?address=${listing.nft.address}&id=${listing.nft.id}`}
                            isUpdatable
                            onButtonClick={(): void => {
                                setUpdatingListing(listing)
                            }}
                            key={`${listing.nft.address}-${listing.nft.id}`}
                        />
                    ))}
                </Grid>
                {updatingListing && (
                    <UpdateListingModal
                        listing={updatingListing}
                        onSave={(): void => {
                            setUpdatingListing(null)
                        }}
                        onClose={(): void => {
                            setUpdatingListing(null)
                        }}
                    />
                )}
                {isCreatingListing && (
                    <CreateListingModal
                        onList={toggleIsCreatingListing}
                        onClose={toggleIsCreatingListing}
                    />
                )}
            </Frame>
        </Frame>
    )
}

export default SellPage
