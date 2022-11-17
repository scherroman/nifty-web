import { ethers } from 'ethers'
import { FunctionComponent } from 'react'
import { SxProps } from '@mui/joy/styles/types'

import { Listing } from '../../models/listing'

import Link from 'next/link'
import Image from 'next/image'
import { AspectRatio, CardOverflow, Typography, Button } from '@mui/joy'

import { Frame } from '../atoms'
import { Card } from '../widgets'

export const MINIMUM_LISTING_CARD_WIDTH = '200px'

interface ListingCardProperties {
    listing: Listing
    href?: string
    isBuyable?: boolean
    isUpdatable?: boolean
    isLoading?: boolean
    sx?: SxProps
    onButtonClick?: () => void
}

const ListingCard: FunctionComponent<ListingCardProperties> = ({
    listing,
    href,
    isBuyable = false,
    isUpdatable = false,
    isLoading = false,
    sx,
    onButtonClick = (): void => void 0
}: ListingCardProperties) => {
    let { nft, price } = listing
    let { imageUrl } = nft

    return (
        <Link href={href ?? ''}>
            <Card
                sx={{
                    cursor: href ? 'pointer' : 'default',
                    ...(href && {
                        '&:hover': {
                            borderColor: 'neutral.outlinedHoverBorder'
                        }
                    }),
                    ...sx
                }}
            >
                <CardOverflow>
                    {imageUrl && (
                        <AspectRatio ratio='4/3'>
                            <Image
                                src={imageUrl}
                                layout='fill'
                                objectFit='contain'
                                alt={`nft-id-${nft.id}`}
                            />
                        </AspectRatio>
                    )}
                </CardOverflow>
                <Frame sx={{ marginTop: 2 }}>
                    <Typography level='body1'>
                        {listing.nft.displayName}
                    </Typography>
                    {(isBuyable || isUpdatable) && (
                        <Button
                            variant='soft'
                            size='sm'
                            color={isBuyable ? 'primary' : 'neutral'}
                            loading={isLoading}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                marginTop: (theme) => `-${theme.spacing(1)}`,
                                marginRight: (theme) => `-${theme.spacing(1)}`
                            }}
                            onClick={(event): void => {
                                event.stopPropagation()
                                onButtonClick()
                            }}
                        >
                            {isBuyable ? 'Buy' : 'Update'}
                        </Button>
                    )}
                    <Typography
                        level='h5'
                        sx={{ fontWeight: 'lg', marginTop: 0.5 }}
                    >
                        {ethers.utils.formatEther(price)} ETH
                    </Typography>
                </Frame>
            </Card>
        </Link>
    )
}

export default ListingCard
