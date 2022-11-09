import type { NextPage } from 'next'
import { useAccount } from 'wagmi'

import { useIsMounted } from '../shared/hooks'

import { Box } from '@mui/joy'
import Controls from '../components/Controls'

const Home: NextPage = () => {
    let { isConnected } = useAccount()
    let isMounted = useIsMounted()

    return (
        <Box sx={{ padding: 2 }}>
            {isConnected && isMounted && <Controls />}
        </Box>
    )
}

export default Home
