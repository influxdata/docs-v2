<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
⚡ scheduled, http
🏷️ forecasting, machine-learning, time-series, deep-learning
🔧 {{% product-name %}}

> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The Chronos Forecasting Plugin forecasts time series stored in {{% product-name %}} with Amazon's pre-trained Chronos models from
HuggingFace, with no training.
A scheduled trigger forecasts on every run and writes the forecast back to InfluxDB; an HTTP trigger answers each
request with the forecast.

- **Zero-shot inference**: Chronos-Bolt, Chronos-2 and original Chronos (T5) models forecast any series without
  training.
- **A field or a query**: forecast a numeric field of a measurement, or the result of any SQL query, such as a chart's
  aggregating query.
- **Per series**: `group_by` splits the data by tags, and every series is forecast in one model call.
- **Prediction intervals**: any interval levels the model can produce, as `lower_<percent>` / `upper_<percent>`.
- **Covariates**: Chronos-2 models take extra fields as past covariates.
- **Backtest**: on request, the forecast is checked on the latest history in the same model call: the share of points
  inside each interval and the mean absolute error.
- **Shared forecasting interface**: requests, responses, errors and stored rows follow the contract InfluxDB 3 Explorer
  uses for every forecasting plugin, and [`forecast_interface.json`](forecast_interface.json) describes what this plugin
  supports.

## Software requirements

- **{{% product-name %}}**: 3.8.2 or later, with the Processing Engine enabled.
- **Python packages**:
    - `chronos-forecasting` (Amazon Chronos model pipeline)
    - `torch` (PyTorch for model inference)
    - `influxdata-plugin-utils` (configuration loading)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package chronos-forecasting
   influxdb3 install package torch
   influxdb3 install package influxdata-plugin-utils
   ```
### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration
parameters.
This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and
configure the plugin.

## Scheduled trigger

A scheduled trigger forecasts on every run of its schedule and writes the forecast to `target_measurement`.
It returns nothing; a failure goes to the plugin log.

### Scheduled trigger parameters

Set these with `--trigger-arguments` (CLI) or `trigger_arguments` (HTTP API) when creating the trigger, or in the
[TOML file](#scheduled-trigger-toml-configuration).
In trigger arguments every value is a string; see [Value formats](#value-formats).

| Parameter             | Type            | Default                           | Description                                                                                                                                 |
|-----------------------|-----------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurement`  | string          | required¹                         | Measurement to read                                                                                                                         |
| `field`               | string          | required¹                         | Numeric field to forecast                                                                                                                   |
| `query`               | string          | required¹                         | SQL whose result is forecast instead of `source_measurement` and `field`; see [Forecasting a query](#forecasting-a-query)                   |
| `source_database`     | string          | the trigger's database            | Database to read from; see [Security](#security)                                                                                            |
| `tag_filter`          | string or table | none                              | Tags the rows must match: `host=a region=eu`, or a TOML table for several values per tag. Not with `query`                                  |
| `sql_filter`          | string          | none                              | SQL condition on tags and fields, without `WHERE`, AND-ed with `tag_filter` and inserted as is; see [Security](#security). Not with `query` |
| `group_by`            | list            | none                              | Tags to split by; each distinct combination is its own series; see [Series](#series). Not with `query`                                      |
| `series_limit`        | integer ≥ 1     | none                              | Forecast only the first N forecasts (series × fields) in the order of [Series](#series) and skip the rest; at most `max_series`             |
| `window`              | duration        | derived                           | History as a time window ending now; see [History](#history)                                                                                |
| `point_limit`         | integer ≥ 10    | `512` without `window`            | History as the most recent cells of each series' grid, at most the model's context; see [History](#history)                                 |
| `sampling_interval`   | duration        | none                              | Resample history to the mean per bucket; see [History](#history)                                                                            |
| `horizon_steps`       | integer ≥ 1     | required²                         | Forecast length in points at the data spacing                                                                                               |
| `horizon_duration`    | duration        | required²                         | Forecast length as a duration, converted to points by the data spacing                                                                      |
| `levels`              | list of numbers | `0.5 0.8`                         | Interval levels, each between 0 and 1; a level the model cannot produce is not written                                                      |
| `model`               | string          | `amazon/chronos-bolt-tiny`        | HuggingFace model ID or a local path; see [Models](#models)                                                                                 |
| `target_measurement`  | string          | `_forecasts.<source_measurement>` | Measurement the forecast is written to; required when `query` reads several measurements                                                    |
| `target_database`     | string          | the trigger's database            | Database the forecast is written to                                                                                                         |
| `forecast_id`         | string          | none                              | Tag `forecast_id` in every row, so forecasts of one series with different settings keep their own rows                                      |
| `covariate_fields`    | list            | none                              | Numeric fields other than `field` passed to a Chronos-2 model as past covariates; see [Models](#models). Not with `query`                   |
| `max_series`          | integer ≥ 1     | `100`                             | Most forecasts one run may produce (series × fields); more is refused unless `series_limit` keeps fewer                                     |
| `max_forecast_points` | integer ≥ 1     | `1024`                            | Most forecast points per series; a longer horizon is refused                                                                                |
| `config_file_path`    | string          | none                              | TOML file with more arguments; see [Scheduled trigger TOML configuration](#scheduled-trigger-toml-configuration)                            |

¹ Either `source_measurement` with `field`, or `query`.
² Exactly one of `horizon_steps` and `horizon_duration`.

A scheduled trigger always writes and returns no response, so it refuses `write_results` and `backtest_points`.
An unknown argument or an invalid value fails every run with `bad_request` in the log.

### Scheduled trigger environment variables

Every parameter can also come from an environment variable of the InfluxDB server named
`INFLUXDB3_CHRONOS_FORECASTING_<PARAMETER>` in upper case, for example `INFLUXDB3_CHRONOS_FORECASTING_MODEL` sets
`model` for every trigger of the plugin.

- The environment is the lowest layer: a trigger argument overrides it, and the TOML file overrides both.
- `INFLUXDB3_CHRONOS_FORECASTING_CONFIG_FILE_PATH` names the TOML file when the trigger has no `config_file_path`
  argument.
- Variables of the HTTP-only keys (`..._WRITE_RESULTS`, `..._BACKTEST_POINTS`) are ignored by a scheduled trigger.

### Scheduled trigger TOML configuration

`config_file_path`, a trigger argument or the environment variable above, names a `.toml` file with more arguments.

- The path is absolute or relative to the plugin directory: the first set of `PLUGIN_DIR`, `INFLUXDB3_PLUGIN_DIR` and
  the parent of the engine's virtual environment.
- The file's keys override the trigger arguments; an argument the file does not set still applies.
- Lists and tables are native: `group_by = ["host"]`, and `[tag_filter]` with several values per tag
  (`host = ["a", "b"]`). Keep the `[tag_filter]` table last: keys after a table header belong to the table.
- A `query` or `sql_filter` with a comma goes here: the CLI splits `--trigger-arguments` at every comma.
- An unknown key, `config_file_path` inside the file, `write_results` or `backtest_points` fails every run with
  `bad_request`.

#### Example scheduled TOML configuration

[chronos_forecasting_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/chronos_forecasting/chronos_forecasting_scheduler.toml) lists every key a scheduled trigger accepts,
with its default.
A query, which has commas, set through a file:

```toml
query = "SELECT date_bin(INTERVAL '5 minutes', time) AS time, host, avg(usage) AS usage FROM cpu WHERE time > now() - INTERVAL '6 hours' GROUP BY 1, host"
horizon_steps = 12
series_limit = 5
```
### Create a scheduled trigger

With trigger arguments:

```bash
influxdb3 create trigger \
  --database mydb \
  --path chronos_forecasting.py \
  --trigger-spec "every:5m" \
  --trigger-arguments "source_measurement=cpu,field=usage,group_by=host,window=6h,sampling_interval=1min,horizon_steps=60" \
  chronos_forecast_scheduled
```
With the TOML file:

```bash
influxdb3 create trigger \
  --database mydb \
  --path chronos_forecasting.py \
  --trigger-spec "every:5m" \
  --trigger-arguments config_file_path=chronos_forecasting_scheduler.toml \
  chronos_forecast_scheduled
```
A `cron:` spec takes six fields, seconds first (`cron:20 */15 * * * *`), which spreads the runs of several triggers.
Tune the settings with on-demand requests to an [HTTP trigger](#http-trigger) first: the response shows `points_read`
and `step_ms` for every series.

### Scheduled trigger example

The trigger above writes 60 one-minute points per host to `_forecasts.cpu` on every run.
Read the latest run of each series:

```sql
SELECT time, host, forecast, lower_80, upper_80, step, run_time
FROM (
    SELECT *, max (run_time) OVER (PARTITION BY field, host) AS latest
    FROM "_forecasts.cpu"
    ) AS f
WHERE run_time = latest
ORDER BY host, time
```
Expected output (first rows):

| time                | host | forecast | lower_80 | upper_80 | step | run_time             |
|---------------------|------|----------|----------|----------|------|----------------------|
| 2026-10-29T12:01:00 | a    | 48.92    | 46.50    | 51.37    | 1    | 2026-10-29T12:00:05Z |
| 2026-10-29T12:02:00 | a    | 49.10    | 46.31    | 51.88    | 2    | 2026-10-29T12:00:05Z |

The rows are described in [Output data structure](#output-data-structure).
With `forecast_id`, add `WHERE forecast_id = '<id>'` to the inner query.

### Scheduled trigger errors

A failed run writes nothing and logs `[<task id>] <code>: <message>` at `ERROR`, with the codes of the
[HTTP errors](#http-trigger-errors).
A series with too few points logs `[<task id>] too_few_points for <field> <tags>: <message>` at `WARN`, and the other
series are written.
Read the log:

```sql
SELECT event_time, log_level, log_text
FROM system.processing_engine_logs
WHERE trigger_name = 'chronos_forecast_scheduled'
ORDER BY event_time DESC LIMIT 20
```
## HTTP trigger

An HTTP trigger answers each request with the forecast and writes it only with `write_results`.
Only an admin token can call it.

### HTTP request parameters

Send these as a JSON object in the body of a POST request.
The trigger's arguments and TOML file set defaults for the same keys; see
[HTTP trigger arguments](#http-trigger-arguments).

| Parameter             | Type                            | Default                           | Description                                                                                                                                 |
|-----------------------|---------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurement`  | string                          | required¹                         | Measurement to read                                                                                                                         |
| `field`               | string                          | required¹                         | Numeric field to forecast                                                                                                                   |
| `query`               | string                          | required¹                         | SQL whose result is forecast instead of `source_measurement` and `field`; see [Forecasting a query](#forecasting-a-query)                   |
| `source_database`     | string                          | the trigger's database            | Database to read from; see [Security](#security)                                                                                            |
| `tag_filter`          | object or string                | none                              | Tags the rows must match: `host=a region=eu`, or `{"host": ["a", "b"]}` in JSON and TOML. Not with `query`                                  |
| `sql_filter`          | string                          | none                              | SQL condition on tags and fields, without `WHERE`, AND-ed with `tag_filter` and inserted as is; see [Security](#security). Not with `query` |
| `group_by`            | list                            | none                              | Tags to split by; each distinct combination is its own series; see [Series](#series). Not with `query`                                      |
| `series_limit`        | integer ≥ 1                     | none                              | Forecast only the first N forecasts (series × fields) in the order of [Series](#series) and skip the rest; at most `max_series`             |
| `window`              | duration                        | derived                           | History as a time window ending now; see [History](#history)                                                                                |
| `point_limit`         | integer ≥ 10                    | `512` without `window`            | History as the most recent cells of each series' grid, at most the model's context; see [History](#history)                                 |
| `sampling_interval`   | duration                        | none                              | Resample history to the mean per bucket; see [History](#history)                                                                            |
| `horizon_steps`       | integer ≥ 1                     | required²                         | Forecast length in points at the data spacing                                                                                               |
| `horizon_duration`    | duration                        | required²                         | Forecast length as a duration, converted to points by the data spacing                                                                      |
| `levels`              | list of numbers                 | `[0.5, 0.8]`                      | Interval levels, each between 0 and 1; a level the model cannot produce is `null` in the response and not written                           |
| `model`               | string                          | `amazon/chronos-bolt-tiny`        | HuggingFace model ID or a local path; see [Models](#models)                                                                                 |
| `write_results`       | boolean                         | `false`                           | Also write the forecast, as the scheduled trigger does; see [Output data structure](#output-data-structure)                                 |
| `target_measurement`  | string                          | `_forecasts.<source_measurement>` | Measurement the forecast is written to; required when `query` reads several measurements                                                    |
| `target_database`     | string                          | the trigger's database            | Database the forecast is written to                                                                                                         |
| `forecast_id`         | string                          | none                              | Tag `forecast_id` in every written row, so forecasts of one series with different settings keep their own rows                              |
| `covariate_fields`    | list                            | none                              | Numeric fields other than `field` passed to a Chronos-2 model as past covariates; see [Models](#models). Not with `query`                   |
| `max_series`          | integer ≥ 1                     | `100`                             | Most forecasts one request may produce (series × fields); more is refused unless `series_limit` keeps fewer                                 |
| `max_forecast_points` | integer ≥ 1                     | `1024`                            | Most forecast points per series; a longer horizon is refused                                                                                |
| `backtest_points`     | integer 1…`max_forecast_points` | none                              | Hold out the last N points of each series, forecast them from the points before and return `backtest`; see [Backtest](#backtest)            |

¹ Either `source_measurement` with `field`, or `query`.
² Exactly one of `horizon_steps` and `horizon_duration`.

An unknown key, an invalid value, a body that is not a JSON object, or `config_file_path` answers `400 bad_request`.

### HTTP headers and query string

Every request parameter can also come from a header `X-Influxdb3-Chronos-Forecasting-<parameter>` with underscores
written as hyphens (`X-Influxdb3-Chronos-Forecasting-Horizon-Steps` sets `horizon_steps`), or from the query string
under its own name (`?horizon_steps=12`).
Their values are strings; see [Value formats](#value-formats).

- Header names are matched regardless of case.
- A header with the plugin's prefix that names no parameter answers `bad_request`; other headers, such as the client's
  own, are ignored.
- An unknown query-string parameter answers `bad_request`.
- The body, then the headers, then the query string: each overrides the one before.

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast?horizon_steps=12" \
  -H "Authorization: Bearer $INFLUXDB3_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Influxdb3-Chronos-Forecasting-Levels: 0.5 0.9" \
  -d '{"source_measurement": "cpu", "field": "usage", "tag_filter": {"host": "a"}}'
```
### HTTP trigger arguments

The trigger's arguments hold defaults for every request: the same keys as the request, plus `config_file_path`.
A request overrides an argument it names; an argument it does not name still applies.

Two choices are made as a whole by the highest layer that sets either side:

- `query` against `source_measurement`, `field`, `tag_filter`, `sql_filter`, `group_by` and `covariate_fields`;
- `horizon_steps` against `horizon_duration`.

So a trigger created with `source_measurement=cpu field=usage horizon_steps=12` forecasts a query when the body sends
`query`, and 1 h ahead when it sends `horizon_duration: "1h"`.
Both sides in one layer answer `bad_request`.
An unknown trigger argument fails every request with `bad_request`.

### HTTP trigger environment variables

Every parameter can also come from an environment variable of the InfluxDB server named
`INFLUXDB3_CHRONOS_FORECASTING_<PARAMETER>` in upper case, for example `INFLUXDB3_CHRONOS_FORECASTING_MAX_SERIES`.

- The layers, lowest first: the environment, the trigger arguments, the TOML file, then the request's body, headers
  and query string.
- `INFLUXDB3_CHRONOS_FORECASTING_CONFIG_FILE_PATH` names the TOML file when the trigger has no `config_file_path`
  argument.

### HTTP trigger TOML configuration

`config_file_path`, a trigger argument or the environment variable above, names a `.toml` file of defaults; a request
can never name it.

- The path is absolute or relative to the plugin directory: the first set of `PLUGIN_DIR`, `INFLUXDB3_PLUGIN_DIR` and
  the parent of the engine's virtual environment.
- The file's keys override the trigger arguments, and the request overrides the file.
- Every request key is accepted, with native lists and tables; keep the `[tag_filter]` table last.
- An unknown key or `config_file_path` inside the file fails every request with `bad_request`.

#### Example HTTP TOML configuration

[chronos_forecasting_http.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/chronos_forecasting/chronos_forecasting_http.toml) lists every key an HTTP trigger accepts, with its
default: the endpoint's model, levels and limits are set, the rest is left for each request.

```bash
influxdb3 create trigger \
  --database mydb \
  --path chronos_forecasting.py \
  --trigger-spec "request:forecast" \
  --trigger-arguments config_file_path=chronos_forecasting_http.toml \
  chronos_forecast_http
```
### Create an HTTP trigger

```bash
influxdb3 create trigger \
  --database mydb \
  --path chronos_forecasting.py \
  --trigger-spec "request:forecast" \
  chronos_forecast_http
```
The trigger answers at `/api/v3/engine/forecast`.

### HTTP trigger examples

#### Forecast a field, per host

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast" \
  -H "Authorization: Bearer $INFLUXDB3_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source_measurement": "cpu",
    "field": "usage",
    "tag_filter": {"region": "eu"},
    "group_by": ["host"],
    "window": "6h",
    "sampling_interval": "30s",
    "horizon_duration": "1h",
    "levels": [0.5, 0.8]
  }'
```
Expected output: HTTP `200`, one result per series × field.
A series without enough history carries its own error instead of a forecast.

```json
{
  "status": "ok",
  "model": "amazon/chronos-bolt-tiny",
  "levels": [
    0.5,
    0.8
  ],
  "series_total": 2,
  "results": [
    {
      "field": "usage",
      "tags": {
        "host": "a",
        "region": "eu"
      },
      "points_read": 720,
      "step_ms": 30000,
      "forecast": [
        {
          "timestamp": 1700003630000,
          "forecast": 1.3,
          "lower_50": 1.1,
          "upper_50": 1.5,
          "lower_80": 0.9,
          "upper_80": 1.7
        }
      ]
    },
    {
      "field": "usage",
      "tags": {
        "host": "c",
        "region": "eu"
      },
      "status": "error",
      "code": "too_few_points",
      "message": "need >= 10 points, got 4"
    }
  ]
}
```
| Field                                 | Description                                                                                                                  |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| `status`                              | `"ok"`                                                                                                                       |
| `model`                               | The model that ran                                                                                                           |
| `levels`                              | The returned levels: each point carries `lower_<percent>` and `upper_<percent>` for each                                     |
| `series_total`                        | Forecasts (series × fields) the request selects before `series_limit`; equals the number of results without it               |
| `results[].field`, `results[].tags`   | The forecast field and the series tags; see [Series](#series)                                                                |
| `results[].points_read`               | Observed history points the model used: cells of the grid that hold data                                                     |
| `results[].step_ms`                   | Spacing of the history and the forecast, in milliseconds                                                                     |
| `results[].forecast[]`                | Points: `timestamp` (epoch ms), `forecast` (the median) and the interval bounds, `null` for a level the model cannot produce |
| `results[].backtest`                  | With `backtest_points`; see [Backtest](#backtest)                                                                            |
| `results[].status`, `code`, `message` | Instead of a forecast, when the series cannot be forecast (`too_few_points`)                                                 |

The forecast starts one step after the last history point.

#### Forecast a query

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast" \
  -H "Authorization: Bearer $INFLUXDB3_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT date_bin(INTERVAL '"'"'5 minutes'"'"', time) AS time, host, avg(usage) AS usage FROM cpu WHERE time > now() - INTERVAL '"'"'6 hours'"'"' GROUP BY 1, host",
    "horizon_steps": 12,
    "series_limit": 5
  }'
```
#### Multivariate forecast with Chronos-2

```bash
curl -X POST "http://localhost:8181/api/v3/engine/forecast" \
  -H "Authorization: Bearer $INFLUXDB3_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source_measurement": "sensor_data", "field": "temperature", "model": "amazon/chronos-2", "covariate_fields": ["humidity", "pressure"], "horizon_steps": 64}'
```
### Backtest

With `backtest_points: N`, the plugin also checks the forecast on the latest history, in the same model call.
It holds out the last N points of each series, forecasts them from the points before them with the same model, levels
and history length, and compares.
Each successful result then carries `backtest`:

```json
"backtest": {
  "points": 11,
  "coverage": {
    "50": 0.545,
    "80": 0.818
  },
  "mae": 2.21
}
```
- `points`: the measured points compared; an empty bucket is skipped.
- `coverage`: per level, the share of those points inside its interval, `null` for a level the model cannot produce.
  A share close to the level means the intervals are calibrated.
- `mae`: the mean absolute difference between the central forecast and the measured points, in the field's units.

`backtest` is `null` when fewer than 10 points precede the held-out ones, or none of these is measured; the forecast
itself is the same as without the check.
The check reads N more points per series and takes about one more forecast per series.
With N equal to the horizon, it measures accuracy over the same distance as the forecast; a small N gives a noisy
estimate.
N above `max_forecast_points` answers `bad_request`.

### HTTP trigger errors

A request that fails as a whole answers with an HTTP error status and a JSON body:

```json
{
  "status": "error",
  "code": "bad_request",
  "message": "set exactly one of horizon_steps and horizon_duration"
}
```
| Code                | HTTP  | When                                                                                                                                                                                          |
|---------------------|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bad_request`       | `400` | Unknown or invalid parameter, unknown measurement, field or database, a query that does not plan, too many forecasts or forecast points, a series mixing tag sets without `sampling_interval` |
| `model_unavailable` | `503` | The model failed to download or load                                                                                                                                                          |
| `internal`          | `500` | A query, the inference or the write failed, or a forecast row cannot be built                                                                                                                 |
| `too_few_points`    | —     | Per series, in `results`, with the request still `200`                                                                                                                                        |

The plugin logs a `bad_request` at `WARN` and the other codes at `ERROR`.

## Forecasting details

### Value formats

- In trigger arguments, headers and the query string every value is a string: lists are space-separated
  (`group_by=host region`, `levels=0.5 0.8`), and `tag_filter` is space-separated `tag=value` pairs with one value per
  tag.
- The JSON body and the TOML file take native lists and objects.
- **Durations** are a whole number and a unit: `s`, `min`, `h`, `d` or `w` (`30s`, `5min`, `6h`, `7d`).
- The CLI splits `--trigger-arguments` at every comma, so a `query` or `sql_filter` with a comma (`host IN ('a', 'b')`)
  goes in the TOML file or the request.

### Models

| Model                                                  | Interval levels | History used | Native horizon |
|--------------------------------------------------------|-----------------|--------------|----------------|
| `amazon/chronos-bolt-tiny`, `-mini`, `-small`, `-base` | up to 0.8       | 2048 points  | 64 steps       |
| `amazon/chronos-2`                                     | up to 0.98      | 8192 points  | 1024 steps     |
| original Chronos (`amazon/chronos-t5-*`)               | any             | 512 points   | 64 steps       |

- A horizon past the native one is extended autoregressively, at lower quality, and the plugin logs a warning.
- A level whose bounds fall outside the quantiles the model was trained on is left out rather than extrapolated:
  Chronos-Bolt is trained on quantiles 0.1–0.9, Chronos-2 on 0.01–0.99.
- Chronos-T5 builds its intervals from 20 samples, so levels above 0.9 are close to the samples' minimum and maximum.
- `covariate_fields` needs a Chronos-2 model, checked once the model loads; a gap in a covariate is passed as missing.
- The model loads on the first forecast that needs it and stays loaded for later runs; a request whose series all have
  too few points loads no model.

### Series

- Without `group_by` all rows matching the filters form one series; with it, each distinct combination of the `group_by`
  tags is its own series.
  With `query`, each distinct combination of the key columns is.
- A series' `tags` hold the `group_by` tags and every other tag that all its rows carry with one value; a tag missing
  from some rows is left out.
  When the data changes which tags a series carries, for example a second host appears, the forecast goes to a new
  series.
- `results` are ordered by the series' `group_by` tags, or the query's key columns, compared as text with a missing
  value last, then by field name.
  `series_limit: N` keeps the first N forecasts in this order and skips the rest without an error; `series_total` in the
  response counts them all, so a chart can say "the first 5 of 12".
  In measurement mode skipped series are neither read nor checked for mixed tag sets; with `query` the result is read
  whole, then cut.
  The scheduled trigger logs how many it kept.
- Without `sampling_interval`, a series whose rows come from several tag sets writing at the same time within its last
  `point_limit` points (all of `window` when only it is set) is refused with `bad_request`, for example several hosts
  without `group_by`, or the per-core rows of Telegraf's `cpu` measurement: interleaved, they would form a saw-tooth.
  Add the tags the message names to `group_by`, pin them with `tag_filter`, or set `sampling_interval` to forecast their
  mean per bucket.
  A tag that changes value over time, such as a version after an upgrade, does not make a series mixed; one that flips
  back and forth, such as a status, does, so set `sampling_interval` for it.
  With `query` the plugin cannot see tag sets, so the query has to keep series apart.
- When the forecast is written, a `group_by` tag or a query key column named like a column of the
  [stored rows](#output-data-structure) is refused with `bad_request`: as a tag it would break the row or merge series.

### History

- The plugin reads at most the model's context per series (the History used column of [Models](#models)); `window`
  and `point_limit` narrow it further.
  With neither, it keeps the last 512 cells.
- Without `window`, a read in measurement mode covers `point_limit` buckets of `sampling_interval` back from now (at
  most 365 days, plus `backtest_points` and the bucket still filling), or the last day of raw points.
  Pick `sampling_interval` so that this covers several seasonal cycles: `1h` with the default 512 buckets is 21 days.
  With `query` there is no default window; see [Forecasting a query](#forecasting-a-query).
- Chronos reads points as equally spaced, so history reaches the model on a grid.
  With `sampling_interval` the cells are its buckets, aligned like `date_bin`, and the bucket still filling is left out.
  Without it, the step is the median spacing of the points, rounded to a round unit about 1% of it (so 10 s, 1 h or 1
  week stay exact), and each point goes to the nearest cell of a grid that keeps the rhythm most points follow.
  Points in one cell are averaged, and an empty cell is passed as a gap, which Chronos treats as missing.
- A series needs at least 10 observed points; fewer answers `too_few_points` for that series, naming the window read.

### Forecasting a query

With `query`, the plugin runs the SQL against `source_database` and forecasts what it returns:

- **time**: the column named `time`, so the query aliases its timestamp `AS time`.
  No `time` column answers `bad_request`.
- **series keys**: the text and boolean columns; each distinct combination is one series.
- **values**: the numeric columns; each is forecast on its own, per series.
  A result without a numeric column answers `bad_request`.
  A timestamp column other than `time` (`max(time) AS last_seen`) reaches the plugin as an integer and is forecast as a
  number, so leave such columns out of the query.
- **column types**: the Processing Engine passes `BIGINT`, `BIGINT UNSIGNED`, `DOUBLE`, `BOOLEAN`, text and timestamp
  columns to plugins.
  A query that returns another type (`INT`, `REAL`, `DECIMAL`, an array or a struct) fails with `internal`, so cast such
  a column, for example `CAST(x AS DOUBLE)`.
- **source measurement**: taken from the query's plan (`EXPLAIN`).
  When the query reads one measurement, it is the `source_measurement` tag and names the default `target_measurement`;
  with several, writing needs `target_measurement`.

`window`, `point_limit` and `sampling_interval` apply to the query's result.
The plugin reads the whole result into memory before `point_limit` cuts it, so the query must bound its own time range
(`WHERE time > now() - INTERVAL '6 hours'`), above all in a scheduled trigger, which runs it on every run.
With `window`, the server filters the result by its `time` column, as
`SELECT * FROM (<query>) WHERE time > now() - <window>`; a query that cannot be wrapped this way, such as one with an
integer `time`, is read whole and filtered by the plugin, which logs a warning.

### Output data structure

The scheduled trigger, and an HTTP request with `write_results`, write one row per forecast point to
`target_measurement`.

Tags:

- `field`: the forecast field
- `model`: the full model ID, as in the response
- `source_measurement`: the source measurement; with `query`, only when it reads one
- `forecast_id`: when set
- the series tags, as in the response `tags`, except one named like a tag or field of the row, which is left out

Fields:

- `forecast` (float): the central forecast, the median
- `lower_<percent>`, `upper_<percent>` (float): interval bounds, for example `lower_80`, `upper_97.5`
- `step` (integer): the forecast step, `1` for the first point after the history
- `points_read` (integer): observed history points the model used, that is cells of the grid that hold data
- `run_time` (string): when the run happened, UTC to the second, for example `2026-10-26T12:00:00Z`

Timestamp: `time`, the forecast point's time in nanoseconds.

A later run overwrites the points it repeats: buckets of `sampling_interval` and the grid of raw points keep their
timestamps from run to run.
A longer horizon from an earlier run remains, so read the latest `run_time`.
Two triggers that forecast one series with different settings, for example different horizons, write to the same rows;
give each its own `forecast_id` and read by it.

### Security

- `sql_filter` is inserted into the query as is.
  It can reference any table of the source database, for example in a subquery.
- The plugin reads `source_database` and writes `target_database` with the Processing Engine's rights, not the caller's.
  Only an admin token can call an HTTP trigger, so whoever calls it can already read every database.

### Forecast interface manifest

[`forecast_interface.json`](forecast_interface.json) describes this plugin under the shared forecasting interface,
contract version 1: the engine's name and description, its modes, filters, history and horizon controls, models with
their labels and limits, and advanced parameters.
InfluxDB 3 Explorer reads it from the plugin's registry package to configure its forecasting UI.
The plugin never reads it: it validates every request on its own and runs any model the library can load.

## Code overview

### Key functions

- **`process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None)`**: HTTP entry point;
  returns the response body and its HTTP status.
- **`process_scheduled_call(influxdb3_local, call_time, args=None)`**: scheduled entry point; writes every run and logs
  errors with their code.
- **`_load_settings(args, names, request_layers)`** / **`_resolve(cfg, scheduled)`**: merge every settings source with
  `influxdata-plugin-utils`, resolve the choices between keys by the highest source, validate each value, and check the
  parameters against each other, including the horizon against `max_forecast_points` when its length in points does not
  depend on the data.
- **`_measurement_plan(influxdb3_local, req)`** / **`_read_measurement(influxdb3_local, req, plan, limit)`**: check the
  names against the schema, find the series and their single-valued tags with one aggregate query (which also enforces
  `max_series` and `series_limit`, keeping only the chosen series with `_chosen_series`), and refuse a series mixing tag
  sets that write at the same time, before the model loads; then read the history of every series in one query, at most
  `limit` points each, averaging rows that share a timestamp.
- **`_query_measurements(influxdb3_local, req)`** / **`_read_query(influxdb3_local, req)`**: plan the query with
  `EXPLAIN` for its source measurement, run it before the model loads (with `window` as a filter the server applies when
  the query can be wrapped), split the result into series by column type, sort them, and apply `series_limit`.
- **`_history_limit(pipeline, req)`** / **`_regularize(series, req, limit)`**: cap the history at `point_limit` and the
  model's context, and lay it on a grid: the `sampling_interval` buckets without the one still filling, or, for raw
  points, a grid at their median spacing that keeps their rhythm (`_grid_anchor`); empty cells are gaps.
- **`_pipeline_for(influxdb3_local, req, task_id)`**: loads the model when a series has enough points, either from the
  row counts or, when rows arrived between two queries, from the history read, and checks it for covariates.
- **`_quantile_plan(pipeline, levels)`** / **`_predict(pipeline, inputs, horizon, quantiles)`**: turn each level `L`
  into the quantiles `(1 − L) / 2` and `(1 + L) / 2`, and forecast every series in one `predict_quantiles` call.
- **`_split_backtest(series, limit, held_out)`** / **`_backtest_result(matrix, actual, level_columns, median)`**: hold
  out the last `backtest_points` cells as the backtest's input of the same length as the forecast's, and score its
  forecast against them: the share inside each level and the MAE.
- **`_load_model(model_id, influxdb3_local, task_id)`**: loads a model once and keeps the two most recently used ones
  for later runs.
  The module is reloaded on every run, so the loaded models and a load lock live in a module registered in
  `sys.modules`.
  Loads are serialized: transformers' `from_pretrained` swaps process-wide functions while it builds a model, and
  overlapping loads could leave weight tying switched off for good.

### Docker environment notes

The plugin sets environment variables at import time for Docker compatibility:

- `USER=influxdb3` — HuggingFace Hub requires a username
- `HF_HOME=/tmp/hf_cache` — writable cache directory for model downloads
- `HOME=/tmp` — fallback home directory for unmapped UIDs
- `TORCHDYNAMO_DISABLE=1` — disables `torch.compile` to avoid conflicts in embedded Python
- `HF_HUB_DISABLE_PROGRESS_BARS=1`, `TQDM_DISABLE=1` — disable tqdm/HuggingFace progress bars

These are no-ops when running outside Docker with a normal user environment.

## Troubleshooting

### Common issues

**`model_unavailable`**

- The first run downloads the model from HuggingFace, so the InfluxDB host needs internet access and a writable
  `HF_HOME`; in Docker the plugin sets `HF_HOME=/tmp/hf_cache`.
- For air-gapped environments, pre-download the model and set `model` to its local path.
- If the message says the model loaded with weights missing, another plugin loaded a transformers model at the same
  moment; restart InfluxDB.

**`too_few_points`**

- A series needs at least 10 observed points in the window the message names; see [History](#history) for the default
  window.
  Widen `window`, set `sampling_interval` for sparse data, or raise `point_limit`.

**`bad_request: rows of the series ... come from several tag sets writing at the same time`**

- Without `sampling_interval`, rows of several tag sets of one series would interleave.
  Add the tags the message names to `group_by`, pin them with `tag_filter`, or set `sampling_interval` to forecast their
  mean per bucket.

**`bad_request: ... more forecasts than max_series`**

- `group_by` or a query produced more series × fields than `max_series`.
  Set `series_limit` to forecast the first ones, narrow the request with `tag_filter` or `sql_filter`, or raise
  `max_series`.

**`bad_request: ... more than max_forecast_points`**

- The horizon in points is longer than `max_forecast_points`; `horizon_duration` is converted by the data spacing, so a
  fine spacing makes many points.
  Shorten the horizon, set `sampling_interval`, or raise `max_forecast_points`.

**`bad_request: ... clashes with a column of the stored forecast rows`**

- A `group_by` tag or a query key column is named like a column the plugin writes, such as `step` or `model`.
  Forecast with a query that renames it, for example `SELECT time, step AS process_step, usage FROM process`, or
  forecast without writing.

**`internal: the query failed: unsupported Arrow type for Python conversion`**

- The query returns a column type the Processing Engine does not pass to plugins, such as `INT`, `REAL`, `DECIMAL`, an
  array or a struct.
  Cast it to `BIGINT`, `DOUBLE` or `VARCHAR` in the query.

**`bad_request: no time column in query result`**

- Alias the query's timestamp `AS time`, for example `date_bin(INTERVAL '5 minutes', time) AS time`.

**`internal: forecast computed but its rows cannot be built`**

- The engine's `LineBuilder` refuses some names, such as a measurement, tag or column name with a space.
  Rename it in the query with an alias, or forecast without writing.

**`bad_request` for covariates**

- `covariate_fields` needs a Chronos-2 model, checked once the model loads, and does not apply to `query`.

**A scheduled trigger fails at the first comma**

- `--trigger-arguments` splits at every comma, so a `query` or `sql_filter` with one is cut or refused; set it in the
  TOML file.

**Slow inference**

- `chronos-bolt-tiny` (~8M parameters) forecasts in milliseconds on CPU; `amazon/chronos-2` takes seconds.
- Only the first run after a restart loads the model; later runs reuse it.


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
