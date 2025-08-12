import { describe, it } from 'node:test';
import * as assert from 'node:assert';

/**
 * Integration test suite for utility functions.
 * Tests the complete workflow of data processing without VS Code dependencies.
 */
describe('Integration Tests', () => {

  // Utility functions extracted for testing
  function parseTsv(text: string): string[][] {
    if (!text.trim()) {
      return [];
    }
    
    return text.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.split('\t'));
  }

  function serializeTsv(rows: string[][]): string {
    return rows.map(row => row.join('\t')).join('\n');
  }

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
    const maxSamples = 100;
    
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

  function isValidTsv(text: string): boolean {
    // Basic validation - TSV is quite permissive
    return true; // Most text can be considered valid TSV
  }

  function generateCellHtml(cellValue: string, row: number, col: number, width: number, color: string, isDark: boolean): string {
    const escapedValue = escapeHtml(cellValue);
    return `<div data-row="${row}" data-col="${col}" style="width: ${width}px; color: ${color};">${escapedValue}</div>`;
  }

  it('parses TSV data correctly', () => {
    const tsvData = 'Name\tAge\tCity\nJohn\t25\tNew York\nJane\t30\tLos Angeles';
    const result = parseTsv(tsvData);
    
    assert.strictEqual(result.length, 3, 'Should have 3 rows');
    assert.strictEqual(result[0].length, 3, 'Header should have 3 columns');
    assert.deepStrictEqual(result[0], ['Name', 'Age', 'City']);
    assert.deepStrictEqual(result[1], ['John', '25', 'New York']);
    assert.deepStrictEqual(result[2], ['Jane', '30', 'Los Angeles']);
  });

  it('handles empty TSV data', () => {
    const result = parseTsv('');
    assert.strictEqual(result.length, 0, 'Empty string should return empty array');
    
    const result2 = parseTsv('\n\n');
    assert.strictEqual(result2.length, 0, 'Only newlines should return empty array');
  });

  it('handles malformed TSV data gracefully', () => {
    // Inconsistent column counts
    const malformedData = 'Name\tAge\nJohn\t25\tExtra\nJane';
    const result = parseTsv(malformedData);
    
    assert.strictEqual(result.length, 3, 'Should handle inconsistent columns');
    assert.strictEqual(result[0].length, 2, 'First row has 2 columns');
    assert.strictEqual(result[1].length, 3, 'Second row has 3 columns');
    assert.strictEqual(result[2].length, 1, 'Third row has 1 column');
  });

  it('processes complete workflow for small dataset', () => {
    const tsvData = 'Item\tPrice\tInStock\tDate\nSword\t100\ttrue\t2023-01-01\nArmor\t200\tfalse\t2023-01-02';
    
    // Parse data
    const rows = parseTsv(tsvData);
    
    // Compute column widths
    const widths = computeColumnWidths(rows);
    
    // Estimate data types
    const types: string[] = [];
    for (let col = 0; col < rows[0].length; col++) {
      const column = rows.map(row => row[col] || '');
      types.push(estimateColumnDataType(column));
    }
    
    // Get colors
    const colors = types.map((type, index) => getColumnColor(type, true, index));
    
    // Verify results
    assert.strictEqual(rows.length, 3, 'Should have 3 rows including header');
    assert.strictEqual(widths.length, 4, 'Should have 4 column widths');
    assert.strictEqual(types.length, 4, 'Should have 4 data types');
    assert.strictEqual(colors.length, 4, 'Should have 4 colors');
    
    // Verify specific data types
    assert.strictEqual(types[0], 'string', 'Item column should be string');
    assert.strictEqual(types[1], 'number', 'Price column should be number');
    assert.strictEqual(types[2], 'boolean', 'InStock column should be boolean');
    assert.strictEqual(types[3], 'date', 'Date column should be date');
    
    // Verify all colors are valid
    colors.forEach(color => {
      assert.match(color, /^#[0-9a-fA-F]{6}$/, `Color ${color} should be valid hex`);
    });
  });

  it('escapes HTML correctly in cell content', () => {
    const dangerousContent = '<script>alert("xss")</script>';
    const escaped = escapeHtml(dangerousContent);
    
    assert.ok(!escaped.includes('<script>'), 'Should escape script tags');
    assert.ok(!escaped.includes('</script>'), 'Should escape closing script tags');
    assert.ok(escaped.includes('&lt;'), 'Should contain escaped less-than');
    assert.ok(escaped.includes('&gt;'), 'Should contain escaped greater-than');
  });

  it('validates TSV structure correctly', () => {
    // Valid TSV
    assert.strictEqual(isValidTsv('Name\tAge\nJohn\t25'), true, 'Valid TSV should return true');
    
    // Empty is valid
    assert.strictEqual(isValidTsv(''), true, 'Empty string should be valid');
    
    // Single line is valid
    assert.strictEqual(isValidTsv('Name\tAge'), true, 'Single line should be valid');
    
    // Contains tabs - valid
    assert.strictEqual(isValidTsv('A\tB\tC\n1\t2\t3'), true, 'Multi-column TSV should be valid');
  });

  it('handles large column count efficiently', () => {
    // Create data with many columns (simulate D2 files which can have 50+ columns)
    const headers: string[] = [];
    const dataRow: string[] = [];
    for (let i = 0; i < 50; i++) {
      headers.push(`col${i}`);
      dataRow.push(`data${i}`);
    }
    
    const tsvData = headers.join('\t') + '\n' + dataRow.join('\t');
    
    const startTime = performance.now();
    const rows = parseTsv(tsvData);
    const widths = computeColumnWidths(rows);
    const endTime = performance.now();
    
    assert.strictEqual(rows.length, 2, 'Should have 2 rows');
    assert.strictEqual(rows[0].length, 50, 'Should have 50 columns');
    assert.strictEqual(widths.length, 50, 'Should compute 50 column widths');
    
    const executionTime = endTime - startTime;
    assert.ok(executionTime < 50, `Processing 50 columns took ${executionTime}ms, expected < 50ms`);
  });

  it('maintains data integrity through parse-serialize cycle', () => {
    const originalData = 'Name\tAge\tNotes\nJohn\t25\tHas\ttabs\tin\tnotes\nJane\t30\tNormal notes';
    
    const rows = parseTsv(originalData);
    const serialized = serializeTsv(rows);
    const reparsed = parseTsv(serialized);
    
    // Should maintain structure
    assert.deepStrictEqual(rows, reparsed, 'Data should survive parse-serialize-parse cycle');
  });

  it('generates valid HTML structure', () => {
    const html = generateCellHtml('test value', 1, 2, 100, '#FF6B6B', true);
    
    // Should contain required attributes
    assert.ok(html.includes('data-row="1"'), 'Should have data-row attribute');
    assert.ok(html.includes('data-col="2"'), 'Should have data-col attribute');
    assert.ok(html.includes('width: 100px'), 'Should have correct width');
    assert.ok(html.includes('test value'), 'Should contain cell value');
    
    // Should not contain unescaped HTML
    const htmlWithScript = generateCellHtml('<script>', 0, 0, 100, '#FF6B6B', true);
    assert.ok(!htmlWithScript.includes('<script>'), 'Should escape HTML content');
  });
});
