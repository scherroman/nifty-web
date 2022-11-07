import Document, { Html, Head, Main, NextScript } from 'next/document'
import { getInitColorSchemeScript } from '@mui/joy/styles'

export default class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head />
                <body>
                    {getInitColorSchemeScript()}
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
