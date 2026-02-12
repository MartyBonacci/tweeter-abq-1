# Quality Standards

## Project
- **Name**: tweeter
- **Created**: 2026-02-11
- **Quality Level**: Standard

---

## Quality Gates

### Minimum Thresholds
- **Quality Score**: 80/100
- **Test Coverage**: 80%
- **Enforce Gates**: true

### Code Quality
- **Max Cyclomatic Complexity**: 10
- **Max File Length**: 300 lines
- **Max Function Length**: 50 lines
- **Max Function Parameters**: 5

---

## Performance Budgets

- **Enforce Budgets**: true
- **Max Bundle Size**: 500 KB
- **Max Initial Load**: 1000 ms
- **Max Chunk Size**: 200 KB

---

## Testing Requirements

- **Require Tests**: true
- Unit tests for all utility functions and validation schemas
- Integration tests for loaders and actions
- E2E tests for critical user flows (signup, signin, tweet, like)

### Test Organization
- Co-locate test files with source (`*.test.ts` next to `*.ts`)
- Shared test utilities in `test/` directory

---

## Code Review

- **Require Code Review**: true
- **Minimum Reviewers**: 1

---

## CI/CD

- **Block Merge on Failure**: true
- All quality gates must pass before merge via `/specswarm:ship`

---

## Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML elements
- Proper form labels and ARIA attributes
- Keyboard navigation support

---

## Exemptions

*No exemptions currently granted.*

---

## Notes

- Quality level: Standard (80% thresholds)
- Created by `/specswarm:init`
- Enforced by `/specswarm:ship` before merge
- Review and adjust these standards as the project matures
