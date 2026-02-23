---
description: Generate unit tests for a custom React hook using renderHook
---

# /test-hook

Generate unit tests for a custom React hook.

## Input
The user provides a hook file path: $ARGUMENTS

## Steps

1. **Read the hook source** at the provided path
2. **Identify**:
   - Hook parameters (inputs)
   - Return values (outputs)
   - Dependencies (Redux store, RNTP, navigation, etc.)
   - Side effects (dispatches, API calls, etc.)
3. **Generate a test file** in the colocated `__tests__/` directory

## Test Structure

For each code path in the hook:

```typescript
import { renderHook, act } from '@testing-library/react-native';
```

### Input/Output Tests
- Call hook with specific inputs → assert return values
- Call hook with edge case inputs → assert handling

### State Transition Tests
- Trigger state changes via returned callbacks
- Assert new state values after transitions

### Dependency Mocking
- Mock external dependencies (not hook internals)
- Use `jest.mock()` for modules, `jest.fn()` for callbacks
- Wrap with providers if hook uses Redux/context

## Rules
- Test the hook's public API only (inputs → outputs)
- Mock dependencies at the module level, not within the hook
- Use `act()` for any state updates
- If hook needs Redux, use `renderHook` with wrapper from `renderWithProviders`

## Wrapper Pattern for Redux Hooks
```typescript
import { renderWithProviders, createTestStore } from '@/test/renderWithProviders';

function wrapper({ children }) {
  return renderWithProviders(children).container;
}
// OR use renderHook with a custom wrapper that provides the store
```
