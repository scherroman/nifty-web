import { FunctionComponent } from 'react'

import { useTheme } from '@mui/joy'
import { useRouter } from 'next/router'
import { SxProps } from '@mui/joy/styles/types'

import { Typography } from '@mui/joy'
import Link from 'next/link'
import Frame from './Frame'

interface NavigationTabProperties {
    title: string
    href: string
    onClick: () => void
    sx?: SxProps
}

const NavigationTab: FunctionComponent<NavigationTabProperties> = ({
    title,
    href,
    onClick,
    sx
}: NavigationTabProperties) => {
    let theme = useTheme()
    let router = useRouter()

    return (
        <Link href={href}>
            <a style={{ textDecoration: 'none' }} onClick={onClick}>
                <Frame
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexGrow: { mobile: 1, tablet: 0 },
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
                                : theme.palette.background.body
                    }}
                    whileHover={{
                        backgroundColor:
                            href === router.pathname
                                ? theme.palette.background.level2
                                : theme.palette.background.level1
                    }}
                    whileTap={{
                        backgroundColor: theme.palette.background.level2
                    }}
                >
                    <Typography fontWeight='lg'>{title}</Typography>
                </Frame>
            </a>
        </Link>
    )
}

export default NavigationTab
