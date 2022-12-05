import { FunctionComponent, useRef } from 'react'

import { useClickAway } from 'react-use'

import { Menu as JoyMenu, MenuProps } from '@mui/joy'

type Properties = MenuProps

/**
 * Fixes buggy onClose behavior of regular Joy UI menu, so that it doesn't fire a close event until the click is finished
 */
const Menu: FunctionComponent<Properties> = ({
    children,
    ...properties
}: Properties) => {
    let ref = useRef(null)
    let { onClose } = properties
    useClickAway(
        ref,
        () => {
            onClose?.()
        },
        ['mouseup']
    )

    return (
        <JoyMenu {...properties} ref={ref} onClose={(): void => void 0}>
            {children}
        </JoyMenu>
    )
}

export default Menu
