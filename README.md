# Hapleroo Quizzard

Embeddable, framework-agnostic quiz engine with a React UI adapter.

## Packages

| Package                  | Description                          |
| ------------------------ | ------------------------------------ |
| `hapleroo-quizzard-core` | Framework-agnostic quiz engine       |
| `hapleroo-quizzard`      | React `<Quiz />` component           |

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
hapleroo-quizzard/
├── packages/core/    # hapleroo-quizzard-core
├── packages/react/   # hapleroo-quizzard
└── apps/playground/  # Local dev app
```
