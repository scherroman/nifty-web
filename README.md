This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Then, add hardhat as a network in metamask: Open Metamask -> Click the network dropdown in the top middle -> Add network -> Fill out the form -> Save

**New Network Details**

Network name: Hardhat Localhost

New RPC URL: http://127.0.0.1:8545/

Chain ID: 31337

Currency Symbol: ETH

## Notes

The [Frame](./components/Frame.tsx) component is a generic base component that combines Framer Motion's [motion.div](https://www.framer.com/docs/component/) with Joy UI's generic [`Sheet`](https://mui.com/joy-ui/react-sheet/), so that any location that uses it instead of a `div`, `motion.div`, `Box`, or `Sheet` can easily use both theme values and animatations.

## Troubleshooting

### Nonce too high error when testing locally with hardhat

This is likely caused by metamask being out of sync with the current local hardhat chain, as the expected nonce gets out of sync when a new local hardhat chain is spun up. To fix this, open Metamask -> click the account circle in the top right -> Settings -> Advanced -> Reset Account. This will only clear the transaction history and metamask metadata for the hardhat localhost account.
