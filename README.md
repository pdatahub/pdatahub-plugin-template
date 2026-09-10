# pdatahub-plugin-template

[![CI](https://github.com/pdatahub/pdatahub-plugin-template/actions/workflows/ci.yml/badge.svg)](https://github.com/pdatahub/pdatahub-plugin-template/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node 20+](https://img.shields.io/badge/node-20%2B-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6)](https://www.typescriptlang.org)
[![SDK v0.2.2](https://img.shields.io/badge/SDK-v0.2.3-blue)](https://github.com/pdatahub/pdatahub/releases/tag/sdk-v0.2.2)

Template for [pdatahub](https://github.com/pdatahub/pdatahub) plugins. Click **"Use this template"** on GitHub to create your own plugin repository.

## What is a pdatahub plugin?

A plugin extends the pdatahub Hub with integrations to external services (Google Calendar, Slack, GitHub, etc.). It runs as a Node.js subprocess on the user's Hub (phone), speaks JSON-RPC over stdio to the Hub, and exposes `@Tool` methods that AI agents can invoke.

## Quick start

### 1. Use this template

On GitHub: click **Use this template** → **Create a new repository**. Name it `pdatahub-plugin-<your-provider>`.

### 2. Install and test

```bash
git clone https://github.com/pdatahub/pdatahub-plugin-<your-provider>.git
cd pdatahub-plugin-<your-provider>
pnpm install
pnpm test
```

The example plugin (`getCatFact`) should pass its smoke test.

### 3. Customize

Edit `src/plugin.ts`:

```typescript
import { Plugin, Tool } from '@pdatahub/plugin-sdk';

export default class MyServicePlugin extends Plugin {
  name = 'myservice';
  version = '0.1.0';

  @Tool({
    scope: 'myservice:read',
    description: 'Read items from MyService',
  })
  async listItems(limit = 10) {
    const { data } = await this.http!.get('items', { params: { limit } });
    return data;
  }
}
```

Update:
- `name` and `version` — your plugin identity
- The `@Tool` methods — your integrations
- `package.json` — `name`, `description`, `repository`

### 4. (Optional) Add OAuth

For authenticated APIs, add an `@OAuth` decorator:

```typescript
import { Plugin, Tool, OAuth } from '@pdatahub/plugin-sdk';

@OAuth({
  authorizationUrl: 'https://provider.com/oauth/authorize',
  tokenUrl: 'https://provider.com/oauth/token',
  scopes: ['read:user'],
  clientId: process.env.PROVIDER_CLIENT_ID,
  clientSecret: process.env.PROVIDER_CLIENT_SECRET,
})
export default class MyPlugin extends Plugin {
  // ...
}
```

The Hub handles the OAuth dance, token storage, and refresh. Your plugin just gets `this.http` with the bearer token already injected.

### 5. Build

```bash
pnpm build
```

Outputs `dist/plugin.js` and `dist/plugin.d.ts`.

### 6. Publish (when ready)

```bash
pnpm publish --access public
```

Tag your repo as `pdatahub-plugin-<provider>` so the Hub can discover it.

## Conventions

### Plugin identity

- npm package name: `pdatahub-plugin-<provider>` (e.g. `pdatahub-plugin-google-calendar`)
- npm scope: `@pdatahub/<something>` only for core packages (don't use for 3rd-party plugins)
- Plugin class `name`: provider-specific slug (`google-calendar`, `slack`)
- Plugin class `version`: semver

### Tool names

Tools are abstract — Hub routes calls like `calendar.read.events` to whichever calendar plugin the user has installed.

Format: `<domain>.<verb>.<noun>` (lowercase, dot-separated).

| Provider plugin | Tool name |
|---|---|
| `google-calendar`, `outlook-calendar`, `icloud-calendar` | `calendar.read.events`, `calendar.create.event` |
| `slack`, `discord`, `telegram` | `messages.list`, `messages.send` |
| `github`, `gitlab` | `issues.list`, `prs.merge` |
| `notion`, `obsidian` | `pages.read`, `pages.write` |

Pick a tool name that fits your plugin's domain. If two plugins claim the same tool name, the user picks one at install time.

### Scopes

Match OAuth scopes:
- `calendar:read` ↔ Google Calendar `https://www.googleapis.com/auth/calendar.readonly`
- `messages:write` ↔ Slack `chat:write`

Use `:` as separator. Lowercase.

### TypeScript

- `strict: true`
- `target: ES2022`, `module: Node16`
- Stage 3 decorators with `experimentalDecorators: true`
- No `reflect-metadata` — the SDK uses WeakMaps

## Architecture

```
┌──────────────┐  JSON-RPC   ┌─────────────┐  HTTPS  ┌──────────────┐
│  pdatahub    │ ◄─────────► │ Your plugin │ ──────► │   Provider   │
│  Hub         │  over stdio │ (subprocess)│         │   API        │
│ (laptop/cloud)            └─────────────┘         └──────────────┘
└──────────────┘
```

- Hub spawns your plugin as a subprocess
- Plugin sends manifest on startup
- AI agent (via MCP) → Hub → your plugin → Provider API
- Responses bubble back the same way

Your plugin must:
- Send all logs to **stderr** (stdout is the protocol channel)
- Exit cleanly on `shutdown` request from Hub

## Testing

```bash
pnpm test
```

The example test verifies the manifest is built correctly. For provider-specific tests, mock the HTTP client:

```typescript
import { vi } from 'vitest';
import MyPlugin from '../src/plugin.js';

const plugin = new MyPlugin();
(plugin as any).http = {
  get: vi.fn().mockResolvedValue({ data: [{ id: '1', name: 'Test' }] }),
};
```

## Reference plugins

- [`pdatahub-plugin-google-calendar`](https://github.com/pdatahub/pdatahub-plugin-google-calendar) — reference implementation with real OAuth

## Documentation

For deeper coverage of plugin development (decorators, OAuth integration, distribution, best practices), see the [pdatahub plugin author guide](https://github.com/pdatahub/pdatahub/blob/main/docs/plugin-author-guide.md) in the monorepo.

## License

MIT
