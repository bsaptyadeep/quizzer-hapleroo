# Quiz Kit

Embeddable, framework-agnostic quiz engine with a React UI adapter.

## Packages

| Package      | Description                          |
| ------------ | ------------------------------------ |
| `@quiz/core` | Framework-agnostic quiz engine       |
| `@quiz/react`| React `<Quiz />` component           |

## Development

```bash
pnpm install
pnpm dev        # Start playground
pnpm build      # Build all packages
pnpm test       # Run all tests
pnpm lint       # Lint
pnpm typecheck  # Type-check all packages
```

## Monorepo layout

```
quiz-kit/
├── packages/core/    # @quiz/core
├── packages/react/   # @quiz/react
└── apps/playground/  # Local dev app
```
