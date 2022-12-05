import { FunctionComponent, ReactNode } from 'react'

import Providers from './Providers'
import Dashboard from './Dashboard'

interface Properties {
    children?: ReactNode
}

const RootLayout: FunctionComponent<Properties> = ({ children }) => {
    return (
        <html lang='en'>
            <body>
                <Providers>
                    <Dashboard>{children}</Dashboard>
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout
