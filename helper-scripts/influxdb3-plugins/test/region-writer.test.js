import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeGeneratedRegion, transformContent } from '../port_to_docs.js';

test('wraps content in markers when the target has none yet', () => {
  const result = mergeGeneratedRegion(null, 'Generated body text.');

  assert.equal(
    result.content,
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
      'Generated body text.\n' +
      '<!-- END GENERATED PLUGIN CONTENT -->\n'
  );
  assert.equal(result.error, undefined);
});

test('reports an error for an unterminated begin marker instead of writing', () => {
  const existing =
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
    'Old generated body, missing its end marker.\n' +
    '\n' +
    '## Schema requirements\n' +
    '\n' +
    'Hand-written text.\n';

  const result = mergeGeneratedRegion(existing, 'New generated body.');

  assert.equal(result.content, undefined);
  assert.match(result.error, /marker/i);
});

test('preserves hand-owned content after the generated region', () => {
  const existing =
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
    'Old generated body.\n' +
    '<!-- END GENERATED PLUGIN CONTENT -->\n' +
    '\n' +
    '## Schema requirements\n' +
    '\n' +
    'Hand-written text that must survive regeneration.\n';

  const result = mergeGeneratedRegion(existing, 'New generated body.');

  assert.equal(
    result.content,
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
      'New generated body.\n' +
      '<!-- END GENERATED PLUGIN CONTENT -->\n' +
      '\n' +
      '## Schema requirements\n' +
      '\n' +
      'Hand-written text that must survive regeneration.\n'
  );
  assert.equal(result.error, undefined);
});

test('exempts abbreviated JSON examples from code-block parsing', () => {
  const transformed = transformContent(
    '# Example\n\n```json\n{"items": [{"value": 1}, ...]}\n```',
    'example'
  );

  assert.match(transformed, /```json \{lint="false"\}/);
});

test('normalizes tabs used to indent Markdown list items', () => {
  const transformed = transformContent('# Example\n\n \t- Item', 'example');

  assert.match(transformed, /^- Item$/m);
  assert.doesNotMatch(transformed, /^\s*\t/m);
});

test('exempts generated upstream prose from Vale', () => {
  const transformed = transformContent('# Example', 'example');

  assert.match(transformed, /^<!-- vale off -->$/m);
  assert.match(transformed, /<!-- vale on -->$/);
});

test('wraps a JSON property fragment in a complete object', () => {
  const transformed = transformContent(
    '# Example\n\n```json\n"backtest": {\n  "points": 11\n}\n```',
    'example'
  );
  const body = transformed.match(/```json\n([\s\S]*?)```/)[1];
  assert.deepEqual(JSON.parse(body), { backtest: { points: 11 } });
  assert.doesNotMatch(transformed, /lint="false"/);
});

test('leaves malformed JSON property fragments subject to validation', () => {
  const fragment = '```json\n"backtest": {"points": }\n```';
  const transformed = transformContent(`# Example\n\n${fragment}`, 'example');
  assert.ok(transformed.includes(fragment));
});

test('preserves the full minimum version in a supported callout', () => {
  const transformed = transformContent(
    '> **Note:** This plugin requires InfluxDB 3.8.2 or later.',
    'prophet_forecasting'
  );

  assert.match(
    transformed,
    /> \[!Note\]\n> This plugin requires {{% product-name %}} 3\.8\.2 or later\./
  );
});

test('resolves JSON asset links for both shared-page consumers', () => {
  const transformed = transformContent(
    '[Contract](forecast_interface.json) and [schema](./forecast_interface.json#properties)',
    'prophet_forecasting'
  );

  const url =
    'https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/prophet_forecasting/forecast_interface.json';
  assert.ok(transformed.includes(`[Contract](${url})`));
  assert.ok(transformed.includes(`[schema](${url}#properties)`));
});

test('expands curl options without changing quoted request data', () => {
  const transformed = transformContent(
    '```bash\ncurl -X POST "http://localhost:8181/api/v3/engine/forecast" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"label": "keep -X -H -d"}\'\n```',
    'prophet_forecasting'
  );

  assert.ok(transformed.includes('curl --request POST'));
  assert.ok(transformed.includes('--header "Content-Type: application/json"'));
  assert.ok(transformed.includes('--data \'{"label": "keep -X -H -d"}\''));
});

test('preserves Explorer references and absolute asset links', () => {
  const source =
    'InfluxDB 3 Explorer: [contract](https://example.com/forecast_interface.json)';
  assert.ok(transformContent(source, 'prophet_forecasting').includes(source));
});

test('leaves complete JSON objects unchanged', () => {
  const source = '```json\n{"backtest": {"points": 12}}\n```';
  assert.ok(transformContent(source, 'prophet_forecasting').includes(source));
});
