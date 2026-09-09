<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Synthefy Forecasting Plugin integrates the Synthefy Forecasting API with {{% product-name %}} to enable on-demand time series forecasting via HTTP requests. It reads time series data from InfluxDB, generates forecasts using Synthefy's foundation models, and writes the results back to InfluxDB for visualization and alerting.

**Key Features:**

- **On-Demand Forecasting**: Generate forecasts on-demand via HTTP requests
- **Multiple Models**: Support for various Synthefy models
- **Metadata Support**: Use additional fields as covariates for improved accuracy
- **Tag Filtering**: Filter input data by tags (for example, location, device); supports multiple values per tag (`IN (...)`)
- **Line Protocol Writes**: Reliable, batched writing via `write_sync` / `write_sync_to_db`

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger, and/or in the JSON body of each HTTP request. Body values override trigger arguments. A `null` in the body counts as unset, so the trigger argument applies; send `{}` for `tags` or `[]` for `metadata_fields` to clear them.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Authentication for the Synthefy API

The Synthefy API key is **never** read from trigger arguments or the request body. It must be provided via either of:

- HTTP request header: `X-Synthefy-Api-Key: <your-key>`
- Environment variable: `SYNTHEFY_API_KEY`

If both are set, the header takes precedence.

### Request body parameters

| Parameter            | Type           | Default                    | Description                                                                                                                                                                                        |
|----------------------|----------------|----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `measurement`        | string         | required                   | Source measurement (table) containing historical data                                                                                                                                              |
| `field`              | string         | `"value"`                  | Field name to forecast                                                                                                                                                                             |
| `tags`               | string \| dict | `""`                       | Tag filters. Trigger args: dot-separated string `key:val1@val2.key2:val3`. Request body: JSON object mapping tag name to a string or list of strings. See [Tag filter format](#tag-filter-format). |
| `time_range`         | string         | `"30d"`                    | Historical window. Format: `<number><unit>`. Units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`, `m`, `q`, `y` (`m`/`q`/`y` are approximate).                                                            |
| `forecast_horizon`   | string         | `"7d"`                     | Forecast duration. Format: `<number><unit>` (same units as `time_range`) or `<number> points`.                                                                                                     |
| `model`              | string         | `"sfm-tabular"`            | Synthefy model identifier (for example, `sfm-tabular`, `Migas-latest`)                                                                                                                                    |
| `output_measurement` | string         | `"{measurement}_forecast"` | Destination measurement for forecast results                                                                                                                                                       |
| `metadata_fields`    | string \| list | `""`                       | Trigger args: space-separated list of field names (`"humidity pressure"`). Request body: JSON list of strings. Used as covariates.                                                                 |
| `max_forecast_points`| integer        | `10000`                    | Upper bound on the forecast points one request may produce. A time-based `forecast_horizon` is divided by the series' own step, so a dense series with a long horizon builds a very large payload. |
| `database`           | string         | `""`                       | Optional override database for **writes only**. If unset, forecasts are written to the trigger's database. Reads always go to the trigger's database.                                              |

#### Tag filter format

The plugin supports multi-value tag filters that are translated to `tag IN ('a', 'b', ...)` in SQL.

**Trigger arguments (string form)** — based on the downsampler convention:

- `.` separates `key:value` pairs
- `:` separates the tag name from its value(s)
- `@` separates multiple values for the same tag
- Quote a value with `'...'` or `"..."` if it contains `:`, `@` or `.`. A quote inside a value, as in `Bob's`, needs no escaping. An unclosed quote is rejected.

Examples:
```
tags="room:Bedroom"
tags="room:Bedroom@Kitchen.location:Hall"
tags="room:'Some other room'@Bedroom.device:sensor1"
tags="owner:Bob's.room:Bedroom"
```
**Request body (JSON form)**:
```json
{ "tags": { "room": ["Bedroom", "Kitchen"], "location": "Hall" } }
```
The body also accepts the string form above. Send `{}` to clear the tag filters configured on the trigger.

#### Forecast points and tags

When a tag filter has a single value, that value is added as a tag on every forecast point. When it has multiple values (an `IN (...)` filter), no value is written for that tag — the response covers several tag values at once.

## Requirements

### Dependencies

- Python 3.11 or higher
- `pandas` — Data manipulation
- `requests` — HTTP client for the Synthefy API
- `influxdata-plugin-utils` — Shared configuration, schema and write helpers

### Installation steps

Using the {{% product-name %}} package manager:

```bash
influxdb3 install package pandas
influxdb3 install package requests
influxdb3 install package influxdata-plugin-utils
```
### Prerequisites

- {{% product-name %}} Core or Enterprise installed and running
- Synthefy API key — create one at [https://console.synthefy.com/api-keys](https://console.synthefy.com/api-keys)

## Quick Start / Testing Setup

Create a database and write some sample data:

```bash
influxdb3 create database mydb

NOW=$(date +%s)
for i in {0..168}; do
  TIMESTAMP=$((NOW - (168 - i) * 3600))000000000
  influxdb3 write --database mydb "temperature,location=NYC value=$((70 + RANDOM % 10)),humidity=$((60 + RANDOM % 15)),pressure=$((1000 + RANDOM % 20)) ${TIMESTAMP}"
done
```
**Note**: In {{% product-name %}}, tables/measurements are created automatically when you first write data to them.

**Quick check that data exists:**
```bash
influxdb3 query --database mydb "SELECT COUNT(*) FROM temperature"
influxdb3 query --database mydb "SELECT * FROM temperature ORDER BY time DESC LIMIT 5"
```
## Trigger setup

### HTTP trigger

Create and enable the trigger:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/synthefy_forecasting/synthefy_forecasting.py" \
  --trigger-spec "request:forecast" \
  --trigger-arguments measurement=temperature,field=value \
  temperature_forecast_http

influxdb3 enable trigger --database mydb temperature_forecast_http
```
Trigger arguments act as defaults; any field can be overridden in the request body.

Then call via HTTP. **Always** pass the Synthefy API key as a header (or set the `SYNTHEFY_API_KEY` env var on the InfluxDB process):

```bash
TOKEN=$(influxdb3 create token --admin --offline | grep token | cut -d'=' -f2)

curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "temperature",
    "field": "value",
    "time_range": "30d",
    "forecast_horizon": "7d",
    "model": "sfm-tabular"
  }'
```
**Important Notes:**
- Endpoint is `/api/v3/engine/forecast` (matches the `request:forecast` trigger spec).
- Authentication for InfluxDB itself is handled by the framework via the `Authorization` header.
- The Synthefy API key must be in the `X-Synthefy-Api-Key` header or in the `SYNTHEFY_API_KEY` env var; it cannot be passed via trigger arguments or request body.

## Example usage

### Basic forecast

```bash
TOKEN=$(influxdb3 create token --admin --offline | grep token | cut -d'=' -f2)

curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "temperature",
    "field": "value"
  }'
```
### Forecast with single-tag filter

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "temperature",
    "field": "value",
    "tags": { "location": "NYC" },
    "time_range": "30d"
  }'
```
### Forecast with multi-value tag filter

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "temperature",
    "field": "value",
    "tags": { "location": ["NYC", "SF"], "device": "sensor1" },
    "time_range": "30d"
  }'
```
### Forecast with metadata covariates

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "temperature",
    "field": "value",
    "metadata_fields": ["humidity", "pressure"],
    "time_range": "30d"
  }'
```
### Trigger arguments form

The same parameters can also be set as trigger arguments (note the dot/colon/`@` syntax for `tags` and the space-separated list for `metadata_fields`):

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/synthefy_forecasting/synthefy_forecasting.py" \
  --trigger-spec "request:forecast" \
  --trigger-arguments 'measurement=temperature,field=value,tags=location:NYC@SF.device:sensor1,metadata_fields=humidity pressure,time_range=30d,forecast_horizon=7d' \
  temperature_forecast_http
```
### Advanced model

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "sales",
    "field": "revenue",
    "model": "Migas-latest",
    "forecast_horizon": "30d",
    "time_range": "90d"
  }'
```
### Writing the forecast to a different database

```bash
curl -X POST http://localhost:8181/api/v3/engine/forecast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Synthefy-Api-Key: YOUR_SYNTHEFY_API_KEY" \
  -d '{
    "measurement": "temperature",
    "field": "value",
    "database": "forecasts"
  }'
```
## Output Format

Forecasts are written to a new measurement (default: `{measurement}_forecast`) using `write_sync` (or `write_sync_to_db` when `database` is set) with `no_sync=True`, batched into a single line-protocol payload.

- **Measurement**: `{measurement}_forecast` (configurable via `output_measurement`)
- **Tags**: Single-value tag filters from the request + `model={model_name}`
- **Fields**:
  - `{field_name}`: Forecasted values
  - `value_{quantile}`: Quantile forecasts when available (for example, `value_0.1`, `value_0.9`)

Example Line Protocol output:

```
temperature_forecast,location=NYC,model=sfm-tabular value=72.5,value_0.1=71.2,value_0.9=73.8 1704672000000000000
```
## Querying Forecasts

Forecast points sit in the future, so query by an upcoming time window rather than a past one:

```sql
SELECT *
FROM temperature_forecast
WHERE time >= now() AND time <= now() + INTERVAL '7 days'
ORDER BY time
```
Historical data — past 30 days:

```sql
SELECT time, value
FROM temperature
WHERE time >= now() - INTERVAL '30 days'
ORDER BY time
```
## Supported Models

The plugin supports models available through the Synthefy Forecasting API. Key supported models include:

- `sfm-tabular`: Synthefy Foundation Model for tabular/multivariate time series
- `Migas-latest`: Latest Migas foundation model

Check the [Synthefy documentation](https://docs.synthefy.com) for the most up-to-date model list and availability.

## Code overview

### Files

- `synthefy_forecasting.py`: HTTP trigger entry point, argument parsing, InfluxDB query construction, Synthefy API calls, and forecast writes.
- `requirements.txt`: Python packages required by the plugin.
- `README.md`: Setup, usage, and troubleshooting documentation.

### Key functions

- `process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None)`: handles HTTP requests, merges trigger arguments with request-body overrides, validates input, calls Synthefy, and writes forecast points.
- `build_history_query(measurement, field, metadata_fields, tag_filters, start_time)`: builds the parameterized SQL query for historical data.
- `dataframe_to_synthefy_request(influxdb3_local, df, field, forecast_horizon, metadata_fields, model, max_forecast_points, task_id)`: converts InfluxDB query rows into the Synthefy forecast request payload and enforces the point limit.
- `forecast_response_to_line_builders(influxdb3_local, forecast_response, output_measurement, tag_filters, model, field_name, task_id)`: converts Synthefy forecast results into InfluxDB line protocol builders.

## Troubleshooting

### Common issues

### Missing API key

`{"message":"Missing API key"}` — set `X-Synthefy-Api-Key` in the request headers, or `SYNTHEFY_API_KEY` in the environment of the InfluxDB process.

### Measurement not found

`{"message":"Measurement '<name>' not found"}` — the plugin verifies the measurement exists by querying `information_schema.columns`. Make sure the measurement has been written to in the trigger's database.

### Field does not exist

`{"message":"Field '<name>' does not exist in '<measurement>'"}` — the requested `field` (or `metadata_fields` entries) was not found in the measurement schema.

### No data found

`{"message":"No data found"}` — the query returned zero rows. Widen `time_range`, relax `tags` filters, or verify timestamps fall inside the window.

### Invalid interval format

`Invalid interval format: '<value>'. Expected '<number><unit>'.` — `time_range` and `forecast_horizon` must be `<number><unit>` (units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`, `m`, `q`, `y`) or, for `forecast_horizon`, `<number> points`.

### Forecast horizon too large

`forecast_horizon '<value>' resolves to N points … above the max_forecast_points limit` — the horizon is divided by the interval between the last two historical points, so a dense series produces many points. Shorten `forecast_horizon`, use the `<number> points` form, or raise `max_forecast_points`.

### Timestamps collapse onto each other

`N history timestamps differ by less than a microsecond …` or `The series' step of … is finer than a microsecond …` — timestamps are sent to Synthefy with microsecond precision, so a series stepping in nanoseconds cannot be represented. Resample it to a coarser step.

### History holds repeated timestamps

`History holds N repeated timestamps, so the window covers more than one series …` — the query matched several tag series and their values are interleaved in one input sequence. Add a `tags` filter that selects a single series.

### Synthefy API errors

If Synthefy API calls fail:

- Verify the API key is correct
- Check API URL accessibility and rate limits
- Check network connectivity

### Write errors

If writes fail:

- Ensure the database exists (the trigger database, or the override `database` if used)
- Ensure the plugin has write permissions
- Check the `[task_id] Failed to write forecasts after N attempts: …` error in the InfluxDB logs

### Query file limit exceeded ({{% product-name %}} Core)

If you see "Query would scan X Parquet files, exceeding the file limit" errors, narrow `time_range` (for example, `90d` instead of `730d`), or upgrade to {{% product-name %}} Enterprise (which compacts files and removes the limit).

## Limitations

- Currently supports a single time series per request (one `field` plus optional covariates). A request whose window matches several tag series is logged as a warning.
- Forecast horizon calculation assumes regular time intervals.
- Timestamps are exchanged with microsecond precision; a series whose step is finer is rejected.
- In the trigger-arguments string form, a tag value containing `:`, `@` or `.` must be quoted; the JSON request body needs no quoting.

## License

Apache 2.0


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
