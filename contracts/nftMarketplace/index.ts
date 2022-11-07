import zod from 'zod'

import _addresses from './addresses.json'
import abi from './abi'

const Addresses = zod.record(zod.string(), zod.string())
let addresses = Addresses.parse(_addresses)
const NFT_MARKETPLACE = { addresses, abi }

export default NFT_MARKETPLACE
