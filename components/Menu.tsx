import { FunctionComponent, useRef } from 'react'

import { useClickAway } from 'react-use'

import { Menu as MuiMenu, MenuProps } from '@mui/joy'

type MenuProperties = MenuProps

/**
 * Fixes buggy onClose behavior of regular Joy UI menu, so that it doesn't fire a close event until the click is finished
 */
const Menu: FunctionComponent<MenuProperties> = ({
    children,
    ...properties
}: MenuProperties) => {
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
        <MuiMenu {...properties} ref={ref} onClose={(): void => void 0}>
            {children}
        </MuiMenu>
    )
}

export default Menu
