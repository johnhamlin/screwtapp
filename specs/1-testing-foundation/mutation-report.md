# Mutation Testing Pilot Report

**Date**: 2026-02-23
**Tool**: Stryker Mutator v8 with Jest runner
**Scope**: Pilot — 2 source files (pure logic + RTK Query API)

---

## Summary

| Metric | Value |
|--------|-------|
| Total mutants | 54 |
| Killed | 38 |
| Survived | 12 |
| Errors | 4 |
| **Overall mutation score** | **76%** |

## Per-File Results

| File | Score | Killed | Survived |
|------|-------|--------|----------|
| `src/styles/utils/rgbStringToRgbaString.ts` | **100%** | 11 | 0 |
| `src/features/mixtapeList/slices/mixtapeListApi.ts` | **69.23%** | 27 | 12 |

## Surviving Mutants Analysis

### Regex Anchor Mutations (2 survivors)
- Removing `^` from `/^DJ Screw - /` — tests still pass because fixture data has "DJ Screw - " only at the start. Would need fixture with "feat. DJ Screw - " to catch this.
- Removing `$` from `/ \(\d{4}\)$/` — tests still pass because fixture dates appear only at the end. Would need a title like "Album (2020) Remastered" to catch this.

**Recommendation**: Add edge-case fixtures with mid-string matches to strengthen regex tests.

### RTK Query Cache Tags (10 survivors)
- `tagTypes: ['MixtapeList', 'Mixtape']` → `tagTypes: []` — survives because tests don't exercise cache invalidation behavior.
- `providesTags: ['MixtapeList']` → `providesTags: []` — same reason.
- `providesTags: () => [{ type: 'Mixtape', id: arg }]` → various mutations — tests verify response transforms, not cache tag behavior.
- `reducerPath: 'mixtapeListApi'` → `reducerPath: ""` — survives because tests create isolated stores.

**Recommendation**: These are RTK Query infrastructure concerns (cache invalidation, tag-based refetching). Testing them requires integration tests exercising multiple queries + invalidation cycles. Low priority for this pilot.

## Key Findings

1. **Pure utility functions are well-tested**: `rgbStringToRgbaString` achieves 100% mutation kill rate.
2. **Transform logic is mostly well-tested**: 27/39 API transform mutants killed (69%).
3. **Cache invalidation logic is untested**: RTK Query `providesTags`/`tagTypes` survive mutation because unit tests don't exercise cache behavior. This is acceptable — cache behavior is better validated through manual testing or integration tests.
4. **Regex specificity**: Two surviving regex mutants reveal the tests don't enforce anchoring. Minor but worth noting.

## Configuration

Stryker config: `stryker.config.mjs`
- TypeScript checker disabled (pre-existing TS errors in production code outside AI scope)
- `ignorePatterns` excludes build artifacts, native dirs, spec files
- `coverageAnalysis: 'perTest'` for faster runs
- `incremental: true` for subsequent runs

## Run Command

```bash
npm run test:mutate
```

HTML report at `reports/mutation/index.html`.
