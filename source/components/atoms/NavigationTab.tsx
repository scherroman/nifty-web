import { FunctionComponent } from 'react'

import { useTheme } from '@mui/joy'
import { usePathname } from 'next/navigation'
import { SxProps } from '@mui/joy/styles/types'

import { Typography } from '@mui/joy'
import Link from 'next/link'
import Frame from './Frame'

interface Properties {
    title: string
    href: string
    onClick: () => void
    sx?: SxProps
}

const NavigationTab: FunctionComponent<Properties> = ({
    title,
    href,
    onClick,
    sx
}: Properties) => {
    let theme = useTheme()
    let pathname = usePathname()

    return (
        <Link href={href} style={{ textDecoration: 'none' }} onClick={onClick}>
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
                        href === pathname
                            ? theme.palette.background.level2
                            : theme.palette.background.body
                }}
                whileHover={{
                    backgroundColor:
                        href === pathname
                            ? theme.palette.background.level2
                            : theme.palette.background.level1
                }}
                whileTap={{
                    backgroundColor: theme.palette.background.level2
                }}
            >
                <Typography fontWeight='lg'>{title}</Typography>
            </Frame>
        </Link>
    )
}

export default NavigationTab
