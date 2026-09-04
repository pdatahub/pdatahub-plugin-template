/**
 * Example plugin — replace this with your own.
 *
 * This plugin demonstrates:
 *   1. A simple `@Tool` that hits a public HTTP API (no auth required)
 *   2. A commented-out `@OAuth` decorator showing how to wire OAuth
 *
 * To customize:
 *   1. Rename the class and update `name` / `version`
 *   2. Add your own `@Tool` methods
 *   3. (Optional) Add `@OAuth` for authenticated APIs (Hub handles the dance)
 *   4. Update input schema and scope to match your domain
 *
 * Plugin naming convention (see pdatahub docs):
 *   - Plugin identity is provider-specific: pdatahub-plugin-<provider>
 *   - Tool names are abstract categories: <domain>.<verb>.<noun>
 *
 * Examples:
 *   google-calendar → tool "calendar.read.events"
 *   slack           → tool "messages.list"
 *   github          → tool "issues.list", "prs.merge"
 *
 * IMPORTANT: clientId / clientSecret are NOT in `@OAuth` — those are Hub
 * concerns (stored encrypted in Hub's TokenDao). Plugin only declares the
 * OAuth endpoints. Hub does the dance, stores tokens, injects access_token
 * via `this.httpClient` on every `tools/call`.
 */

import { Plugin, Tool } from '@pdatahub/plugin-sdk';

export default class ExamplePlugin extends Plugin {
  name = 'example';
  version = '0.1.0';

  /**
   * Fetch a random cat fact from a public API. Demonstrates:
   *   - `@Tool` decorator
   *   - `this.httpClient.get()` with params
   *   - Returning parsed JSON
   *
   * Replace this with your own tool.
   */
  @Tool({
    scope: 'facts:read',
    description: 'Fetch a random cat fact. Useful for smoke-testing plugin wiring.',
  })
  async getCatFact(): Promise<{ fact: string; length: number }> {
    const { data } = await this.httpClient!.get<{ fact: string; length: number }>(
      'https://catfact.ninja/fact',
    );
    return data;
  }

  /**
   * Example showing how to add OAuth. Uncomment and customize for your provider.
   * Note: NO clientId / clientSecret — Hub handles OAuth dance and stores
   * tokens in its encrypted TokenDao. Your plugin just declares endpoints.
   *
  @OAuth({
    authorizationUrl: 'https://provider.com/oauth/authorize',
    tokenUrl: 'https://provider.com/oauth/token',
    scopes: ['read:user', 'read:data'],
  })
  // And one of the tools:
  @Tool({
    scope: 'user:read',
    description: 'Read the authenticated user profile.',
  })
  async getMe() {
    const { data } = await this.httpClient!.get('https://api.provider.com/v1/me');
    return data;
  }
  */
}
