import { useContext } from 'react'
import zod from 'zod'
import { ethers } from 'ethers'
import { FunctionComponent, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContractWrite } from 'wagmi'

import { Listing } from 'nifty/models/listing'
import { ContractsContext } from 'nifty/contexts'
import { useNotify } from 'nifty/hooks'
import { getNotifications } from 'nifty/hooks/useNotify'
import { TRANSACTION_FAILED_STATUS } from 'nifty/constants'

import { Typography, TextField, Button } from '@mui/joy'

import { Frame } from 'nifty/components/atoms'
import Modal from './Modal'

const UPDATE_NOTIFICATIONS = getNotifications('Update')

const UpdateListingInput = zod.object({
    price: zod.number().positive()
})

type UpdateListingInput = zod.TypeOf<typeof UpdateListingInput>

interface UpdateListingModalProperties {
    listing: Listing
    onClose(): void
    onSave(): void
}

const UpdateListingModal: FunctionComponent<UpdateListingModalProperties> = ({
    listing,
    onClose,
    onSave
}: UpdateListingModalProperties) => {
    let { nifty } = useContext(ContractsContext)
    let notify = useNotify()
    let {
        register,
        handleSubmit,
        formState: { isDirty, isValid, errors }
    } = useForm<UpdateListingInput>({
        resolver: zodResolver(UpdateListingInput),
        defaultValues: {
            price: parseFloat(ethers.utils.formatEther(listing.price))
        },
        mode: 'onTouched'
    })

    let { isLoading: isUpdating, write: updateListing } = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: nifty.address,
        abi: nifty.abi,
        functionName: 'updateListing',
        onError(error) {
            console.log(error)
            if (!error.message.includes('ACTION_REJECTED')) {
                notify(UPDATE_NOTIFICATIONS.failed)
            }
        },
        async onSuccess(transaction) {
            let receipt = await transaction.wait()
            if (receipt.status === TRANSACTION_FAILED_STATUS) {
                notify(UPDATE_NOTIFICATIONS.failed)
            } else {
                notify(UPDATE_NOTIFICATIONS.succeeded)
                onSave()
            }
        }
    })

    let onSaveSubmit: SubmitHandler<UpdateListingInput> = useCallback(
        (input) => {
            updateListing?.({
                recklesslySetUnpreparedArgs: [
                    listing.nft.address,
                    listing.nft.tokenId,
                    ethers.utils.parseEther(input.price.toString())
                ]
            })
        },
        [listing.nft.address, listing.nft.tokenId, updateListing]
    )

    return (
        <Modal
            title={`Update listing ${listing.nft.displayName}`}
            onClose={onClose}
        >
            <TextField
                {...register('price', {
                    valueAsNumber: true,
                    required: 'Expected number'
                })}
                label='Price'
                error={errors.price ? true : false}
                endDecorator={
                    <Typography level='body3' fontWeight='lg'>
                        ETH
                    </Typography>
                }
                sx={{ marginTop: 2 }}
            />
            <Frame
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 2
                }}
            >
                <Button
                    variant='plain'
                    color='neutral'
                    size='sm'
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    size='sm'
                    sx={{ marginLeft: 1 }}
                    loading={isUpdating}
                    disabled={!isDirty || !isValid}
                    onClick={handleSubmit(onSaveSubmit)}
                >
                    Save
                </Button>
            </Frame>
        </Modal>
    )
}

export default UpdateListingModal
