import { FunctionComponent, Fragment, useContext } from 'react'
import { BigNumber } from 'ethers'
import { useContractRead } from 'wagmi'

import { Box, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

import { NiftyContext } from '../shared/contexts'

interface ControlsProperties {
    sx?: SxProps
}

const Controls: FunctionComponent<ControlsProperties> = ({
    sx
}: ControlsProperties) => {
    let nifty = useContext(NiftyContext)
    let {
        data: _numberOfListings,
        isLoading: isLoadingNumberOfListings,
        isError: numberOfListingsError
    } = useContractRead({
        address: nifty.address,
        abi: nifty.abi,
        functionName: 'numberOfListings',
        watch: true
    })

    let numberOfListings: BigNumber | undefined
    if (BigNumber.isBigNumber(_numberOfListings)) {
        numberOfListings = _numberOfListings
    }

    let isLoading = isLoadingNumberOfListings

    let message: string | undefined
    if (nifty.address === '') {
        message = 'Nifty smart contract not found'
    } else if (isLoading) {
        message = 'Loading...'
    } else if (numberOfListingsError) {
        message = 'Something went wrong'
    }

    return (
        <Box sx={sx}>
            {nifty.address && !isLoading && (
                <Fragment>
                    <Typography level='body1'>
                        {`Number of listings: ${numberOfListings}`}
                    </Typography>
                </Fragment>
            )}
            {message && <Typography level='body1'>{message}</Typography>}
        </Box>
    )
}

export default Controls
