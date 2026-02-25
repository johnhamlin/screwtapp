---
description: Generate RNTL tests covering success/error/loading states for a screen or component
---

# /test-screen

Generate comprehensive RNTL (React Native Testing Library) tests for a screen or component.

## Input
The user provides a screen or component file path: $ARGUMENTS

## Steps

1. **Read the component source** at the provided path
2. **Identify the component's data dependencies**:
   - RTK Query hooks (useGetMixtapeListQuery, useGetMixtapeQuery, etc.)
   - Redux selectors
   - RNTP hooks (useActiveTrack, useIsPlaying, useProgress)
   - Navigation hooks (useLocalSearchParams, useRouter)
3. **Generate a test file** in the colocated `__tests__/` directory

## Test Structure

Generate tests covering:

### Success State
- Render with providers → wait for data via `findByText`/`findByRole`
- Assert user-visible content matches expected fixture data
- Use MSW default handlers (no overrides needed)

### Loading State
- Render → immediately assert loading indicator visible
- Use `getByRole('progressbar')` for ActivityIndicator

### Error State
- Override MSW handler with `server.use()` returning 500
- Assert error message visible via `findByText`

### Empty State (if applicable)
- Override MSW handler with empty data
- Assert empty state UI visible

## Rules (Constitution P3)
- Use `ByRole`/`ByText` queries — avoid `ByTestId` unless necessary
- Use `userEvent` over `fireEvent` for interactions
- Use `findBy*` for async assertions (data loading)
- Use `getBy*` for synchronous assertions (loading state)
- No internal state assertions — only user-visible behavior
- No snapshot tests

## Required Imports
```typescript
import React from 'react';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test/renderWithProviders';
```

## Fix Notes
If the component needs `testID` or `accessibilityLabel` for reliable querying, emit Fix Notes:
```
**Fix Notes (Human Action Required):**
- Add `testID="..."` to [component] for reliable test targeting
- Add `accessibilityLabel="..."` to [element] for accessibility querying
```
