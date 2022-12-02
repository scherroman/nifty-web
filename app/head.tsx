import { FunctionComponent } from 'react'

const Head: FunctionComponent = () => {
    return (
        <>
            <title>Nifty</title>
            <meta name='description' content='A nifty marketplace for NFTs' />
            <meta
                name='viewport'
                content='width=device-width, initial-scale=1'
            />
            <link rel='icon' href='/favicon.ico' />
        </>
    )
}

export default Head
