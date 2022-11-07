import { FunctionComponent, Fragment, useContext } from 'react'
import { BigNumber } from 'ethers'
import { useContractRead } from 'wagmi'

import { Box, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'

import { NftMarketplaceContext } from '../shared/contexts'

interface ControlsProperties {
    sx?: SxProps
}

const Controls: FunctionComponent<ControlsProperties> = ({
    sx
}: ControlsProperties) => {
    let nftMarketplace = useContext(NftMarketplaceContext)
    let {
        data: _numberOfListings,
        isLoading: isLoadingNumberOfListings,
        isError: numberOfListingsError
    } = useContractRead({
        address: nftMarketplace.address,
        abi: nftMarketplace.abi,
        functionName: 'numberOfListings',
        watch: true
    })

    let numberOfListings: BigNumber | undefined
    if (BigNumber.isBigNumber(_numberOfListings)) {
        numberOfListings = _numberOfListings
    }

    let isLoading = isLoadingNumberOfListings

    let message: string | undefined
    if (nftMarketplace.address === '') {
        message = 'Nft Marketplace smart contract not found'
    } else if (isLoading) {
        message = 'Loading...'
    } else if (numberOfListingsError) {
        message = 'Something went wrong'
    }

    return (
        <Box sx={sx}>
            {nftMarketplace.address && !isLoading && (
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
