import { describe, it, expect } from 'vitest';
import { buildManifest } from '@pdatahub/plugin-sdk';
import ExamplePlugin from '../src/plugin.js';

describe('ExamplePlugin', () => {
  it('declares correct identity', () => {
    const p = new ExamplePlugin();
    expect(p.name).toBe('example');
    expect(p.version).toBe('0.1.0');
  });

  it('exposes getCatFact in the manifest', () => {
    const manifest = buildManifest(new ExamplePlugin());
    const tool = manifest.tools.find((t) => t.name === 'getCatFact');
    expect(tool).toBeDefined();
    expect(tool?.scope).toBe('facts:read');
  });

  it('has at least one @Tool', () => {
    const manifest = buildManifest(new ExamplePlugin());
    expect(manifest.tools.length).toBeGreaterThan(0);
  });
});
