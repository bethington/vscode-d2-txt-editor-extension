import assert from 'assert';
import { describe, it } from 'node:test';
import Module from 'module';

// Stub the 'vscode' module used by extension.ts so it can be imported in a
// regular Node environment. Only the utilities are tested here so an empty
// object is sufficient.
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string) {
  if (id === 'vscode') {
    return {} as any;
  }
  return originalRequire.apply(this, arguments as any);
};

import { TsvEditorProvider } from '../extension';

// Helper to access private methods via type casting
function getPrivate<T>(obj: any, name: string): T {
  return obj[name] as T;
}

describe('TsvEditorProvider utility methods', () => {
  const provider = new TsvEditorProvider({} as any);

  it('computeColumnWidths returns max length per column', () => {
    const data = [
      ['a', 'bb', 'ccc'],
      ['dddd', 'ee', 'f']
    ];
    const compute = getPrivate<(d: string[][]) => number[]>(provider, 'computeColumnWidths').bind(provider);
    const widths = compute(data);
    assert.deepStrictEqual(widths, [4, 2, 3]);
  });

  it('isDate correctly identifies date strings', () => {
    const isDate = getPrivate<(v: string) => boolean>(provider, 'isDate').bind(provider);
    assert.strictEqual(isDate('2024-01-02'), true);
    assert.strictEqual(isDate('not-a-date'), false);
  });

  it('estimateColumnDataType detects common types', () => {
    const estimate = getPrivate<(c: string[]) => string>(provider, 'estimateColumnDataType').bind(provider);
    assert.strictEqual(estimate(['true', 'FALSE']), 'boolean');
    assert.strictEqual(estimate(['2020-01-01', '1999-12-31']), 'date');
    assert.strictEqual(estimate(['0x1', '0x2']), 'integer');
    assert.strictEqual(estimate(['1.2e0', '3.4e0']), 'float');
    assert.strictEqual(estimate(['', '']), 'empty');
    assert.strictEqual(estimate(['hello', '1a']), 'string');
  });

  it('getColumnColor returns hex colors', () => {
    const getColor = getPrivate<(t: string, dark: boolean, i: number) => string>(provider, 'getColumnColor').bind(provider);
    
    // Test that colors are based on column index, not data type
    assert.strictEqual(getColor('empty', true, 0), '#FF6B6B');   // First dark theme color
    assert.strictEqual(getColor('empty', false, 0), '#C0392B');  // First light theme color
    assert.strictEqual(getColor('string', true, 1), '#4ECDC4');  // Second dark theme color
    assert.strictEqual(getColor('boolean', false, 1), '#138D75'); // Second light theme color
    
    // Test cycling behavior - index 12 should return first color again
    assert.strictEqual(getColor('number', true, 12), '#FF6B6B');  // Should cycle back to first
    
    // Test that all colors are valid hex
    const hex = getColor('boolean', true, 2);
    assert.match(hex, /^#[0-9a-fA-F]{6}$/);
  });

  it('hslToHex converts known colors', () => {
    const hslToHex = getPrivate<(h:number,s:number,l:number)=>string>(provider, 'hslToHex').bind(provider);
    assert.strictEqual(hslToHex(0, 100, 50), '#ff0000');   // red
    assert.strictEqual(hslToHex(120, 100, 50), '#00ff00'); // green
    assert.strictEqual(hslToHex(240, 100, 50), '#0000ff'); // blue
  });
});
