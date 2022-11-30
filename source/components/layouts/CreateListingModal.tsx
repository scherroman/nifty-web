import { useContext } from 'react'
import zod from 'zod'
import { ethers } from 'ethers'
import { FunctionComponent, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContractWrite } from 'wagmi'
import isEthereumAddress from 'validator/lib/isEthereumAddress'

import { ContractsContext } from '../../shared/contexts'
import { useNotify } from '../../shared/hooks'
import { getNotifications } from '../../shared/hooks/useNotify'
import { TRANSACTION_FAILED_STATUS } from '../../shared/constants'

import { Typography, TextField, Button } from '@mui/joy'

import { Frame } from '../atoms'
import Modal from './Modal'

const APPROVAL_NOTIFICATIONS = getNotifications('Approval')
const LISTING_NOTIFICATIONS = getNotifications('Listing')

const CreateListingInput = zod.object({
    nftAddress: zod.string().refine((value) => isEthereumAddress(value), {
        message: 'Requires a valid Ethereum address'
    }),
    nftId: zod.string().min(1),
    price: zod.number().positive()
})

type CreateListingInput = zod.TypeOf<typeof CreateListingInput>

interface CreateListingModalProperties {
    onClose(): void
    onList(): void
}

const CreateListingModal: FunctionComponent<CreateListingModalProperties> = ({
    onClose,
    onList = (): void => void 0
}: CreateListingModalProperties) => {
    let { nifty, erc721Interface } = useContext(ContractsContext)
    let notify = useNotify()
    let {
        register,
        handleSubmit,
        watch,
        formState: { isDirty, isValid, errors }
    } = useForm<CreateListingInput>({
        resolver: zodResolver(CreateListingInput),
        mode: 'onTouched'
    })

    let nftAddress = watch('nftAddress')
    let { isLoading: isApproving, write: approveNftForListing } =
        useContractWrite({
            mode: 'recklesslyUnprepared',
            address: nftAddress,
            abi: erc721Interface.abi,
            functionName: 'approve',
            onError(error) {
                console.log(error)
                if (!error.message.includes('ACTION_REJECTED')) {
                    notify(APPROVAL_NOTIFICATIONS.failed)
                }
            },
            async onSuccess(transaction) {
                let receipt = await transaction.wait()
                if (receipt.status === TRANSACTION_FAILED_STATUS) {
                    notify(APPROVAL_NOTIFICATIONS.failed)
                } else {
                    notify(APPROVAL_NOTIFICATIONS.succeeded)
                    await handleSubmit(onApproveSuccess)()
                }
            }
        })

    let { isLoading: isListing, write: listNft } = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: nifty.address,
        abi: nifty.abi,
        functionName: 'listNft',
        onError(error) {
            console.log(error)
            if (!error.message.includes('ACTION_REJECTED')) {
                notify(LISTING_NOTIFICATIONS.failed)
            }
        },
        async onSuccess(transaction) {
            let receipt = await transaction.wait()
            if (receipt.status === TRANSACTION_FAILED_STATUS) {
                notify(LISTING_NOTIFICATIONS.failed)
            } else {
                notify(LISTING_NOTIFICATIONS.succeeded)
                onList()
            }
        }
    })

    let onListSubmit: SubmitHandler<CreateListingInput> = useCallback(
        (input) => {
            approveNftForListing?.({
                recklesslySetUnpreparedArgs: [nifty.address, input.nftId]
            })
        },
        [nifty.address, approveNftForListing]
    )

    let onApproveSuccess: SubmitHandler<CreateListingInput> = useCallback(
        (input) => {
            listNft?.({
                recklesslySetUnpreparedArgs: [
                    input.nftAddress,
                    input.nftId,
                    ethers.utils.parseEther(input.price.toString())
                ]
            })
        },
        [listNft]
    )

    return (
        <Modal title={`Create listing`} onClose={onClose}>
            <TextField
                {...register('nftAddress')}
                label='NFT Address'
                error={errors.nftAddress ? true : false}
                helperText={
                    errors.nftAddress ? errors.nftAddress.message : null
                }
                sx={{ marginTop: 2 }}
            />
            <TextField
                {...register('nftId')}
                label='NFT ID'
                error={errors.nftId ? true : false}
                sx={{ marginTop: 2 }}
            />
            <TextField
                {...register('price', {
                    valueAsNumber: true
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
                    loading={isApproving || isListing}
                    disabled={!isDirty || !isValid}
                    onClick={handleSubmit(onListSubmit)}
                >
                    List
                </Button>
            </Frame>
        </Modal>
    )
}

export default CreateListingModal
