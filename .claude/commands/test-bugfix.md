---
description: Generate a failing regression test from a bug description
---

# /test-bugfix

Generate a **failing-first** regression test for a reported bug.

## Input
The user describes a bug: $ARGUMENTS

## Steps

1. **Analyze the bug description** to identify:
   - The affected component, function, or hook
   - The expected behavior vs. actual behavior
   - The trigger conditions (user action, data state, etc.)
2. **Read the source code** of the affected module
3. **Generate a test that FAILS** on the current (buggy) code:
   - The test asserts the **expected** (correct) behavior
   - Since the bug exists, the test should fail
4. **Output the test file** in the colocated `__tests__/` directory

## Test Structure

```typescript
describe('[Component/Function] - Bug: [short description]', () => {
  test('should [expected behavior] when [condition]', () => {
    // Arrange: Set up the buggy conditions
    // Act: Trigger the bug
    // Assert: Expected (correct) behavior — this FAILS until bug is fixed
  });
});
```

## Instructions to User

After generating the test, output:

```
## Run Instructions

1. Run this test — it should **FAIL**:
   npx jest [test-file-path]

2. Fix the production code to address the bug

3. Run the test again — it should **PASS**:
   npx jest [test-file-path]

The test serves as a regression guard: if the bug reappears, this test will catch it.
```

## Rules
- The test MUST fail before the fix and pass after
- Use the same testing patterns as other tests (renderWithProviders, MSW, etc.)
- Do NOT fix the production code — only write the test
- If production code needs changes for testability, emit Fix Notes
