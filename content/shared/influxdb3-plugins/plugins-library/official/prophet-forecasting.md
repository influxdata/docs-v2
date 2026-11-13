<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
⚡ scheduled, http
🏷️ forecasting, machine-learning, time-series, predictive-analytics
🔧 {{% product-name %}}

> [!Note]
> This plugin requires {{% product-name %}} 3.8.2 or later.


The Prophet Forecasting Plugin forecasts time series stored in {{% product-name %}} with Meta's Prophet library, fitting a model
to each series inside InfluxDB.
A scheduled trigger forecasts on every run and writes the forecast back to InfluxDB; an HTTP trigger answers each
request with the forecast.

- **A field or a query**: forecast a numeric field of a measurement, or the result of any SQL query, such as a chart's
  aggregating query.
- **Per series**: `group_by` splits the data by tags, and each series is trained on its own.
- **Prediction intervals**: any interval levels, as `lower_<percent>` / `upper_<percent>`.
- **Seasonality and holidays**: seasonality mode, trend changepoints, custom holidays and built-in holiday calendars.
- **Calendar grids**: forecast points on month starts, week ends or business days.
- **Saved models**: train once and reuse the model of each series.
- **Validation**: compare the forecast with the latest measured points, withhold a series that misses a threshold, and
  send one alert for the run.
- **Backtest**: on request, check the forecast on the latest history: the share of points inside each interval and the
  mean absolute error.
- **Shared forecasting interface**: requests, responses, errors and stored rows follow the contract shared by
  forecasting plugins, and [`forecast_interface.json`](https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/prophet_forecasting/forecast_interface.json) describes what this plugin supports.

## Software requirements

- **{{% product-name %}}**: 3.8.2 or later, with the Processing Engine enabled.
- **Python packages**:
    - `prophet` (time series forecasting)
    - `pandas` (for data manipulation; 2.x and 3.x are both supported)
    - `requests` (validation alerts)
    - `influxdata-plugin-utils` (configuration loading and writing)
- **Notification Sender Plugin** *(optional)*: needed for validation alerts; see the
  [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/).

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
   influxdb3 install package prophet
   influxdb3 install package pandas
   influxdb3 install package requests
   influxdb3 install package influxdata-plugin-utils
   ```
3. *(Optional)* For alerts, install the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/) and create an HTTP trigger
   for it.

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
A `string/list` parameter is a space-separated string in trigger arguments, through the CLI and the HTTP API alike,
and a list in the TOML file; `string/table` is `tag=value` pairs in trigger arguments and a table in the TOML file.
See [Value formats](#value-formats).

| Parameter                 | Type             | Default                           | Example                                                             | Description                                                                                                                                                          |
|---------------------------|------------------|-----------------------------------|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurement`      | string           | required¹                         | `temperature`                                                       | Measurement to read                                                                                                                                                  |
| `field`                   | string           | required¹                         | `value`                                                             | Numeric field to forecast                                                                                                                                            |
| `query`                   | string           | required¹                         | `SELECT * FROM temperature WHERE time > now() - INTERVAL '30 days'` | SQL whose result is forecast instead of `source_measurement` and `field`; see [Forecasting a query](#forecasting-a-query). A query with commas goes in the TOML file |
| `source_database`         | string           | the trigger's database            | `demo`                                                              | Database to read from; see [Security](#security)                                                                                                                     |
| `tag_filter`              | string/table     | none                              | `room=Kitchen site=eu` or `{ room = ["Kitchen", "Lounge"] }`        | Tags the rows must match: one value per tag in a string, one value or a list per tag in a table. Not with `query`                                                    |
| `sql_filter`              | string           | none                              | `value > 0`                                                         | SQL condition on tags and fields, without `WHERE`, AND-ed with `tag_filter` and inserted as is; see [Security](#security). Not with `query`                          |
| `group_by`                | string/list      | none                              | `room site` or `["room", "site"]`                                   | Tags to split by; each distinct combination is its own series with its own model; see [Series](#series). Not with `query`                                            |
| `series_limit`            | integer ≥ 1      | none                              | `5`                                                                 | Forecast only the first N forecasts (series × fields) in the order of [Series](#series) and skip the rest; at most `max_series`                                      |
| `window`                  | duration         | required²                         | `30d`                                                               | History as a time window ending now, including `validation_window`; see [History](#history)                                                                          |
| `point_limit`             | integer ≥ 3      | required²                         | `2000`                                                              | History as the most recent points of each series; see [History](#history)                                                                                            |
| `sampling_interval`       | duration         | none                              | `1h`                                                                | Resample history to the mean per bucket, also the forecast step; see [Forecast step and horizon](#forecast-step-and-horizon)                                         |
| `forecast_freq`           | pandas frequency | inferred                          | `MS`                                                                | Step of the forecast points over raw history; see [Forecast step and horizon](#forecast-step-and-horizon)                                                            |
| `horizon_steps`           | integer ≥ 1      | required³                         | `24`                                                                | Forecast length in points                                                                                                                                            |
| `horizon_duration`        | duration         | required³                         | `2d`                                                                | Forecast length as a duration from the last history point, rounded up to whole steps                                                                                 |
| `levels`                  | string/list      | `0.5 0.8`                         | `0.5 0.8 0.95` or `[0.5, 0.8, 0.95]`                                | Interval levels, each between 0 and 1                                                                                                                                |
| `model`                   | string           | `prophet`                         | `prophet`                                                           | The only model; any other value is refused                                                                                                                           |
| `target_measurement`      | string           | `_forecasts.<source_measurement>` | `_forecasts.temperature`                                            | Measurement the forecast is written to; required when `query` reads several measurements                                                                             |
| `target_database`         | string           | the trigger's database            | `forecasts`                                                         | Database the forecast is written to                                                                                                                                  |
| `forecast_id`             | string           | none                              | `ops-1h`                                                            | Tag `forecast_id` in every row, so forecasts of one series with different settings keep their own rows                                                               |
| `model_mode`              | string           | `train`                           | `predict`                                                           | `train` fits a new model on every run; `predict` reuses the saved one; see [Models](#models)                                                                         |
| `unique_suffix`           | string           | none                              | `20250619_v1`                                                       | Model version, up to 64 characters from letters, digits, `.`, `_` and `-`; required with `model_mode` `predict`                                                      |
| `seasonality_mode`        | string           | `additive`                        | `multiplicative`                                                    | `additive` or `multiplicative`                                                                                                                                       |
| `changepoint_prior_scale` | number > 0       | `0.05`                            | `0.1`                                                               | Flexibility of trend changepoints                                                                                                                                    |
| `changepoints`            | string/list      | none                              | `2025-01-01 2025-06-01` or `["2025-01-01", "2025-06-01"]`           | ISO dates of trend changepoints, in UTC unless they name a timezone; each must fall within every series' training history                                            |
| `holiday_date_list`       | string/list      | none                              | `2024-12-25 2025-12-25` or `["2024-12-25", "2025-12-25"]`           | ISO dates of custom holidays, in UTC unless they name a timezone, set together with `holiday_names` and as many                                                      |
| `holiday_names`           | string/list      | none                              | `Christmas Christmas` or `["Christmas", "Christmas"]`               | Names matching `holiday_date_list`; a name may repeat, and one with spaces needs a list; a name Prophet reserves, such as `trend`, is refused                        |
| `holiday_country_names`   | string/list      | none                              | `US` or `["US"]`                                                    | Country code for built-in holidays, refused if Prophet does not know it; of several only the first is used, with a warning                                           |
| `validation_window`       | duration         | none                              | `3d`                                                                | Duration held back from training before now; see [Validation](#validation)                                                                                           |
| `validation_alignment`    | string           | `position`                        | `nearest`                                                           | How measured and forecast points are paired: `position` or `nearest`; see [Validation](#validation)                                                                  |
| `msre_threshold`          | number ≥ 0       | no limit                          | `0.05`                                                              | Highest Mean Squared Relative Error a validated series may have                                                                                                      |
| `max_series`              | integer ≥ 1      | `100`                             | `50`                                                                | Most forecasts one run may produce (series × fields); more is refused unless `series_limit` keeps fewer                                                              |
| `max_forecast_points`     | integer ≥ 1      | `10000`                           | `1000`                                                              | Most forecast points per series, counting the validation window; a longer horizon is refused                                                                         |
| `config_file_path`        | string           | none                              | `prophet_forecasting_scheduler.toml`                                | TOML file with more arguments; see [Scheduled trigger TOML configuration](#scheduled-trigger-toml-configuration)                                                     |

¹ Either `source_measurement` with `field`, or `query`.
² At least one of `window` and `point_limit`, unless `query` is set.
³ Exactly one of `horizon_steps` and `horizon_duration`.

A scheduled trigger always writes and returns no response, and its history moves with each run, so it refuses
`write_results`, `backtest_points`, `start_time` and `end_time`.
An unknown argument or an invalid value fails every run with `bad_request` in the log.

### Validation alert parameters

`influxdb3_auth_token` and `twilio_token` are secrets: as trigger arguments they fail every run with `bad_request`, so
set them in the [TOML file](#scheduled-trigger-toml-configuration) or the
[environment](#scheduled-trigger-environment-variables).
The other parameters are set like those above.

| Parameter              | Type        | Default                | Example                                            | Description                                                                                                                              |
|------------------------|-------------|------------------------|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| `is_sending_alert`     | boolean     | `false`                | `true`                                             | Send one alert per run listing the series that failed validation                                                                         |
| `senders`              | string/list | none                   | `slack sms` or `["slack", "sms"]`                  | Sender types: `slack`, `discord`, `http`, `sms`, `whatsapp`; required with alerts                                                        |
| `notification_text`    | string      | a built-in text        | `Validation failed on $measurement: $series`       | Template with the variables `$version`, `$measurement`, `$field`, `$series`, `$start_time`, `$end_time`, `$output_measurement`           |
| `notification_path`    | string      | `notify`               | `notify`                                           | URL path of the notifier plugin's trigger                                                                                                |
| `port_override`        | integer     | `8181`                 | `8182`                                             | Port of the InfluxDB HTTP API, 1–65535                                                                                                   |
| `influxdb3_auth_token` | string      | `INFLUXDB3_AUTH_TOKEN` | `your_token`                                       | Token for the notifier's endpoint. TOML file or environment only                                                                         |
| `slack_webhook_url`    | string      | none                   | `https://hooks.slack.com/services/...`             | Webhook URL; required with the `slack` sender                                                                                            |
| `slack_headers`        | string      | none                   | `eyJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiJ9` | Base64-encoded headers for the Slack webhook                                                                                             |
| `discord_webhook_url`  | string      | none                   | `https://discord.com/api/webhooks/...`             | Webhook URL; required with the `discord` sender                                                                                          |
| `discord_headers`      | string      | none                   | `eyJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiJ9` | Base64-encoded headers for the Discord webhook                                                                                           |
| `http_webhook_url`     | string      | none                   | `https://example.com/webhook`                      | Webhook URL; required with the `http` sender                                                                                             |
| `http_headers`         | string      | none                   | `eyJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiJ9` | Base64-encoded headers for the HTTP webhook                                                                                              |
| `twilio_sid`           | string      | none                   | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                  | Twilio Account SID, for the `sms` and `whatsapp` senders                                                                                 |
| `twilio_token`         | string      | none                   | `your_auth_token`                                  | Twilio Auth Token, for the `sms` and `whatsapp` senders. TOML file or environment only; unset, the notifier reads its own `TWILIO_TOKEN` |
| `twilio_to_number`     | string      | none                   | `+1234567890`                                      | Recipient number; required with the `sms` and `whatsapp` senders                                                                         |
| `twilio_from_number`   | string      | none                   | `+19876543210`                                     | Twilio sender number; required with the `sms` and `whatsapp` senders                                                                     |

### Scheduled trigger environment variables

Every parameter can also come from an environment variable of the InfluxDB server named
`INFLUXDB3_PROPHET_FORECASTING_<PARAMETER>` in upper case, for example `INFLUXDB3_PROPHET_FORECASTING_LEVELS` sets
`levels` for every trigger of the plugin.

- The environment is the lowest layer: a trigger argument overrides it, and the TOML file overrides both.
- `INFLUXDB3_PROPHET_FORECASTING_CONFIG_FILE_PATH` names the TOML file when the trigger has no `config_file_path`
  argument.
- `INFLUXDB3_AUTH_TOKEN` also gives `influxdb3_auth_token`, below `INFLUXDB3_PROPHET_FORECASTING_INFLUXDB3_AUTH_TOKEN`.
- Variables of the HTTP-only keys (`..._WRITE_RESULTS`, `..._BACKTEST_POINTS`, `..._START_TIME`, `..._END_TIME`) are
  ignored by a scheduled trigger.

### Scheduled trigger TOML configuration

`config_file_path`, a trigger argument or the environment variable above, names a `.toml` file with more arguments.

- The path is absolute or relative to the plugin directory: the first set of `PLUGIN_DIR`, `INFLUXDB3_PLUGIN_DIR` and
  the parent of the engine's virtual environment.
- The file's keys override the trigger arguments; an argument the file does not set still applies.
- Lists and tables are native: `group_by = ["room"]`, `holiday_names = ["New Year"]`, and `[tag_filter]` with several
  values per tag (`room = ["Kitchen", "Lounge"]`). Keep the `[tag_filter]` table last: keys after a table header belong
  to the table.
- A `query` or `sql_filter` with a comma goes here: the CLI splits `--trigger-arguments` at every comma.
- An unknown key, `config_file_path` inside the file, `write_results`, `backtest_points`, `start_time` or `end_time`
  fails every run with `bad_request`.

#### Example scheduled TOML configuration

[prophet_forecasting_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/prophet_forecasting/prophet_forecasting_scheduler.toml) lists every key a scheduled trigger accepts,
with its default.
A query, which has commas, set through a file:

```toml
query = "SELECT date_bin(INTERVAL '1 hour', time) AS time, room, avg(value) AS value FROM temperature WHERE time > now() - INTERVAL '30 days' GROUP BY 1, room"
horizon_steps = 24
series_limit = 5
```
### Create a scheduled trigger

With trigger arguments:

```bash
influxdb3 create trigger \
  --database mydb \
  --path prophet_forecasting.py \
  --trigger-spec "every:1h" \
  --trigger-arguments "source_measurement=temperature,field=value,group_by=room,window=30d,sampling_interval=1h,horizon_steps=24" \
  prophet_forecast_scheduled
```
With the TOML file:

```bash
influxdb3 create trigger \
  --database mydb \
  --path prophet_forecasting.py \
  --trigger-spec "every:1h" \
  --trigger-arguments config_file_path=prophet_forecasting_scheduler.toml \
  prophet_forecast_scheduled
```
A `cron:` spec takes six fields, seconds first (`cron:20 0 * * * *`), which spreads the runs of several triggers.
Tune the settings with on-demand requests to an [HTTP trigger](#http-trigger) first: the response shows `points_read`
and `step_ms` for every series.

### Scheduled trigger example

The trigger above writes 24 one-hour points per room to `_forecasts.temperature` on every run.
Read the latest run of each series:

```sql
SELECT time, room, forecast, lower_80, upper_80, step, run_time
FROM (
    SELECT *, max (run_time) OVER (PARTITION BY field, room) AS latest
    FROM "_forecasts.temperature"
    ) AS f
WHERE run_time = latest
ORDER BY room, time
```
Expected output (first rows):

| time                | room    | forecast | lower_80 | upper_80 | step | run_time             |
|---------------------|---------|----------|----------|----------|------|----------------------|
| 2026-10-29T13:00:00 | Kitchen | 21.42    | 20.61    | 22.25    | 1    | 2026-10-29T12:00:05Z |
| 2026-10-29T14:00:00 | Kitchen | 21.58    | 20.74    | 22.39    | 2    | 2026-10-29T12:00:05Z |

The rows are described in [Output data structure](#output-data-structure).
With `forecast_id`, add `WHERE forecast_id = '<id>'` to the inner query.

### Scheduled trigger errors

A run that fails as a whole writes nothing and logs `[<task id>] <code>: <message>` at `ERROR`, with the codes of the
[HTTP errors](#http-trigger-errors).
A series that fails does not stop the others, which are written:

- too few points logs `[<task id>] too_few_points for <field> <tags>: <message>` at `WARN`;
- a failed validation (`other`), an unreadable saved model (`model_unavailable`) or a failed training (`internal`) logs
  the same line at `ERROR`.

These lines and the validation alert come before the write, so a failed write costs the run's rows, not them.

Read the log:

```sql
SELECT event_time, log_level, log_text
FROM system.processing_engine_logs
WHERE trigger_name = 'prophet_forecast_scheduled'
ORDER BY event_time DESC LIMIT 20
```
## HTTP trigger

An HTTP trigger answers each request with the forecast and writes it only with `write_results`.
Only an admin token can call it.

### HTTP request parameters

Send these as a JSON object in the body of a POST request.
The trigger's arguments and TOML file set defaults for the same keys; see
[HTTP trigger arguments](#http-trigger-arguments).
A `string/list` parameter is a list in the body and the TOML file, and a space-separated string in trigger arguments,
headers and the query string; the body takes the string too. `string/object` is the same for `tag_filter`, with
`tag=value` pairs as the string.

| Parameter                 | Type             | Default                           | Example                                                                               | Description                                                                                                                                                     |
|---------------------------|------------------|-----------------------------------|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurement`      | string           | required¹                         | `"temperature"`                                                                       | Measurement to read                                                                                                                                             |
| `field`                   | string           | required¹                         | `"value"`                                                                             | Numeric field to forecast                                                                                                                                       |
| `query`                   | string           | required¹                         | `"SELECT time, room, value FROM temperature WHERE time > now() - INTERVAL '30 days'"` | SQL whose result is forecast instead of `source_measurement` and `field`; see [Forecasting a query](#forecasting-a-query)                                       |
| `source_database`         | string           | the trigger's database            | `"demo"`                                                                              | Database to read from; an unknown one is refused; see [Security](#security)                                                                                     |
| `tag_filter`              | string/object    | none                              | `{"room": ["Kitchen", "Lounge"], "site": "eu"}` or `"room=Kitchen site=eu"`           | Tags the rows must match: one value or an array of several per tag in an object, one value per tag in a string. Not with `query`                                |
| `sql_filter`              | string           | none                              | `"value > 0"`                                                                         | SQL condition on tags and fields, without `WHERE`, AND-ed with `tag_filter` and inserted as is; see [Security](#security). Not with `query`                     |
| `group_by`                | string/list      | none                              | `["room", "site"]` or `"room site"`                                                   | Tags to split by; each distinct combination is its own series with its own model; see [Series](#series). Not with `query`                                       |
| `series_limit`            | integer ≥ 1      | none                              | `5`                                                                                   | Forecast only the first N forecasts (series × fields) in the order of [Series](#series) and skip the rest; at most `max_series`                                 |
| `window`                  | duration         | required²                         | `"30d"`                                                                               | History as a time window ending now, including `validation_window`; see [History](#history)                                                                     |
| `point_limit`             | integer ≥ 3      | required²                         | `2000`                                                                                | History as the most recent points of each series; see [History](#history)                                                                                       |
| `start_time`              | ISO 8601         | required²                         | `"2025-05-20T00:00:00Z"`                                                              | Start of an absolute history, with a timezone. Set with `end_time`. Not with `query`                                                                            |
| `end_time`                | ISO 8601         | required²                         | `"2025-06-19T00:00:00Z"`                                                              | End of an absolute history, with a timezone; the forecast continues from the last point before it; see [History](#history)                                      |
| `sampling_interval`       | duration         | none                              | `"1h"`                                                                                | Resample history to the mean per bucket, also the forecast step; see [Forecast step and horizon](#forecast-step-and-horizon)                                    |
| `forecast_freq`           | pandas frequency | inferred                          | `"MS"`                                                                                | Step of the forecast points over raw history; see [Forecast step and horizon](#forecast-step-and-horizon)                                                       |
| `horizon_steps`           | integer ≥ 1      | required³                         | `24`                                                                                  | Forecast length in points                                                                                                                                       |
| `horizon_duration`        | duration         | required³                         | `"2d"`                                                                                | Forecast length as a duration from the last history point, rounded up to whole steps                                                                            |
| `levels`                  | string/list      | `[0.5, 0.8]`                      | `[0.5, 0.8, 0.95]` or `"0.5 0.8 0.95"`                                                | Interval levels, each between 0 and 1                                                                                                                           |
| `model`                   | string           | `"prophet"`                       | `"prophet"`                                                                           | The only model; any other value is refused                                                                                                                      |
| `write_results`           | boolean          | `false`                           | `true`                                                                                | Also write the forecast; see [Output data structure](#output-data-structure)                                                                                    |
| `target_measurement`      | string           | `_forecasts.<source_measurement>` | `"_forecasts.temperature"`                                                            | Measurement a written forecast goes to; required when `query` reads several measurements                                                                        |
| `target_database`         | string           | the trigger's database            | `"forecasts"`                                                                         | Database a written forecast goes to                                                                                                                             |
| `forecast_id`             | string           | none                              | `"ops-1h"`                                                                            | Tag `forecast_id` in every written row, so forecasts of one series with different settings keep their own rows                                                  |
| `model_mode`              | string           | `"train"`                         | `"predict"`                                                                           | `train` fits a new model per request; `predict` reuses the saved one; see [Models](#models)                                                                     |
| `unique_suffix`           | string           | none                              | `"20250619_v1"`                                                                       | Model version, up to 64 characters from letters, digits, `.`, `_` and `-`; required with `model_mode` `predict`                                                 |
| `seasonality_mode`        | string           | `"additive"`                      | `"multiplicative"`                                                                    | `additive` or `multiplicative`                                                                                                                                  |
| `changepoint_prior_scale` | number > 0       | `0.05`                            | `0.1`                                                                                 | Flexibility of trend changepoints                                                                                                                               |
| `changepoints`            | string/list      | none                              | `["2025-01-01", "2025-06-01"]` or `"2025-01-01 2025-06-01"`                           | ISO dates of trend changepoints, in UTC unless they name a timezone; each must fall within every series' training history                                       |
| `holiday_date_list`       | string/list      | none                              | `["2024-12-25", "2025-12-25"]` or `"2024-12-25 2025-12-25"`                           | ISO dates of custom holidays, in UTC unless they name a timezone, set together with `holiday_names` and as many                                                 |
| `holiday_names`           | string/list      | none                              | `["Christmas", "Christmas"]` or `"Christmas Christmas"`                               | Names matching `holiday_date_list`; a name may repeat, and one with spaces needs a list; a name Prophet reserves, such as `trend`, is refused                   |
| `holiday_country_names`   | string/list      | none                              | `["US"]` or `"US"`                                                                    | Country code for built-in holidays, refused if Prophet does not know it; of several only the first is used, with a warning                                      |
| `validation_window`       | duration         | none                              | `"3d"`                                                                                | Duration held back from training before now or `end_time`; see [Validation](#validation). Not with `backtest_points`                                            |
| `validation_alignment`    | string           | `"position"`                      | `"nearest"`                                                                           | How measured and forecast points are paired: `position` or `nearest`; see [Validation](#validation)                                                             |
| `msre_threshold`          | number ≥ 0       | no limit                          | `0.05`                                                                                | Highest Mean Squared Relative Error a validated series may have                                                                                                 |
| `backtest_points`         | integer ≥ 1      | none                              | `12`                                                                                  | Hold out the latest N history points and return each series' `backtest`, at most `max_forecast_points`; see [Backtest](#backtest). Not with `validation_window` |
| `max_series`              | integer ≥ 1      | `100`                             | `50`                                                                                  | Most forecasts the request may produce (series × fields); more is refused unless `series_limit` keeps fewer                                                     |
| `max_forecast_points`     | integer ≥ 1      | `10000`                           | `1000`                                                                                | Most forecast points per series, counting the validation window; a longer horizon is refused                                                                    |

¹ Either `source_measurement` with `field`, or `query`.
² A measurement needs `window`, `point_limit`, or `start_time` with `end_time`; a query needs none of them.
³ Exactly one of `horizon_steps` and `horizon_duration`.

An unknown key or an invalid value answers `bad_request`.
`config_file_path` is never read from a request.

### HTTP headers and query string

Any request parameter can also come from a header or the query string, as text:

- A header is named `X-Influxdb3-Prophet-Forecasting-<key>`, with hyphens for underscores, in any case:
  `X-Influxdb3-Prophet-Forecasting-horizon-steps: 24`.
  A header with this prefix that names no parameter answers `bad_request`; other headers are ignored.
- The query string takes the key as is: `?horizon_steps=24&levels=0.5%200.8`.

From lowest to highest, the sources are the environment, trigger arguments, the TOML file, the body, headers and the
query string.

### HTTP trigger arguments

Trigger arguments and the TOML file set defaults for every request to the trigger.

A choice between keys is made as a whole by the highest source that sets either side, and the other side from lower
sources is dropped:

| Set by the request       | Replaces, set on the trigger                                          |
|--------------------------|-----------------------------------------------------------------------|
| `query`                  | `source_measurement`, `field`, `tag_filter`, `sql_filter`, `group_by` |
| `horizon_steps`          | `horizon_duration`                                                    |
| `start_time`, `end_time` | `window`, `point_limit`                                               |
| `forecast_freq`          | `sampling_interval`                                                   |

Each works the other way round too, and both sides in one source answer `bad_request`.
In this choice, empty text, lists and objects do not count as set.
Elsewhere, empty text and `null` keep the value from a lower source, and an empty list or object replaces it:
`group_by: []` means no split for this request.

### HTTP trigger environment variables

As for the [scheduled trigger](#scheduled-trigger-environment-variables): every request parameter can come from
`INFLUXDB3_PROPHET_FORECASTING_<PARAMETER>`, the lowest source.
`INFLUXDB3_PROPHET_FORECASTING_CONFIG_FILE_PATH` names the TOML file when the trigger has no `config_file_path`
argument.

### HTTP trigger TOML configuration

`config_file_path`, a trigger argument or the environment variable above, names a `.toml` file of defaults; a request
can never name it.
Its path and format are those of the [scheduled trigger's file](#scheduled-trigger-toml-configuration), and an unknown
key fails every request with `bad_request`.

#### Example HTTP TOML configuration

[prophet_forecasting_http.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/prophet_forecasting/prophet_forecasting_http.toml) lists every key a request accepts, with its default.
A trigger that fixes the source and leaves each request the horizon:

```toml
source_measurement = "temperature"
field = "value"
group_by = ["room"]
window = "30d"
sampling_interval = "1h"
```
### Create an HTTP trigger

```bash
influxdb3 create trigger \
  --database mydb \
  --path prophet_forecasting.py \
  --trigger-spec "request:forecast" \
  --trigger-arguments config_file_path=prophet_forecasting_http.toml \
  prophet_forecast_http
```
The trigger answers at `/api/v3/engine/forecast`.
Without trigger arguments, each request carries its whole configuration.

### HTTP trigger examples

#### Forecast a field, per room

```bash
curl --request POST http://localhost:8181/api/v3/engine/forecast \
  --header "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "source_measurement": "temperature",
    "field": "value",
    "group_by": ["room"],
    "window": "30d",
    "sampling_interval": "1h",
    "horizon_steps": 2,
    "levels": [0.8]
  }'
```
Expected response:

```json
{
  "status": "ok",
  "model": "prophet",
  "levels": [
    0.8
  ],
  "series_total": 2,
  "results": [
    {
      "field": "value",
      "tags": {
        "room": "Kitchen"
      },
      "points_read": 720,
      "step_ms": 3600000,
      "forecast": [
        {
          "timestamp": 1761742800000,
          "forecast": 21.42,
          "lower_80": 20.61,
          "upper_80": 22.25
        },
        {
          "timestamp": 1761746400000,
          "forecast": 21.58,
          "lower_80": 20.74,
          "upper_80": 22.39
        }
      ]
    },
    {
      "field": "value",
      "tags": {
        "room": "Lounge"
      },
      "status": "error",
      "code": "too_few_points",
      "message": "need >= 3 points, got 2 in the last 30d"
    }
  ]
}
```
| Field                                 | Description                                                                        |
|---------------------------------------|------------------------------------------------------------------------------------|
| `model`, `levels`                     | What ran; every point holds `lower_<percent>` and `upper_<percent>` for each level |
| `series_total`                        | Forecasts (series × fields) the request selects before `series_limit`              |
| `results[].field`, `tags`             | The forecast field and the series' tags; see [Series](#series)                     |
| `results[].points_read`               | History points the model was trained on                                            |
| `results[].step_ms`                   | Spacing between forecast points, in milliseconds                                   |
| `results[].forecast[].timestamp`      | The point's time, in epoch milliseconds                                            |
| `results[].forecast[].forecast`       | The central forecast, Prophet's `yhat`                                             |
| `results[].backtest`                  | With `backtest_points`: the check on the latest history; see [Backtest](#backtest) |
| `results[].status`, `code`, `message` | Present only when this series failed, which leaves the request `200`               |

#### Forecast a query

```bash
curl --request POST http://localhost:8181/api/v3/engine/forecast \
  --header "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "query": "SELECT date_bin(INTERVAL '\''1 hour'\'', time) AS time, room, avg(value) AS value FROM temperature WHERE time > now() - INTERVAL '\''30 days'\'' GROUP BY 1, room",
    "horizon_duration": "1d"
  }'
```
#### An absolute history, a calendar grid and holidays

```bash
curl --request POST http://localhost:8181/api/v3/engine/forecast \
  --header "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "source_measurement": "sales",
    "field": "total",
    "start_time": "2023-01-01T00:00:00Z",
    "end_time": "2026-01-01T00:00:00Z",
    "forecast_freq": "MS",
    "horizon_steps": 6,
    "seasonality_mode": "multiplicative",
    "holiday_country_names": ["US"],
    "write_results": true,
    "forecast_id": "sales-monthly"
  }'
```
### Backtest

With `backtest_points: N`, the plugin also checks the forecast on the latest history.
It holds out the last N points of each series, trains a second model on the points before them with the same settings,
levels and history length, forecasts the held-out times, and compares.
Each successful result then carries `backtest`:

```json
{
  "backtest": {
    "points": 12,
    "coverage": {
      "50": 0.5,
      "80": 0.833
    },
    "mae": 1.43
  }
}
```
- `points`: the measured points compared.
- `coverage`: per level, the share of those points inside its interval.
  A share close to the level means the intervals are calibrated.
- `mae`: the mean absolute difference between the central forecast and the measured points, in the field's units.

`backtest` is `null` when fewer than 3 points precede the held-out ones, or when training on them fails, for example
with a date in `changepoints` after the cut, which the plugin logs as a warning; the forecast itself is the same as
without the check.
The check reads N more points per series and trains each series a second time, so it about doubles the training time.
With `model_mode: predict` the forecast still comes from the saved model, as that model has seen the held-out points the
check trains a fresh one, which is not saved.
With N equal to the horizon, it measures accuracy over the same distance as the forecast; a small N gives a noisy
estimate.
N above `max_forecast_points`, or `backtest_points` with `validation_window`, answers `bad_request`.

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
| `internal`          | `500` | A query or the write failed, or a forecast row cannot be built                                                                                                                                |
| `too_few_points`    | —     | Per series, in `results`, with the request still `200`                                                                                                                                        |
| `other`             | —     | Per series, in `results`: the series failed validation                                                                                                                                        |
| `model_unavailable` | —     | Per series, in `results`: its saved model cannot be read                                                                                                                                      |
| `internal`          | —     | Per series, in `results`: training or predicting this series failed                                                                                                                           |

The plugin logs a `bad_request` at `WARN` and the other request-level codes at `ERROR`.

## Forecasting details

### Value formats

- In trigger arguments, headers and the query string every value is a string: lists are space-separated
  (`group_by=room site`, `levels=0.5 0.8`, `senders=slack sms`), and `tag_filter` is space-separated `tag=value` pairs
  with one value per tag.
- The JSON body and the TOML file take native lists and objects, also for a name with spaces (`["New Year"]`).
- **Durations** are a whole number and a unit: `us`, `ms`, `s`, `min`, `h`, `d`, `w`, `m` (a month, 30.42 days), `q`
  (91.25 days) or `y` (365 days). `m` is never minutes.
- The CLI splits `--trigger-arguments` at every comma, so a `query` or `sql_filter` with a comma (`room IN ('a', 'b')`)
  goes in the TOML file or the request.

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
- Rows of a series sharing a timestamp are averaged.
- Without `sampling_interval`, a series whose rows come from several tag sets writing at the same time within the
  history the model trains on is refused with `bad_request`, for example several hosts without `group_by`: interleaved,
  they would form a saw-tooth.
  That history is the series' last `point_limit` points, or all of `window` when only it is set, before the
  `validation_window` if there is one.
  Add the tags the message names to `group_by`, pin them with `tag_filter`, or set `sampling_interval` to forecast their
  mean per bucket.
  A tag that changes value over time, such as a version after an upgrade, does not make a series mixed; one that flips
  back and forth, such as a status, does, so set `sampling_interval` for it.
  With `query` the plugin cannot see tag sets, so the query has to keep series apart.
- When the forecast is written, a `group_by` tag or a query key column named like a column of the
  [stored rows](#output-data-structure) is refused with `bad_request`: as a tag it would break the row or merge series.

### History

- A measurement needs a history: `window`, `point_limit`, or, on demand, `start_time` with `end_time`.
- `window` reads every point of the window; with `point_limit`, its last points per series.
  There is no default cap on the points: `window: 7d` on one-second data sends about 600,000 points per series to
  Prophet, and training time grows with them, so bound them with `point_limit` or `sampling_interval`.
- `point_limit` alone reads its buckets of `sampling_interval` back from now, at most 365 days, or 30 days of raw
  points, so a read never scans the whole table.
- `window` and `point_limit` read history that ends now, so a row with a later timestamp is not read until its time
  comes: with a device whose clock runs an hour fast, its latest hour stays out of the forecast.
- `start_time` and `end_time` read that range, including rows later than now, and exclude `window` and `point_limit`.
- With `sampling_interval` the history always ends at the last full bucket before now or `end_time`, whichever comes
  first. A `window` shorter than one bucket, or a `start_time` not before that end, answers `bad_request`.
- With `query` there is no default window; see [Forecasting a query](#forecasting-a-query).
- A series needs at least 3 points; fewer answers `too_few_points` for that series, naming what was read.

### Forecast step and horizon

The forecast starts one step after the last history point and the horizon counts from there, so the forecast continues
the chart's line.
With `end_time` that is the last point before it.

| Set                 | History the model reads                                                        | Step of the forecast                                                                    |
|---------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `sampling_interval` | The mean per bucket, aligned like `date_bin`, without the bucket still filling | The interval                                                                            |
| `forecast_freq`     | The raw points                                                                 | The pandas frequency: fixed (`30min`, `1h`) or calendar (`D`, `W-SUN`, `MS`, `QS`, `B`) |
| neither             | The raw points                                                                 | The frequency pandas infers from the data, or else their median spacing                 |

- Prophet takes unevenly spaced points as they are, so an empty bucket is simply no point.
- The response gives times in milliseconds, so with a step below 1 ms `step_ms` is `0` and points can share a
  `timestamp`; stored rows keep nanoseconds.
- The median spacing is rounded to a round unit about 1% of it, and forecast points keep the rhythm most history points
  follow, so a later run overwrites the same timestamps despite jitter.
- `horizon_steps` counts points of the step; `horizon_duration` is rounded up to whole steps, at least one, so `1h` on
  daily data gives one point a day ahead.

### Models

The only model is `prophet`.

- `model_mode: train`, the default, fits a new model on every run or request.
- `model_mode: predict` loads the model saved for `unique_suffix` and the series, or trains and saves it when there is
  no file.
  A loaded model is not refreshed: to retrain, change `unique_suffix`. `points_read` is then the number of points it was
  trained on.
  A loaded model still needs at least 3 history points, which place its forecast in time; `point_limit: 3` is the
  smallest read.
- Saved models live in `<plugin directory>/prophet_models/`, as `prophet_model_<unique_suffix>_<digest>.json`.
  The digest stands for the data the model trains on: `source_database`, the source measurement or `query`, the field,
  the series' `group_by` tags or key columns, `tag_filter`, `sql_filter` and `sampling_interval`.
  Changing any of them trains a new model once, and the earlier file stays on disk.
- `window`, `point_limit`, `start_time`, `end_time` and the model's settings, such as `seasonality_mode`, are not part
  of the digest: to apply a change to them, change `unique_suffix`.
  A tag outside `group_by` does not change the model either; add it to `group_by` to get a model per value.
- The plugin cannot see which database its trigger belongs to, so two triggers in different databases with one
  `unique_suffix` share a file unless they set `source_database`.
- A `query` whose text differs on every call, such as one with absolute times, trains and saves a new model each time;
  use `model_mode: train` for it.
- A file that cannot be read answers `model_unavailable` for its series, and the other series go on.
- A file that cannot be written, as in a read-only plugin directory, logs a warning: the forecast still answers, and the
  series trains again on every run.
- Each series is trained on its own, one after another, about 0.1–0.5 s per series on CPU, so `max_series` also bounds
  how long a request takes.

**Intervals** come from Prophet's own samples (1000 per point), so any level works.
Level `L` gives the percentiles `(1 − L) / 2` and `(1 + L) / 2` of the samples, widened if needed to hold the central
forecast.

### Validation

`validation_window` holds back the latest measured points to check the forecast on them.

- The model trains on the history before the cut, which is `validation_window` before the end of the history: now or
  `end_time`, or with `sampling_interval` the last full bucket.
  `points_read` and `point_limit` count that training history.
- With `sampling_interval` the window is rounded out to whole buckets, at least one: `30min` with `1h` buckets checks
  one bucket, and `90min` checks two. A window of few points gives a noisy estimate.
- It forecasts through the window and on past the last measured point; only the part after that point is answered and
  written, and the horizon counts from it.
- Measured and forecast points are compared by the Mean Squared Relative Error: `position` pairs them in time order, and
  `nearest` pairs each measured point with the closest forecast point within half a step.
  Measured zeros are skipped, as a relative error divides by them.
- A series fails when its MSRE exceeds `msre_threshold`, cannot be computed, or the window holds no measured point.
  It answers `other` without a forecast, and nothing is written for it; the other series go on.
- A scheduled trigger with `is_sending_alert` sends one alert for the run, listing the failed series in `$series`.
- It does not combine with `backtest_points`, which answers `bad_request`: both hold back the latest points.

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

`window`, `point_limit`, `sampling_interval` and `validation_window` apply to the query's result; `start_time` and
`end_time` do not.
The plugin reads the whole result into memory before `point_limit` cuts it, so the query must bound its own time range
(`WHERE time > now() - INTERVAL '30 days'`), above all in a scheduled trigger, which runs it on every run.
With `window`, the server filters the result by its `time` column, as
`SELECT * FROM (<query>) WHERE time > now() - <window>`; a query that cannot be wrapped this way, such as one with an
integer `time`, is read whole and filtered by the plugin, which logs a warning.

The query defines its own history, so rows with later timestamps stay, and the forecast continues after them, as with
day-ahead prices.
To leave them out, add `WHERE time < now()` to the query.
Only `sampling_interval` ends the result at the last full bucket.

### Output data structure

The scheduled trigger, and an HTTP request with `write_results`, write one row per forecast point to
`target_measurement`.

Tags:

- `field`: the forecast field
- `model`: `prophet`
- `source_measurement`: the source measurement; with `query`, only when it reads one
- `forecast_id`: when set
- the series tags, as in the response `tags`, except one named like a tag or field of the row, which is left out

Fields:

- `forecast` (float): the central forecast, Prophet's `yhat`
- `lower_<percent>`, `upper_<percent>` (float): interval bounds, for example `lower_80`, `upper_97.5`
- `step` (integer): the forecast step, `1` for the first point after the history
- `points_read` (integer): history points the model was trained on
- `run_time` (string): when the run happened, UTC to the second, for example `2026-10-26T12:00:00Z`

Timestamp: `time`, the forecast point's time in nanoseconds.

A later run overwrites the points it repeats, and a longer horizon from an earlier run remains, so read the latest
`run_time`.
Two triggers that forecast one series with different settings, for example different horizons, write to the same rows;
give each its own `forecast_id` and read by it.

### Security

- `sql_filter` is inserted into the query as is.
  It can reference any table of the source database, for example in a subquery.
- The plugin reads `source_database` and writes `target_database` with the Processing Engine's rights, not the caller's.
  Only an admin token can call an HTTP trigger, so whoever calls it can already read every database.
- Trigger arguments can be read from `system.processing_engine_trigger_arguments`, so `influxdb3_auth_token` and
  `twilio_token` are refused there.
  Webhook URLs and `*_headers` are accepted; when they hold a token, keep them in the TOML file or the environment.

### Forecast interface manifest

[`forecast_interface.json`](https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/prophet_forecasting/forecast_interface.json) describes this plugin under the
[shared forecasting interface](https://github.com/influxdata/influxdb3_plugins/blob/main/docs/FORECASTING_INTERFACE.md),
contract version 1: the engine's name and description, its modes, filters, history and horizon controls, its model and
limits, and advanced parameters.
An app can read it from the plugin's registry package to configure its UI.
The plugin never reads it: it validates every request on its own.

## Code overview

### Key functions

- **`process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None)`**: HTTP entry point;
  returns the response body and its HTTP status.
- **`process_scheduled_call(influxdb3_local, call_time, args=None)`**: scheduled entry point; writes every run, logs
  errors with their code, and sends the validation alert.
- **`_load_settings(args, names, request_layers)`** / **`_resolve(cfg, scheduled, now_ns)`**: merge every settings
  source with `influxdata-plugin-utils`, resolve the choices between keys by the highest source, validate each value,
  and check the parameters against each other.
- **`_measurement_plan(influxdb3_local, req)`** / **`_read_measurement(influxdb3_local, req, plan)`**: check the names
  against the schema, find the series and their single-valued tags with one aggregate query (which also enforces
  `max_series` and `series_limit`, keeping only the chosen series with `_chosen_series`), and refuse a series mixing tag
  sets that write at the same time; then read the history of every series, and the validation window's points in a
  second query.
- **`_query_measurements(influxdb3_local, req)`** / **`_read_query(influxdb3_local, req, task_id)`**: plan the query
  with `EXPLAIN` for its source measurement, run it (with `window` as a filter the server applies when the query can be
  wrapped), split the result into series by column type, sort them, and apply `series_limit`.
- **`_forecast_step(series, req)`** / **`_forecast_grid(series, req)`**: find the step and the first point after the
  history, and lay out the points through the validation window and the horizon; a horizon past `max_forecast_points`
  refuses the request before any model trains.
- **`_model_for(influxdb3_local, req, series, task_id)`** / **`_train(req, series)`**: train a model, or load and save
  the one for this version and series.
- **`_predict(model, times, levels)`**: the central forecast from `predict`, and the bounds of each level from one
  `predictive_samples` draw.
- **`_validation_problem(influxdb3_local, series, grid, central, req, task_id)`**: compare the forecast with the
  measured points by MSRE and say why a series fails.
- **`_split_backtest(series, req)`** / **`_backtest(influxdb3_local, req, split, task_id)`**: hold out the last
  `backtest_points` points, train a model on a history as long as the forecast's, and score it against them: the share
  inside each level and the MAE.
- **`_send_validation_alert(influxdb3_local, cfg, req, failed, task_id)`**: send one alert for the run through the
  notifier plugin.

## Troubleshooting

### Common issues

**`too_few_points`**

- A series needs at least 3 points in the window the message names, and before the cut with `validation_window`.
  Widen `window`, or shorten `sampling_interval`.

**`other: validation failed`**

- The forecast missed the measured points by more than `msre_threshold`, or the validation window holds no measured
  point.
  Check the `MSRE` line in the log, raise `msre_threshold`, tune `seasonality_mode` or `changepoint_prior_scale`, or
  retrain with a new `unique_suffix`.

**`model_unavailable`**

- A saved model file cannot be read, or the plugin directory cannot be found: set `PLUGIN_DIR`.
  Delete the file named in `prophet_models/` or change `unique_suffix`.

**`internal: forecast failed: Changepoints must fall within training data`**

- Every date in `changepoints` must lie within each series' training history.

**`bad_request: invalid holidays: ...`**

- `holiday_names` holds a name Prophet reserves, such as `trend`, or `holiday_country_names` a country it does not know.

**`bad_request: rows of the series ... come from several tag sets writing at the same time`**

- Without `sampling_interval`, rows of several tag sets of one series would interleave.
  Add the tags the message names to `group_by`, pin them with `tag_filter`, or set `sampling_interval` to forecast their
  mean per bucket.

**`bad_request: ... more forecasts than max_series`**

- `group_by` or a query produced more series × fields than `max_series`.
  Set `series_limit` to forecast the first ones, narrow the request with `tag_filter` or `sql_filter`, or raise
  `max_series`.

**`bad_request: ... more than max_forecast_points`**

- The horizon in points, with the validation window, is longer than `max_forecast_points`; `horizon_duration` is
  converted by the data spacing, so a fine spacing makes many points.
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

- Alias the query's timestamp `AS time`, for example `date_bin(INTERVAL '1 hour', time) AS time`.

**`internal: forecast computed but its rows cannot be built`**

- The engine's `LineBuilder` refuses some names, such as a measurement, tag or column name with a space.
  Rename it in the query with an alias, or forecast without writing.

**A scheduled trigger fails at the first comma**

- `--trigger-arguments` splits at every comma, so a `query` or `sql_filter` with one is cut or refused; set it in the
  TOML file.

**Slow forecasts**

- Training time grows with the points of a series: bound them with `point_limit` or `sampling_interval`.
- Each series trains on its own, so a request takes about as long as its series together; narrow it with `series_limit`,
  or reuse saved models with `model_mode: predict`.
- `backtest_points` trains each series a second time.


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
