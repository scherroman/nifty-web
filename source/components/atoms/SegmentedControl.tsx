import { FunctionComponent, ReactNode, useState, ChangeEvent } from 'react'

import { useTheme } from '@mui/joy/styles'
import { SxProps } from '@mui/joy/styles/types'
import { RadioGroup, Radio, Typography } from '@mui/joy'
import { radioClasses } from '@mui/joy/Radio'

import Frame from 'nifty/components/atoms/Frame'

interface Option {
    label?: string
    icon?: ReactNode
    selected?: boolean
    key: string
}

interface Properties {
    options: Option[]
    sx?: SxProps
    onSelect(option: Option): void
}

const SegmentedControl: FunctionComponent<Properties> = ({
    options,
    sx,
    onSelect
}: Properties) => {
    let theme = useTheme()
    let initialOption = options.find((option) => option.selected)
    let [selectedOption, setSelectedOption] = useState(initialOption ?? null)

    return (
        <RadioGroup
            row
            variant='outlined'
            value={selectedOption}
            sx={sx}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                let option = options.find(
                    (option) => option.key === event.target.value
                )
                if (option !== undefined) {
                    setSelectedOption(option)
                    onSelect(option)
                }
            }}
        >
            {options.map((option) => (
                <Frame
                    key={option.key}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexGrow: 1,
                        padding: 1,
                        '&:not([data-first-child])': {
                            borderLeft: '1px solid',
                            borderColor: 'divider'
                        },
                        [`&[data-first-child] .${radioClasses.action}`]: {
                            borderTopLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            borderBottomLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`
                        },
                        [`&[data-last-child] .${radioClasses.action}`]: {
                            borderTopRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            borderBottomRightRadius: `calc(${theme.vars.radius.sm} - 1px)`
                        }
                    }}
                >
                    <Radio
                        value={option.key}
                        size='md'
                        disableIcon
                        overlay
                        label={
                            <Frame
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {option.icon}
                                {option.label && (
                                    <Typography sx={{ marginLeft: 1 }}>
                                        {option.label}
                                    </Typography>
                                )}
                            </Frame>
                        }
                        variant={
                            selectedOption?.key === option.key
                                ? 'soft'
                                : 'plain'
                        }
                        componentsProps={{
                            input: { 'aria-label': option.label ?? option.key },
                            action: {
                                sx: { borderRadius: 0, transition: 'none' }
                            },
                            label: { sx: { lineHeight: 0 } }
                        }}
                    />
                </Frame>
            ))}
        </RadioGroup>
    )
}

export default SegmentedControl
