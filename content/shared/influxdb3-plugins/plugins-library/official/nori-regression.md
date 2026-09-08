<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later (it uses the synchronous write API).

Predict a numeric field in an {{% product-name %}} measurement from other columns on the same rows with
**Nori**, Synthefy's in-context-learning tabular regression model, called through the Synthefy
inference gateway. The plugin reads a window of rows, trains on the rows where the target field is
present, predicts the rows where it is null (imputation / backfill), and writes the predicted values
back into InfluxDB.


Nori is a tabular regression foundation model: you give it labeled feature rows (`X_train`,
`y_train`) and query rows (`X_test`) in a single request, and it predicts a value for each query row
in one forward pass, with no training or fine-tuning step.

This plugin applies Nori to an InfluxDB measurement. You choose a target field and a set of feature
columns; the plugin uses the rows where the target is present as the in-context training set and
predicts the target for the rows where it is null, writing each prediction back at its own row's
timestamp. It is plain tabular regression: Nori sees only the feature columns you name, with no time
or ordering assumptions.

Typical uses:

- Backfill a field that dropped out (a sensor went offline while its neighbors kept reporting).
- Impute a missing metric from correlated ones (for example, predict `pressure` from `temperature`
  and `humidity`).
- Derive a field that is expensive to measure directly from cheaper ones recorded alongside it.

Key features:

- **In-context tabular regression**: no training step; the recent labeled rows are the context.
- **Imputation / backfill**: predicts the rows where the target is null and writes them back.
- **Scheduled or on-demand**: run on an interval, or call an HTTP endpoint with an explicit window.
- **Idempotent by default**: rows that already hold a prediction are skipped, so a repeating
  schedule does not re-send and re-pay for the same rows.
- **Bounded cost**: row caps and a batch size keep one run's billed rows predictable.
- **Single-series guarantee**: a run that resolves to more than one series fails before it calls the
  gateway, rather than training one model on two mixed series.

## Configuration

Plugin parameters may be given as key-value pairs in the `--trigger-arguments` flag of
`influxdb3 create trigger`, in the `trigger_arguments` field of the API, or entirely from a TOML
file via `config_file_path` — see [TOML configuration](#toml-configuration). For the HTTP trigger, a
documented subset may also be sent in the JSON request body.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that declares the supported trigger
types (`scheduled`, `http`) and every parameter each accepts, so the
[InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI can render a configuration
form.

### Authentication for the Nori gateway

The Nori gateway API key is a secret and is **never** read from trigger arguments or the request
body (both are logged). It is resolved, in order:

1. a non-empty `X-Nori-Api-Key: <key>` request header (HTTP trigger only), then
2. the `SYNTHEFY_NORI_API_KEY` environment variable set on the InfluxDB host (required for the
   scheduled trigger).

The key is intentionally **not** accepted in the `Authorization` header: InfluxDB parses
`Authorization` for its own request authorization, so a key placed there never reaches the plugin.
Use the custom `X-Nori-Api-Key` header instead.

Get a Nori API key from the [Synthefy console](https://console.synthefy.com/). One key covers every
model slug its group is granted (see [Supported models](#supported-models)), so you do not normally
need a key per variant. This plugin does not create keys.

The gateway endpoint itself is **not** a parameter: the request carries the operator's API key and
the training data, so a caller must never be able to choose its destination. An operator running a
private gateway can point the plugin at it with the `NORI_GATEWAY_URL` environment variable on the
InfluxDB host. It must be an `https://` URL; plain `http://` is accepted only for a loopback host
(`localhost`, `127.0.0.1` or `::1`), so a local mock gateway still works in testing.

### Required parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `measurement` | string | required | Source measurement (table) to read from. |
| `field` | string | required | The numeric field to predict. The plugin trains on the rows where it is present and predicts the rows where it is null. |
| `feature_fields` | string | required | Numeric feature columns (X) used to predict `field`, **space-separated** (for example `temp humidity`). Use spaces, not commas (`--trigger-arguments` splits argument pairs on commas) and not dots (a field name may contain a `.`). |
| `model` | string | required | The Nori gateway slug to call. There is no default: the slug selects a priced model, so the plugin will not choose one for you. See [Supported models](#supported-models). Trigger argument only. |

A column name that contains a space cannot be expressed in `feature_fields` as a trigger argument,
because every string form splits on whitespace. Name such a column from a TOML array
(`feature_fields = ["air temp", "humidity"]`) or from a JSON list in the HTTP body.

### Optional parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `window` | string | `30d` | Time window of rows to read, ending at the trigger's call time. Units: `s`, `min`, `h`, `d`, `w`, with an integer magnitude. |
| `start_time` | string | *(none)* | ISO 8601 start of a fixed window. Given alone, the window ends now. |
| `end_time` | string | *(none)* | ISO 8601 end of a fixed window. Given alone, the window starts one `window` earlier. |
| `tags` | string | *(none)* | Filter to a single series. Format: `key:val key2:val2` (space-separated pairs, one value per key). A token without a `:` is rejected. Required when the window holds more than one series. |
| `output_measurement` | string | `<measurement>_regressed` | Measurement to write predictions to. Must differ from `measurement`. |
| `target_database` | string | *(trigger db)* | Write predictions to a different database. |
| `dry_run` | boolean | `false` | Log the first few predictions and return them all, without writing anything. |
| `skip_existing` | boolean | `true` | Skip rows that already hold a prediction in `output_measurement`. Set `false` to refresh earlier predictions with newer training data. |
| `min_history` | integer | `50` | Minimum labeled rows required to train; the run is skipped below this. |
| `max_train_rows` | integer | `1000` | Cap on labeled rows sent as the training context; the most recent rows are kept. This is the main cost control — the gateway bills per training row and column. |
| `max_predict_rows` | integer | `5000` | Cap on rows predicted per run; the most recent rows are kept and the rest wait for a later run. |
| `max_read_rows` | integer | `50000` | Ceiling on rows read from InfluxDB in one run, applied as a `LIMIT` on the query. The most recent rows are read, and a truncated read is logged with a warning. This bounds the plugin's memory: a row costs roughly 0.7 KB while it is held, so the default is about 35 MB. |
| `predict_batch_size` | integer | `1000` | Rows per gateway call. Each batch re-sends the training context and is billed separately, so a larger value costs less. |
| `request_timeout` | string | `300s` | Timeout for one gateway call. A model that has scaled to zero cold-starts on the first request, measured between roughly one and four minutes depending on the variant, so keep this well above the warm response time. |
| `max_retries` | integer | `3` | Maximum attempts per gateway call and per write. `1` disables retry. |
| `config_file_path` | string | *(none)* | Path to a TOML file supplying every parameter, relative to `PLUGIN_DIR`. Cannot be combined with other inline arguments or a request body. |

Two constraints are checked before anything runs: `min_history` must not exceed `max_train_rows`
(no run could otherwise ever qualify), and `output_measurement` must differ from `measurement`. All
of the integer parameters must be at least `1`.

### HTTP request body parameters

On the HTTP trigger, these keys may be sent in the JSON request body:

`measurement`, `field`, `feature_fields`, `tags`, `window`, `start_time`, `end_time`, `dry_run`.

`feature_fields` may be a JSON list (`{"feature_fields": ["temp", "humidity"]}`) or a
space-separated string, and `tags` may be a JSON object (`{"tags": {"site": "A"}}`).

**A trigger argument pins its value.** The body may fill in what the trigger left open, but it
cannot change what the trigger already set — that is rejected. So an operator who wants the request
to choose the measurement creates the trigger without one, and an operator who wants it fixed sets
it as a trigger argument. This matters because `output_measurement` defaults to
`<measurement>_regressed`: without the pin, a body-supplied `measurement` would move the write
target too.

Every other parameter is **operator-only** and is rejected by name if it appears in the body. The
endpoint is reachable by anyone holding a database token, so the model slug (which selects a billed
model), the write targets (`output_measurement`, `target_database`), the row caps, the timeout and
`config_file_path` stay under the control of whoever created the trigger.

`gateway_url` is not a parameter at all, in either place — use the `NORI_GATEWAY_URL` environment
variable. Passing it (or a parameter from the plugin's earlier forecasting revision: `mode`,
`horizon`, `step`, `lags`, `rolling`, `tz`) is rejected with a message naming the replacement, rather
than ignored.

### TOML configuration

Set the `PLUGIN_DIR` environment variable and reference the file with the `config_file_path` trigger
argument (relative paths resolve against `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent
of `VIRTUAL_ENV`). The TOML file then supplies **all** parameters — it is mutually exclusive with
inline trigger arguments and with an HTTP request body. See
[`nori_regression_config_scheduler.toml`](nori_regression_config_scheduler.toml) for an annotated
template.

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/nori_regression/nori_regression.py" \
  --trigger-spec "every:1h" \
  --trigger-arguments config_file_path=nori_regression_config_scheduler.toml \
  nori_from_toml
```
## Requirements

### Software requirements

- **{{% product-name %}} Core or Enterprise**, version 3.8.2 or later, with the Processing Engine enabled
  (`influxdb3 serve --plugin-dir /path/to/plugins`).
- **Python packages**: `influxdata-plugin-utils>=0.3.0`, `requests`.
- A **Nori API key** from the [Synthefy console](https://console.synthefy.com/), reachable from the
  InfluxDB host over HTTPS.

### Installation steps

1. Install the Python dependencies into the {{% product-name %}} Processing Engine environment:

   ```bash
   influxdb3 install package influxdata-plugin-utils requests
   ```
2. Reference the plugin directly from this repository with the `gh:` prefix (the form used in the
   examples below): `--path "gh:influxdata/nori_regression/nori_regression.py"`. Alternatively, copy
   `nori_regression.py` into your plugin directory (the one passed to `influxdb3 serve
   --plugin-dir`) and use `--path nori_regression.py`.

3. Set the Nori gateway key on the InfluxDB host, so the scheduled trigger can read it:

   ```bash
   export SYNTHEFY_NORI_API_KEY="<your Nori API key>"
   ```
### Data requirements

- The measurement holds at least `min_history` rows where the target `field` is present **and**
  every `feature_fields` column is present. Those rows are the training context.
- It holds at least one row where the target is null and every feature is present. Those rows are
  what gets predicted; if there are none, the run is a no-op.
- The window resolves to a **single series**. If the measurement holds several series (one per
  `site`, say), pass a `tags` filter that isolates one, or create one trigger per series.
- The features actually explain the target. Nori sees no time and no row order, so a target that
  depends on time rather than on the feature columns is not a good fit for this plugin.

### Schema requirements

The plugin reads `information_schema.columns` before it queries data, and fails with a message
naming the offending column if the schema cannot serve the request:

| Column | Required type |
|---|---|
| `time` | timestamp (every InfluxDB measurement has one) |
| `field` (the target) | numeric field: `Int64`, `UInt64`, `Int32`, `Float64` or `Float32` |
| each `feature_fields` entry | numeric field, and neither the target nor `time` |
| each `tags` key | a tag column (`Dictionary(Int32, Utf8)`), not a field |
| the source tag columns | none named `model`, `source` or `target` |

A string or boolean column named as a feature is rejected here rather than coerced to null, which
would otherwise surface much later as `only 0 labeled rows`.

The last row matters because every output point carries `model`, `source` and `target` tags for
provenance. A source tag with one of those names would overwrite the provenance on write *and* make
the `skip_existing` lookup contradict itself, so the run would silently re-send and re-pay for the
same rows on every tick. The plugin refuses the configuration instead.

## Trigger setup

### Scheduled trigger

Every 15 minutes, fill any rows of `sensors` (for `site=A`) that are missing `pressure`, predicting
it from `temp` and `humidity`:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/nori_regression/nori_regression.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments measurement=sensors,field=pressure,feature_fields="temp humidity",tags=site:A,model=synthefy/nori-30m \
  nori_sensors_pressure
```
Because `skip_existing` defaults to `true`, each subsequent run only sends the rows that still have
no prediction. Once the window is fully imputed, the trigger stops calling the gateway entirely.

### HTTP trigger

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/nori_regression/nori_regression.py" \
  --trigger-spec "request:nori_regress" \
  nori_http
```
## Example usage

### Example 1: impute a missing field on a schedule

Write sample data. The plugin needs at least `min_history` complete rows to train on, so this
example lowers that to `3` — a real deployment should leave it at the default and train on far more.
The last two rows carry `temp` and `humidity` but no `pressure`, and those are the ones that get
imputed:

```bash
influxdb3 write --database mydb --precision s "
sensors,site=A temp=20.0,humidity=40.0,pressure=1000.0 1767225600
sensors,site=A temp=22.0,humidity=41.0,pressure=1000.7 1767225660
sensors,site=A temp=24.0,humidity=42.0,pressure=1001.4 1767225720
sensors,site=A temp=25.0,humidity=45.0 1767229200
sensors,site=A temp=21.0,humidity=41.0 1767229260
"
```
```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/nori_regression/nori_regression.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments measurement=sensors,field=pressure,feature_fields="temp humidity",tags=site:A,model=synthefy/nori-30m,min_history=3 \
  nori_example
```
Read the predictions back after the trigger runs:

```bash
influxdb3 query --database mydb "
SELECT time, value, model, target, site
FROM sensors_regressed
ORDER BY time DESC
LIMIT 5
"
```
**Expected output:**

```
+---------------------+--------+-------------------+----------+------+
| time                | value  | model             | target   | site |
+---------------------+--------+-------------------+----------+------+
| 2026-01-01T01:01:00 | 998.2  | synthefy/nori-30m | pressure | A    |
| 2026-01-01T01:00:00 | 999.0  | synthefy/nori-30m | pressure | A    |
+---------------------+--------+-------------------+----------+------+
```
### Example 2: on-demand HTTP regression

Call the HTTP endpoint (exposed at `/api/v3/engine/<path>`), passing the Nori key in the header:

```bash
curl -X POST http://localhost:8181/api/v3/engine/nori_regress \
  -H "X-Nori-Api-Key: $SYNTHEFY_NORI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"measurement":"sensors","field":"pressure","feature_fields":["temp","humidity"],"tags":{"site":"A"}}'
```
**Expected output:**

```json {lint="false"}
{"status": "success", "task_id": "...", "result": {"status": "success", "written": 24}}
```
A run that had nothing to do reports its real outcome instead of a bare success:

```json {lint="false"}
{"status": "skipped", "task_id": "...", "result": {"status": "skipped", "written": 0}}
```
A run stopped part-way by a gateway fault keeps the batches it already paid for and reports the
shortfall, so a caller never reads a partial result as a complete one:

```json {lint="false"}
{"status": "partial", "task_id": "...", "result": {"status": "partial", "written": 8, "remaining": 12}}
```
The top-level `status` is one of `success`, `partial`, `skipped`, `dry_run` or `failed`.

### Example 3: backfill a specific window

```bash
curl -X POST http://localhost:8181/api/v3/engine/nori_regress \
  -H "X-Nori-Api-Key: $SYNTHEFY_NORI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"measurement":"sensors","field":"pressure","feature_fields":["temp","humidity"],"tags":{"site":"A"},"start_time":"2026-01-01T00:00:00Z","end_time":"2026-02-01T00:00:00Z"}'
```
Either bound may be given alone: `start_time` on its own reads up to now, and `end_time` on its own
reads the `window` before it.

### Example 4: dry run (preview without writing)

```bash
curl -X POST http://localhost:8181/api/v3/engine/nori_regress \
  -H "X-Nori-Api-Key: $SYNTHEFY_NORI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"measurement":"sensors","field":"pressure","feature_fields":["temp","humidity"],"tags":{"site":"A"},"dry_run":true}'
```
## Output format

Each prediction is written as a point:

- **Measurement:** `output_measurement` (default `<measurement>_regressed`).
- **Tags:** `model` (the slug), `source` (the input measurement), `target` (the predicted field),
  plus every tag of the source series (not only the tags you filtered on), so a point can always be
  traced back to the series it was predicted for.
- **Field:** `value` (float): the predicted target value.
- **Timestamp:** the predicted row's own timestamp (nanoseconds).

Example line protocol:

```
sensors_regressed,model=synthefy/nori-30m,source=sensors,target=pressure,site=A value=1001.2 1767225600000000000
```
## Cost and metering

Every gateway call is a billed request, priced from the **training** rows and columns you send
(`max_train_rows` x the number of `feature_fields`), with a per-request floor. Three settings
control what a run costs:

- `max_train_rows` bounds the priced rows in every call.
- `predict_batch_size` bounds the number of calls: each batch re-sends the same training context and
  is billed again, so a larger batch size is cheaper.
- `skip_existing` (on by default) stops a repeating schedule from paying for rows it has already
  predicted. With it off, an `every:15m` trigger over a 30-day window re-sends each row roughly
  2,880 times.

## Querying predictions

```bash
influxdb3 query --database mydb "
SELECT date_trunc('hour', time) AS hour, count(*) AS predicted, avg(value) AS mean_value
FROM sensors_regressed
WHERE target = 'pressure'
GROUP BY 1
ORDER BY 1 DESC
"
```
## Notes

- **What it predicts:** rows in the window where the target `field` is null but every
  `feature_fields` column is present. Rows where the target is already present become the training
  set. It never overwrites an existing target value.
- **One series per run:** the plugin counts the distinct tag combinations in the window and fails
  before calling the gateway if there is more than one, because predictions are written back at each
  row's own timestamp and two series would train as one model.
- **Features only:** Nori sees just the columns you name in `feature_fields`. Row order does not
  matter, and no time-derived features are added.
- **Non-finite predictions:** the gateway returns JSON `null` for a row it cannot produce a finite
  value for. Those rows are skipped and counted in the log; a batch that is entirely null fails
  rather than reporting a successful run that wrote nothing.
- **A partial run keeps what it paid for, and says so:** if a later batch fails, the predictions the
  earlier batches already returned are still written, because those batches were already billed. The
  run reports `{"status": "partial", "written": N, "remaining": M}` rather than `success`, and the
  remaining rows are picked up by the next run.

## Supported models

The `model` argument is the Nori gateway slug your API key is granted. It is **required**: the
slug selects a priced model, so the plugin will not choose one on your behalf. Synthefy's own
client and local package take the same position.

Synthefy publishes the current models, their sizes and their slugs at
[docs.synthefy.com/nori/quickstart#models](https://docs.synthefy.com/nori/quickstart#models). That list is the authoritative one:
it changes when Synthefy releases a variant, and a slug not on it will not route.

Which model predicts better depends on your data, and the larger ones cost more per request and
take longer to cold-start. Try a couple with `dry_run=true` before committing a schedule to one.

The bare `synthefy/nori` slug has been retired and no longer routes; the plugin rejects it with a
pointed message rather than letting the gateway answer `404`. One API key from the
[Synthefy console](https://console.synthefy.com/) works for every slug it is granted.

## Code overview

### Files

- `nori_regression.py`: the plugin (metadata docstring and implementation).
- `nori_regression_config_scheduler.toml`: annotated TOML configuration template.
- `test_nori_regression.py`: unit tests (`pytest influxdata/nori_regression/`); no engine or
  network needed.
- `requirements.txt`: Python dependencies.
- `manifest.toml`: packaging metadata.

### Key functions

- `process_scheduled_call(influxdb3_local, call_time, args)`: scheduled entry point; anchors the
  window to `call_time`.
- `process_request(influxdb3_local, query_parameters, request_headers, request_body, args)`: HTTP
  entry point; applies the request-body allowlist.
- `_load_config(args, body)`: merges trigger arguments, the TOML file and the allowlisted body keys,
  then validates them.
- `_resolve_schema(influxdb3_local, cfg)`: reads column names *and* types, rejecting a
  non-numeric target or feature.
- `_resolve_window(cfg, now)`: resolves `window` / `start_time` / `end_time` into one range,
  honouring each bound on its own.
- `_regress(...)`: enforces the single-series rule, splits labeled from null-target rows, applies
  the caps and `skip_existing`, and batches the gateway calls.
- `_call_nori(...)`: sends the in-context regression request and validates the response.
- `_write_predictions(...)`: writes the predictions with `write_sync` so a write error surfaces
  during trigger execution.

## Troubleshooting

### Common issues

Each heading below quotes the text the plugin actually logs or returns, so a message can be
searched for directly. Every failure is logged with a `task_id`; use it to correlate the
caller-facing message with the full detail in `processing_engine_logs`.

#### Missing API key

The plugin cannot find a Nori gateway key.

**Solution:** set `SYNTHEFY_NORI_API_KEY` on the InfluxDB host, or pass an
`X-Nori-Api-Key: <key>` header when calling the HTTP trigger (see
[Authentication](#authentication-for-the-nori-gateway)). An empty header value is ignored and the
environment variable is used instead.

#### Gateway returns 403 or 404

- **`HTTP 403 ... please check the api-key you provided`:** the key is wrong, revoked, or malformed.
- **`HTTP 404 ... please check the model you provided`:** the `model` slug does not exist or your
  key's group was not granted it. Confirm the spelling against
  [Supported models](#supported-models).

**Solution:** re-copy the key from the [Synthefy console](https://console.synthefy.com/) and check
the slug. Neither status is retried, because neither is transient.

#### Request body may not set ...

The HTTP request body contained an operator-only parameter (for example `model` or
`target_database`).

**Solution:** set it as a trigger argument or in the TOML config file. Only the query-shape keys
listed in [HTTP request body parameters](#http-request-body-parameters) may come from the body.

#### `gateway_url` is not a parameter

The endpoint moved out of the configuration entirely, because the request carries the Nori API key.

**Solution:** set `NORI_GATEWAY_URL` on the InfluxDB host. It must be an `https://` URL.

#### Not enough labeled rows, or nothing to predict

- **`only N labeled rows (< min_history)`:** fewer than `min_history` rows have both the target and
  every feature present. Widen `window`, lower `min_history`, or check that
  `measurement`/`field`/`feature_fields`/`tags` select the data you expect.
- **`no rows to predict`:** every target value in the window is already present. The plugin only
  fills rows where the target is null.
- **`every row in the window already holds a prediction`:** `skip_existing` did its job. Set
  `skip_existing=false` to recompute them with newer training data.

#### The window holds N series

The measurement holds more than one series and your `tags` filter did not isolate one, so a single
model would be trained on mixed series.

**Solution:** add a `tags` filter that selects one series, or create one trigger per series. The
error message lists the first few series it found.

#### Feature or target column rejected

A column does not exist, is not a numeric field, or clashes with the target field or the reserved
names `time`/`y`.

**Solution:** fix the column names, and check the types with
`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sensors'`.

#### Cold-start latency and timeouts

The models scale to zero, so the first request after an idle period is slow: measurements have
ranged from roughly one minute to nearly four, with the larger variants slower, and it can return
a `503` or a non-JSON body from the fronting proxy once.

**Solution:** the default `request_timeout` of `300s` and `max_retries` of `3` are set to absorb
this; a `503`, a `429` and a connection error are retried with backoff. A read timeout is **not**
retried — it has already spent the whole budget, and it usually means the key's group was never
granted the slug. Raise `request_timeout` only if you see genuine timeouts on a warm model.

## Limitations

- One series per run; create one trigger per series for a multi-series measurement. Multi-series
  imputation in a single run is a possible enhancement.
- Imputes only rows where the target is null; it never overwrites an existing value.
- Prediction quality depends on how well `feature_fields` explain the target. Nori adds no
  time-derived features, so this plugin is not a time-series forecaster.
- A feature column whose name contains a space is only reachable via a TOML array or the HTTP JSON
  body, not via `--trigger-arguments`.
- Each gateway call is billed; see [Cost and metering](#cost-and-metering).

## License

Apache 2.0.


## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
