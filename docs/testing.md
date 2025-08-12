# Testing Guide

This document describes the testing infrastructure for the VS Code D2 TXT Editor Extension.

## Test Structure

Our test suite is organized into several categories:

### Unit Tests (`provider-utils.test.ts`)
- Tests individual utility functions in isolation
- Validates core functionality like column width calculation, data type detection, and color generation
- Fast execution, comprehensive coverage of utility methods

### Security Tests (`security.test.ts`)
- Validates HTML escaping and XSS prevention
- Tests Content Security Policy compliance
- Ensures safe handling of user input

### Performance Tests (`performance.test.ts`)
- Benchmarks critical operations for large datasets
- Tests virtual scrolling performance
- Validates memory usage and execution time
- Ensures scalability for large D2 files

### Integration Tests (`integration.test.ts`)
- Tests complete workflows end-to-end
- Validates TSV parsing and serialization
- Tests the interaction between multiple components
- Verifies data integrity through processing cycles

## Running Tests

### All Tests
```bash
npm test
```

### Individual Test Suites
```bash
npm run test:unit          # Unit tests only
npm run test:security      # Security tests only
npm run test:performance   # Performance benchmarks
npm run test:integration   # Integration tests only
```

### Test Coverage
```bash
npm run test:coverage      # Run all tests with coverage report
```

## Test Development Guidelines

### Writing Tests
1. **Descriptive Names**: Use clear, descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
3. **Edge Cases**: Test boundary conditions and error scenarios
4. **Performance**: Include timing assertions for performance-critical functions

### Performance Test Standards
- Functions processing large datasets should complete within defined time limits
- Memory usage should remain reasonable for typical file sizes
- Virtual scrolling should handle 10,000+ rows efficiently

### Security Test Requirements
- All user input must be properly escaped
- HTML generation must prevent XSS attacks
- Content Security Policy must be enforced

## Test Data

### Performance Test Data
- Large datasets: 1,000-10,000 rows for realistic performance testing
- Wide datasets: 50+ columns to simulate complex D2 files
- Mixed data types: String, number, boolean, date combinations

### Security Test Data
- XSS vectors: Script tags, event handlers, data URIs
- HTML entities: Special characters that need escaping
- Malformed input: Invalid or unexpected data formats

## Continuous Integration

Tests are designed to run in CI environments with:
- Node.js test runner (no external dependencies)
- Fast execution times (< 30 seconds total)
- Clear error reporting
- Performance regression detection

## Troubleshooting

### Common Test Failures
1. **Color Test Failures**: Verify color arrays match expected values in `getColumnColor`
2. **Performance Timeouts**: Check if test thresholds need adjustment for slower CI environments
3. **Memory Leaks**: Use Node.js profiling tools to identify memory issues

### Debugging Tests
```bash
# Run specific test with verbose output
node --test --verbose out/test/provider-utils.test.js

# Run with debugging
node --inspect --test out/test/provider-utils.test.js
```

## Test Coverage Goals

- **Unit Tests**: 90%+ coverage of utility functions
- **Security Tests**: 100% coverage of HTML generation and input handling
- **Performance Tests**: All critical paths benchmarked
- **Integration Tests**: Major user workflows validated

## Adding New Tests

When adding new functionality:
1. Add unit tests for new utility functions
2. Add integration tests for new user workflows
3. Add performance tests for operations on large datasets
4. Add security tests for any user input handling
5. Update this documentation with new test categories

## Performance Benchmarks

Current performance targets:
- Column width calculation: < 100ms for 20,000 cells
- Data type estimation: < 10ms for 10,000 items
- HTML generation: < 50ms for 500 cells
- Color generation: < 10ms for 1,000 colors
- Memory usage: < 50MB increase for 25,000 cells
