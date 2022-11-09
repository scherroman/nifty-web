import { FunctionComponent, useState } from 'react'

import { useTheme } from '@mui/joy'
import { useRouter } from 'next/router'
import { SxProps } from '@mui/joy/styles/types'

import { Typography } from '@mui/joy'
import Link from 'next/link'
import Frame from './Frame'

interface NavigationTabProperties {
    title: string
    href: string
    sx?: SxProps
}

const NavigationTab: FunctionComponent<NavigationTabProperties> = ({
    title,
    href,
    sx
}: NavigationTabProperties) => {
    let theme = useTheme()
    let router = useRouter()
    let [isHovering, setIsHovering] = useState(false)

    return (
        <Link href={href} passHref>
            <Frame
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 0.5,
                    paddingX: 1.5,
                    borderRadius: 50,
                    cursor: 'pointer',
                    ...sx
                }}
                animate={{
                    backgroundColor:
                        href === router.pathname
                            ? theme.palette.background.level2
                            : isHovering
                            ? theme.palette.background.level1
                            : theme.palette.background.body
                }}
                onHoverStart={(): void => setIsHovering(true)}
                onHoverEnd={(): void => setIsHovering(false)}
            >
                <Typography fontWeight='lg'>{title}</Typography>
            </Frame>
        </Link>
    )
}

export default NavigationTab
