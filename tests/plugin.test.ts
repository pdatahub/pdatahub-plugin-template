import { describe, it, expect } from 'vitest';
import { buildManifest } from '@pdatahub/plugin-sdk';
import ExamplePlugin from '../src/plugin.js';

describe('ExamplePlugin', () => {
  it('declares correct identity', () => {
    const p = new ExamplePlugin();
    expect(p.name).toBe('example');
    expect(p.version).toBe('0.2.0');
  });

  it('opts in to SDK v2 protocolVersion', () => {
    const p = new ExamplePlugin();
    expect(p.protocolVersion).toBe(2);
  });

  it('declares v2 capabilities', () => {
    const p = new ExamplePlugin();
    expect(p.capabilities).toEqual(
      expect.arrayContaining(['typed-errors', 'schema-validation']),
    );
  });

  it('exposes getCatFact in the manifest with inputSchema', () => {
    const manifest = buildManifest(new ExamplePlugin());
    const tool = manifest.tools.find((t) => t.name === 'getCatFact');
    expect(tool).toBeDefined();
    expect(tool?.scope).toBe('facts:read');
    expect(tool?.inputSchema).toBeDefined();
    expect(tool?.inputSchema?.type).toBe('object');
  });

  it('has at least one @Tool', () => {
    const manifest = buildManifest(new ExamplePlugin());
    expect(manifest.tools.length).toBeGreaterThan(0);
  });
});
