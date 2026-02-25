# Contract: Test Harness (`renderWithProviders`)

## Purpose

Shared render utility that wraps components with all required
providers for RNTL screen/component tests.

## Interface

```typescript
function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderWithProvidersOptions,
): RenderResult & { store: AppStore }
```

### Options

```typescript
interface RenderWithProvidersOptions extends RenderOptions {
  // Pre-loaded Redux state (partial, deep-merged with defaults)
  preloadedState?: Partial<RootState>;
  // Custom store instance (overrides preloadedState)
  store?: AppStore;
}
```

### Provider Stack (outermost → innermost)

1. `ReduxProvider` (store with RTK Query middleware)
2. `PaperProvider` (MD3 theme — light default)
3. `SafeAreaProvider` (insets: all zero)

### Guarantees

- Fresh store per call (no cross-test leakage)
- RTK Query middleware active (MSW intercepts requests)
- No PersistGate (persistence is mocked/disabled)
- No Sentry wrapper (mocked globally)
- No RNTP registration (mocked globally)

### Usage Pattern

```typescript
const { getByRole, store } = renderWithProviders(<HomeScreen />);
// Assert on rendered output
// Optionally inspect store.getState() for Redux assertions
```

## Location

`src/test/renderWithProviders.tsx`
