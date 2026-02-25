# Quickstart: Testing & Coverage Foundation

## Prerequisites

- Node 22.x (Volta-managed)
- Expo 54 project with existing source
- macOS (for iOS Maestro flows)

## Install Test Dependencies

```bash
# Core test runner (use npx expo install for compatibility)
npx expo install jest-expo@~54.0.17

# RNTL
npm install --save-dev @testing-library/react-native@^13.3.3 \
  @testing-library/jest-native@^5.4.3

# MSW
npm install --save-dev msw@^2

# Mutation testing (pilot)
npm install --save-dev @stryker-mutator/core \
  @stryker-mutator/jest-runner \
  @stryker-mutator/typescript-checker

# Maestro (system-level, not npm)
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

## Add npm Scripts

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:mutate": "npx stryker run"
}
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `jest.config.ts` | Jest configuration with jest-expo preset |
| `jest.setup.ts` | Global mocks (RNTP, MMKV, Sentry, Reanimated) + MSW server lifecycle |
| `src/mocks/handlers.ts` | MSW default request handlers |
| `src/mocks/server.ts` | MSW server instance |
| `src/mocks/fixtures/` | Shared test fixture data |
| `src/test/renderWithProviders.tsx` | Shared render utility with providers |
| `stryker.config.mjs` | Stryker mutation testing config |
| `.maestro/` | Maestro E2E flow YAML files |

## Run Tests

```bash
# All tests
npm test

# Single file
npx jest src/app/__tests__/index.test.tsx

# Coverage report
npm run test:coverage

# Mutation testing (pilot scope)
npm run test:mutate

# E2E (requires built app on simulator)
maestro test .maestro/
```

## Verify Setup

After implementation, these should all pass:
1. `npm test` — all unit + RNTL tests green
2. No unhandled MSW requests (would fail tests)
3. `npm run test:mutate` — produces HTML report
4. `maestro test .maestro/smoke-browse-mixtapes.yaml` — passes on simulator
