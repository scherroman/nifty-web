import { useState, useContext } from 'react'
import zod from 'zod'
import { ethers, BigNumber } from 'ethers'
import { FunctionComponent, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { Listing } from '../../models/listing'
import { NiftyContext } from '../../shared/contexts'
import { useNotify } from '../../shared/hooks'

import {
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
    Divider,
    TextField,
    Button
} from '@mui/joy'

import { Frame } from '../atoms'
import { ErrorMessage } from '../widgets'

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
    let nifty = useContext(NiftyContext)
    let notify = useNotify()
    let {
        register,
        handleSubmit,
        watch,
        formState: { isDirty, isValid, errors }
    } = useForm<UpdateListingInput>({
        resolver: zodResolver(UpdateListingInput),
        defaultValues: {
            price: parseFloat(ethers.utils.formatEther(listing.price))
        },
        mode: 'onTouched'
    })
    let [updateError, setUpdateError] = useState<Error | null>(null)

    let { price: _price } = watch()
    let price: BigNumber | null = isNaN(_price)
        ? null
        : ethers.utils.parseEther(_price.toString())

    const { config } = usePrepareContractWrite({
        address: nifty.address,
        abi: nifty.abi,
        functionName: 'updateListing',
        args: [listing.nft.address, listing.nft.id, price]
    })
    let { isLoading: isUpdating, write: updateListing } = useContractWrite({
        ...config,
        onError(error) {
            console.log(error)
            if (!error.message.includes('ACTION_REJECTED')) {
                setUpdateError(error)
            }
        },
        async onSuccess(transaction) {
            await transaction.wait(1)
            notify({ message: 'Transaction successful', type: 'success' })
            onSave()
        }
    })

    let onSaveSubmit: SubmitHandler<UpdateListingInput> = useCallback(() => {
        updateListing?.()
    }, [updateListing])

    return (
        <Modal open onClose={onClose}>
            <ModalDialog>
                <ModalClose />
                <Typography level='h5' sx={{ marginBottom: 2 }}>
                    Update listing #{listing.nft.id}
                </Typography>
                <Divider />
                <TextField
                    {...register('price', {
                        valueAsNumber: true,
                        required: 'Expected number'
                    })}
                    label='Price'
                    placeholder='New price in ETH'
                    error={errors.price ? true : false}
                    endDecorator={
                        <Typography level='body3' fontWeight='lg'>
                            ETH
                        </Typography>
                    }
                    sx={{ marginTop: 2 }}
                />
                {updateError && (
                    <ErrorMessage
                        size='sm'
                        message='Transaction failed'
                        sx={{ marginTop: 1 }}
                        onClose={(): void => {
                            setUpdateError(null)
                        }}
                    />
                )}
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
            </ModalDialog>
        </Modal>
    )
}

export default UpdateListingModal
