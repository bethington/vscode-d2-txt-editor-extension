import { describe, it } from 'node:test';
import * as assert from 'node:assert';

/**
 * Performance test suite for utility functions.
 * Tests memory usage, rendering performance, and data processing.
 * 
 * Note: These tests focus on pure utility functions that don't require VS Code APIs.
 */
describe('Performance Tests', () => {

  // Utility functions extracted for testing (copied from extension.ts)
  function computeColumnWidths(rows: string[][]): number[] {
    if (rows.length === 0) {
      return [];
    }
    
    const columnCount = Math.max(...rows.map(row => row.length));
    const widths: number[] = new Array(columnCount).fill(0);
    
    for (const row of rows) {
      for (let col = 0; col < row.length; col++) {
        const cellValue = row[col] || '';
        widths[col] = Math.max(widths[col], cellValue.length);
      }
    }
    
    return widths;
  }

  function estimateColumnDataType(column: string[]): string {
    if (column.length === 0) {
      return 'empty';
    }
    
    let numberCount = 0;
    let booleanCount = 0;
    let dateCount = 0;
    let emptyCount = 0;
    let sampleSize = 0;
    const maxSamples = 100; // Early termination for performance
    
    for (const value of column) {
      if (sampleSize >= maxSamples) {
        break;
      }
      
      const trimmed = value.trim();
      if (trimmed === '') {
        emptyCount++;
      } else {
        if (isDate(trimmed)) {
          dateCount++;
        } else if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
          booleanCount++;
        } else if (!isNaN(Number(trimmed)) && trimmed !== '') {
          numberCount++;
        }
      }
      sampleSize++;
    }
    
    const total = sampleSize;
    if (emptyCount === total) {
      return 'empty';
    }
    if (dateCount / total > 0.6) {
      return 'date';
    }
    if (booleanCount / total > 0.6) {
      return 'boolean';
    }
    if (numberCount / total > 0.6) {
      return 'number';
    }
    return 'string';
  }

  function isDate(value: string): boolean {
    if (!value || value.length < 8) {
      return false;
    }
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return false;
    }
    
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{4}\/\d{2}\/\d{2}$/,
      /^\d{2}-\d{2}-\d{4}$/
    ];
    
    return datePatterns.some(pattern => pattern.test(value));
  }

  function getColumnColor(type: string, isDark: boolean, columnIndex: number): string {
    const rainbowColors = isDark ? [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA', '#F8C471'
    ] : [
      '#C0392B', '#138D75', '#2980B9', '#27AE60', '#F39C12', '#8E44AD',
      '#16A085', '#D35400', '#7D3C98', '#1F618D', '#239B56', '#CA6F1E'
    ];
    
    const colorIndex = columnIndex % rainbowColors.length;
    return rainbowColors[colorIndex];
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  it('computeColumnWidths performs well on large datasets', () => {
    // Create a large dataset: 1000 rows x 20 columns
    const rows: string[][] = [];
    for (let i = 0; i < 1000; i++) {
      const row: string[] = [];
      for (let j = 0; j < 20; j++) {
        row.push(`data_${i}_${j}_${'x'.repeat(Math.floor(Math.random() * 50))}`);
      }
      rows.push(row);
    }

    const startTime = performance.now();
    const widths = computeColumnWidths(rows);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    // Should complete within reasonable time (less than 100ms for 20k cells)
    assert.ok(executionTime < 100, `computeColumnWidths took ${executionTime}ms, expected < 100ms`);
    
    // Should return correct number of columns
    assert.strictEqual(widths.length, 20);
    
    // All widths should be positive
    assert.ok(widths.every((w: number) => w > 0), 'All column widths should be positive');
    
    console.log(`✓ computeColumnWidths processed 20,000 cells in ${executionTime.toFixed(2)}ms`);
  });

  it('estimateColumnDataType performs well with early termination', () => {
    // Create a large column with mixed data types
    const column: string[] = [];
    for (let i = 0; i < 10000; i++) {
      if (i < 5) {
        column.push('123'); // First few are numbers
      } else {
        column.push('text_data'); // Rest are strings
      }
    }

    const startTime = performance.now();
    const type = estimateColumnDataType(column);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    // Should complete quickly due to early termination
    assert.ok(executionTime < 10, `estimateColumnDataType took ${executionTime}ms, expected < 10ms`);
    
    // Should correctly identify as string type
    assert.strictEqual(type, 'string');
    
    console.log(`✓ estimateColumnDataType processed 10,000 items with early termination in ${executionTime.toFixed(2)}ms`);
  });

  it('color generation is consistent and fast', () => {
    const startTime = performance.now();
    
    // Test color generation for many columns
    const colors: string[] = [];
    for (let i = 0; i < 1000; i++) {
      const color = getColumnColor('string', true, i);
      colors.push(color);
      assert.match(color, /^#[0-9a-fA-F]{6}$/, `Color ${color} should be valid hex`);
    }
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Should be very fast
    assert.ok(executionTime < 10, `Color generation took ${executionTime}ms for 1000 colors, expected < 10ms`);
    
    // Test cycling behavior - colors should repeat every 12 columns
    assert.strictEqual(colors[0], colors[12], 'Colors should cycle every 12 columns');
    assert.strictEqual(colors[1], colors[13], 'Colors should cycle every 12 columns');
    
    console.log(`✓ Generated 1000 colors in ${executionTime.toFixed(2)}ms`);
  });

  it('date detection performs well on mixed data', () => {
    const testValues = [
      '2023-01-01', '01/01/2023', '2023-12-31',
      'not-a-date', '123456', 'random text',
      '2023-02-29', '13/45/2023', '2023/13/01'
    ];
    
    // Repeat test data to create larger dataset
    const largeTestSet: string[] = [];
    for (let i = 0; i < 1000; i++) {
      largeTestSet.push(...testValues);
    }
    
    const startTime = performance.now();
    
    let dateCount = 0;
    for (const value of largeTestSet) {
      if (isDate(value)) {
        dateCount++;
      }
    }
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Should process 9000 items quickly
    assert.ok(executionTime < 100, `Date detection took ${executionTime}ms for ${largeTestSet.length} items, expected < 100ms`);
    
    // Should find valid dates
    assert.ok(dateCount > 0, 'Should find some valid dates');
    
    console.log(`✓ Processed ${largeTestSet.length} date checks in ${executionTime.toFixed(2)}ms, found ${dateCount} dates`);
  });

  it('HTML escaping performs well on large text', () => {
    // Create large text with many special characters
    const dangerousChars = ['<', '>', '&', '"', "'"];
    const largeText = dangerousChars.join('').repeat(10000);
    
    const startTime = performance.now();
    const escaped = escapeHtml(largeText);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    
    // Should escape quickly
    assert.ok(executionTime < 50, `HTML escaping took ${executionTime}ms for ${largeText.length} chars, expected < 50ms`);
    
    // Should not contain original dangerous characters
    assert.ok(!escaped.includes('<script>'), 'Should not contain unescaped script tags');
    assert.ok(escaped.includes('&lt;'), 'Should contain escaped characters');
    
    console.log(`✓ Escaped ${largeText.length} characters in ${executionTime.toFixed(2)}ms`);
  });

  it('memory usage stays reasonable for large datasets', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Process a large dataset
    const rows: string[][] = [];
    for (let i = 0; i < 5000; i++) {
      rows.push(['data1', 'data2', 'data3', 'data4', 'data5']);
    }
    
    const widths = computeColumnWidths(rows);
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
    
    // Memory increase should be reasonable (less than 50MB for 25k cells)
    assert.ok(memoryIncreaseMB < 50, `Memory increase: ${memoryIncreaseMB.toFixed(2)}MB, expected < 50MB`);
    
    console.log(`✓ Memory increase for 25,000 cells: ${memoryIncreaseMB.toFixed(2)}MB`);
    
    // Cleanup
    assert.ok(widths.length > 0, 'Should have computed widths');
  });
});
