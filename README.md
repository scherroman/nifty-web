# Nifty-Web

Built with React, Next.js, Wagmi, and The Graph

## Getting Started

**1. Install the [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) VSCode extension**

**2. Install dependencies**

```
npm install
```

**3. Run the development server**

```bash
npm run develop
```

**4. Add hardhat as a network in metamask**

Open Metamask -> Click the network dropdown in the top middle -> Add network -> Fill out the form as shown below -> Save

**Hardhat Network Details**

Network name: **Hardhat Localhost**

New RPC URL: **http://127.0.0.1:8545/**

Chain ID: **31337**

Currency Symbol: **ETH**

## Testing

**Run linter**

```
npm run lint
```

**Run typechecker**

```
npm run typecheck
```

**Run all static checks**

```
npm run staticcheck
```

**Run tests**

```
npm run test
```

**Run all checks**

```
npm run check
```

## Deployment

**Create a production build**

```
npm run build
```

**Serve the production build**

```
npm run start
```

See the [Next.js Deployment documentation](https://nextjs.org/docs/deployment) for more information on hosting.

## Notes

### Frame Component

The [Frame](./components/Frame.tsx) component is a generic base component that combines Joy UI's generic [`Sheet`](https://mui.com/joy-ui/react-sheet/) with Framer Motion's [motion.div](https://www.framer.com/docs/component/), so that any location that uses it instead of a `div`, `motion.div`, `Box`, or `Sheet` can easily use both theme values and animatations.

### Pre-commit Hooks

All checks are run locally automatically before a commit is made using `npm run check`.

**Modify the existing pre-commit hook**

Edit the [.husky/pre-commit](.husky/pre-commit) file

**Add a pre-commit hook**

`npx husky add .husky/pre-commit "npm run check"`

See the [Husky Documentation](https://typicode.github.io/husky/#/)to learn more on how to configure pre-commit hooks.

## Troubleshooting

### Nonce too high error when testing locally with hardhat

This is likely caused by metamask being out of sync with the current local hardhat chain, as the expected nonce gets out of sync when a new local hardhat chain is spun up. To fix this, open Metamask -> click the account circle in the top right -> Settings -> Advanced -> Reset Account. This will only clear the transaction history and metamask metadata for the hardhat localhost account.
