# Nifty-Web

A web app for Nifty, built with [React](https://github.com/facebook/react), [Next.js](https://github.com/vercel/next.js), [wagmi](https://github.com/wagmi-dev/wagmi), and [The Graph](https://thegraph.com/en/)

## Getting Started

**1. Install the [GraphQL: Language Feature Support](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) VSCode extension**

**2. Install dependencies**

```
npm install
```

**3. Run the development server**

```
npm run start:development
```

The development environment uses the deployed [Nifty testnet contract and subgraph](https://github.com/scherroman/nifty)

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

**Run unit tests**

```
npm run test:unit
```

**Run end to end tests**

```
npm run test:end-to-end
```

**Debug end to end tests**

```
npm run test:end-to-end -- --debug

// Debug a specific test
npm run test:end-to-end -- --debug <filter>
```

**Generate tests interactively**

```
npx playwright codegen
```

**Run all tests**

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

All checks are run locally automatically before a commit is made using a husky pre-commit hook.

**Modify the existing pre-commit hook**

Edit the [.husky/pre-commit](.husky/pre-commit) file

**Add a pre-commit hook from scratch**

```
npx husky add .husky/pre-commit "npm run check"
```

See the [Husky Documentation](https://typicode.github.io/husky/#/) to learn more on how to configure pre-commit hooks.

## Troubleshooting

### Some playwright tests are flaky / randomly failing

Ensure that Playwright is testing a production build of the app, as development builds are slow and can cause flakiness / random failures due to timeouts.
