'use client'

import { useContext } from 'react'
import { FunctionComponent } from 'react'
import { ethers, BigNumber } from 'ethers'
import { useAccount } from 'wagmi'
import { useContractWrite, useContractRead } from 'wagmi'

import { ContractsContext } from 'nifty/contexts'
import { useNotify } from 'nifty/hooks'
import { getNotifications } from 'nifty/hooks/useNotify'
import { TRANSACTION_FAILED_STATUS } from 'nifty/constants'

import { Typography, Button } from '@mui/joy'

import { CircularLoader } from 'nifty/components/atoms'
import { Card, ErrorMessage } from 'nifty/components/widgets'

const WITHDRAWAL_NOTIFICATIONS = getNotifications('Withdrawal')

const ProceedsCard: FunctionComponent = () => {
    let { nifty } = useContext(ContractsContext)
    let { address: userAddress } = useAccount()
    let notify = useNotify()

    let {
        data: _proceeds,
        isLoading: isLoadingProceeds,
        isError: didLoadingProceedsError,
        refetch
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
                    notify(WITHDRAWAL_NOTIFICATIONS.failed)
                }
            },
            async onSuccess(transaction) {
                let receipt = await transaction.wait()
                if (receipt.status === TRANSACTION_FAILED_STATUS) {
                    notify(WITHDRAWAL_NOTIFICATIONS.failed)
                } else {
                    notify(WITHDRAWAL_NOTIFICATIONS.succeeded)
                }
            }
        })

    let proceeds: BigNumber | undefined
    if (BigNumber.isBigNumber(_proceeds)) {
        proceeds = _proceeds
    }

    let isLoading = isLoadingProceeds
    let didError = didLoadingProceedsError

    if (isLoading) {
        return <CircularLoader />
    }

    if (didError || proceeds === undefined) {
        return <ErrorMessage onClose={refetch} />
    }

    return (
        <Card>
            <Typography level='h6'>Proceeds</Typography>
            <Typography level='h4' fontWeight='lg'>
                {ethers.utils.formatEther(proceeds)} ETH
            </Typography>
            <Button
                size='sm'
                loading={isWithdrawing}
                disabled={proceeds.isZero()}
                sx={{
                    marginTop: 1
                }}
                onClick={(): void => withdrawProceeds?.()}
            >
                Withdraw
            </Button>
        </Card>
    )
}

export default ProceedsCard
