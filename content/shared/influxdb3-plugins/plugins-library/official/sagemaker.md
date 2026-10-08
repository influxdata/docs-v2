<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The SageMaker Inference Plugin enables periodic, real-time scoring of time-series data in {{% product-name %}} against an Amazon SageMaker endpoint. On every scheduled tick the plugin queries recent rows from a measurement, builds a request body matching the shape your SageMaker model expects, calls `InvokeEndpoint`, parses the response, and writes the predictions back into InfluxDB as a new measurement. It supports both batch and per-row inference, single- and multi-output models, custom containers, AWS built-in algorithms, TensorFlow Serving, Hugging Face / JumpStart LLMs, SageMaker Canvas tabular models, multi-model endpoints, and time-series forecasting models such as Amazon Chronos-Bolt.

Key features:
- Pulls rows from any measurement with a configurable lookback window and row limit
- Builds CSV or one of eight JSON body shapes per row or in batch
- Time-series forecasting mode (`inputs_timeseries` + `forecast_output=true`): collects N historical rows into one request and expands each array output field into N separate prediction rows
- Optional Hugging Face / LLM-style nested parameters via `extra_body`, including array values (`[v1;v2;v3]`)
- Multi-model endpoints via `target_model`
- Type-aware response extraction (JSON, JSON Lines, CSV, plain text)
- Per-row prediction extraction with [JMESPath](https://jmespath.org/) for JSON/JSONLines or column index for CSV
- Multi-output predictions (e.g. score + class label + confidence) via `output_fields`
- Optional response-driven timestamps for forecasting models
- Tag-based filtering of source data, with auto-tags identifying the SageMaker endpoint, source measurement, region, and model

## Configuration

Plugin parameters can be provided in two ways: as **trigger arguments** (inline key-value pairs) or via a **TOML configuration file**. Both approaches accept the same parameter names. The TOML approach is recommended when you have complex configs such as many `feature_order` tokens, `extra_body` entries, or multiple `tag_values` filters, because it is easier to read and maintain.

### Option 1: Trigger arguments (inline)

Pass parameters as a comma-separated list in `--trigger-arguments`. Use `|` as a separator inside list-valued parameters (`feature_order`, `output_fields`, `extra_body`, `tag_values`):

```bash
influxdb3 create trigger \
  --database mydb \
  --path "sagemaker.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments 'endpoint_name=my-endpoint,source_measurement=sensor_data,feature_order={motor_speed}|{ambient_temperature},output_fields=score=predictions[*].score' \
  sagemaker_score
```
### Option 2: TOML configuration file

Put all parameters into a `.toml` file, then pass only `config_file_path` in the trigger arguments:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "sagemaker.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments 'config_file_path=sagemaker_config.toml' \
  sagemaker_score
```
The `config_file_path` value is resolved as follows:
- **Absolute path** (e.g. `/etc/plugins/sagemaker_config.toml`) — used as-is.
- **Relative path** (e.g. `sagemaker_config.toml`) — resolved relative to the plugin directory taken from the `INFLUXDB3_PLUGIN_DIR` environment variable (set by the Processing Engine), falling back to `PLUGIN_DIR`.

When `config_file_path` is provided all other trigger arguments are ignored; all parameters must be in the file.

#### TOML format

The TOML file uses the same parameter names as trigger arguments. The key format differences are:

| Parameter         | Trigger args format                           | TOML format                                                      |
|-------------------|-----------------------------------------------|------------------------------------------------------------------|
| `feature_order`   | `{col1}\|{col2}\|0.0` (pipe-separated string) | `feature_order = ["{col1}", "{col2}", "0.0"]` (array)            |
| `output_fields`   | `score=pred[*].score\|label=pred[*].label`    | `output_fields = ["score=pred[*].score", "label=pred[*].label"]` |
| `extra_body`      | `parameters.top_p=0.9\|parameters.n=3`        | `extra_body = ["parameters.top_p=0.9", "parameters.n=3"]`        |
| `batch_inference` | `"true"` or `"false"` (string)                | `batch_inference = true` (native bool)                           |
| `limit`           | `"10"` (string)                               | `limit = 10` (integer)                                           |
| `tag_values`      | `sensor_id:A1@A2.env:prod` (encoded string)   | `[tag_values]` section (see below)                               |

Tag filters in TOML use a dedicated section where each key maps to a list of allowed values:

```toml
[tag_values]
sensor_id = ["A1", "A2"]
env       = ["prod"]
```
#### Minimal TOML example

```toml
endpoint_name      = "my-endpoint-2025-01-15"
source_measurement = "motor_data"
region             = "eu-central-1"
interval           = "5min"
limit              = 10
content_type       = "application/json"
accept             = "application/json"
json_shape         = "instances_array"
batch_inference    = true

feature_order = ["{motor_speed}", "{ambient_temperature}", "0.0"]
output_fields = ["score=predictions[*].score"]

target_measurement = "motor_predictions"

[tag_values]
sensor_id = ["A1", "A2"]
```
A complete reference with examples for all supported body shapes is provided in `sagemaker_config_example.toml`.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines the supported trigger type and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter            | Type           | Default    | Description                                                                                                                   |
|----------------------|----------------|------------|-------------------------------------------------------------------------------------------------------------------------------|
| `endpoint_name`      | string         | required   | Name of the deployed SageMaker real-time endpoint                                                                             |
| `source_measurement` | string         | required   | InfluxDB measurement (table) the plugin reads rows from                                                                       |
| `feature_order`      | string / array | required   | Tokens describing how to build each row's request body. Pipe-separated string in args; TOML array. See *feature_order syntax* |
| `output_fields`      | string / array | required   | `name=path` pairs describing how to extract predictions from the response. Pipe-separated in args; TOML array                 |

### Request format parameters

| Parameter      | Type           | Default                   | Description                                                                                                                                   |
|----------------|----------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `content_type` | string         | `application/json`        | Request body Content-Type. One of `application/json`, `text/csv`                                                                              |
| `accept`       | string         | same as `content_type`    | Expected response Content-Type. One of `application/json`, `application/jsonlines`, `text/csv`, `text/plain`                                  |
| `json_shape`   | string         | `instances_array`         | JSON body shape (only when `content_type=application/json`). See *json_shape values* below                                                    |
| `extra_body`   | string / array | none                      | `path=value` pairs merged into the JSON body (e.g. nested LLM `parameters`). Pipe-separated in args; TOML array. Only with JSON content types |

### Inference parameters

| Parameter         | Type    | Default        | Description                                                                                                                                                                                   |
|-------------------|---------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `interval`        | string  | `60min`        | Lookback window for the source query. Format: `<number><unit>` where unit is `s`, `min`, `h`, `d`, `w`, `m` (months≈30d), `q` (quarters≈91d), `y` (years=365d). Examples: `5min`, `1h`, `30d` |
| `limit`           | integer | `1`            | Maximum number of rows to read per scheduled call. String or integer accepted                                                                                                                 |
| `batch_inference` | boolean | `true`         | If `true`, send all selected rows in one request and parse a batch response. If `false`, one request per row. String `"true"`/`"false"` (args) or native bool (TOML)                          |
| `forecast_output` | boolean | `false`        | If `true`, `output_fields` paths may return arrays; each position becomes a separate output row. Scalar values are broadcast to all rows. Only supported with `accept=application/json`. Use with `json_shape=inputs_timeseries` for time-series forecasting models |
| `region`          | string  | `eu-central-1` | AWS region of the SageMaker endpoint                                                                                                                                                          |
| `target_model`    | string  | none           | Optional model identifier for **multi-model endpoints** — sets `X-Amzn-SageMaker-Target-Model` header                                                                                         |

### Output parameters

| Parameter            | Type   | Default                              | Description                                                                                                                                                                                                                                                                                     |
|----------------------|--------|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `target_measurement` | string | `<source_measurement>_predictions`   | Measurement to write predictions into                                                                                                                                                                                                                                                           |
| `target_database`    | string | trigger's database                   | Database to write predictions into                                                                                                                                                                                                                                                              |
| `timestamp_path`     | string | none                                 | Optional path to extract per-row timestamps from the response. JMESPath for JSON/JSONLines, integer column index for CSV. If empty, the plugin uses `time.time_ns()`. If set but a row's timestamp is missing or unparseable, that prediction is skipped with an error (no wall-clock fallback) |

### Filtering parameters

| Parameter    | Type           | Default  | Description                                                                                                                                                                                                                                                                                         |
|--------------|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tag_values` | string / table | none     | Tag filter applied to the source query. In args: `tag1:val1@val2.tag2:val3` — dot separates tag pairs, colon separates tag name from values, `@` separates multiple values. In TOML: `[tag_values]` section with `tag = ["v1", "v2"]`. Tags with a single value are also written to the output line |

## `feature_order` syntax

`feature_order` is a list of tokens. In trigger arguments it is pipe-separated; in TOML it is a native array. Each token is either a column reference or a literal value. Aliases (`:alias`) are mainly used in object-shape JSON bodies as JSON keys.

| Token                             | Meaning                                                                                                                                       |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `{col}`                           | Take the value of column `col` from the row. In object shapes, the JSON key equals `col`                                                      |
| `{col:alias}`                     | Take the value of column `col`. In object shapes, the JSON key equals `alias`; in array/CSV shapes the alias is ignored (one warning at init) |
| `0`, `0.0`, `-3.14`, `1e3`        | Numeric literal (int or float). In CSV the literal is written as text                                                                         |
| `true`, `false`                   | Boolean literal (in JSON bodies)                                                                                                              |
| `null`                            | JSON `null`                                                                                                                                   |
| `"text"`, `'text'`                | String literal                                                                                                                                |
| `"text":alias`, `0.0:alias`, etc. | Literal **with key alias**. Required for literals in object shapes (`instances_object`, `raw_object`); ignored elsewhere with a warning       |

To use a literal containing `:` or `|`, wrap it in quotes: `"1:30":time`.

## `output_fields` syntax

`output_fields = name=path|name=path|...` (args) or `output_fields = ["name=path", ...]` (TOML)

Each entry produces one field on the output line. The path syntax depends on `accept`:

| `accept`                  | Path syntax                                                      | Example                                                                     |
|---------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `application/json`        | JMESPath — yields an array in batch mode, scalar in per-row mode | `forecasting=predictions[*].score` (batch) or `forecasting=score` (per-row) |
| `application/jsonlines`   | JMESPath, applied per line                                       | `forecasting=score`                                                         |
| `text/csv`                | integer column index (0-based)                                   | `forecasting=0`                                                             |
| `text/plain`              | empty (response body becomes value); exactly one entry           | `result=`                                                                   |

In batch mode, `M` (the number of written rows) equals `min(length)` across all `output_fields` paths and `timestamp_path`. If lengths differ, the plugin truncates and logs a warning.

In **forecast mode** (`forecast_output=true`), each `output_fields` path may return an array — every array element becomes a separate output row. Paths that return a scalar are broadcast to all rows. All arrays must have equal length; if they differ, the min-length rule applies with a warning.

The Python type of each extracted value determines the InfluxDB field type:
- `int` → `int64_field`
- `float` → `float64_field`
- `bool` → `bool_field`
- `str` → `string_field`
- `list`/`dict` → row error (use a more specific JMESPath; in forecast mode, nested arrays inside a forecast array are not supported)

## `json_shape` values

| Shape                 | Body produced                                                                                  | Used by                                                                |
|-----------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| `instances_array`     | `{"instances": [[v1,v2,...], ...]}`                                                           | TF Serving REST (positional)                                           |
| `instances_object`    | `{"instances": [{"col": v, ...}, ...]}`                                                       | TF Serving REST (named columns)                                        |
| `instances_features`  | `{"instances": [{"features": [v1,v2,...]}, ...]}`                                             | Built-in AWS algorithms: KMeans, k-NN, RCF, Linear Learner, NTM, PCA  |
| `inputs`              | `{"inputs": [v1,v2,...]}` — single row                                                        | TF Serving simplified columnar (single tensor)                         |
| `inputs_array`        | `{"inputs": [[v1,v2], ...]}`                                                                  | TF Serving / PyTorch batch                                             |
| `inputs_flat`         | `{"inputs": [v1,v2,...]}` — one value per row, requires exactly one `{col}` token             | Hugging Face NLP batch (`{"inputs": ["text1", "text2"]}`)              |
| `inputs_timeseries`   | `{"inputs": [{"target": [v1,v2,...,vN]}]}` — all rows collected into one target array; requires exactly one `{col}` token | Time-series forecasting models (Amazon Chronos-Bolt, etc.) |
| `raw_array`           | `[[v1,v2,...], ...]`                                                                          | Custom containers, simplified TF Serving                               |
| `raw_object`          | `{"col": v, ...}` — single row                                                                | Hugging Face simple, custom containers (e.g. `{"inputs": "text"}`)     |

**Batch compatibility:** `inputs` and `raw_object` produce a single-row body and require either `batch_inference=false` or `limit=1`. All other shapes are batch-friendly.

**Time-series forecasting:** use `inputs_timeseries` together with `forecast_output=true`. With `limit=N`, all N rows from the source query are packed into a single `target` array and sent in one request. The response's array fields are then expanded back into N output rows — one per forecast step.

**Object shapes** (`instances_object`, `raw_object`) accept literal tokens **only with an alias** (`literal:alias`); the alias becomes the JSON key.

## `extra_body` syntax

`extra_body = path=value|path=value|...` (args) or `extra_body = ["path=value", ...]` (TOML)

Each entry adds a static value at a JSON path. Dotted paths produce nested objects; values are coerced (numbers, booleans, `null`, quoted strings). **Array values** use semicolons as element separators inside square brackets: `[v1;v2;v3]`.

```bash
# args — scalar values
extra_body = parameters.max_new_tokens=50|parameters.top_p=0.95|parameters.do_sample=true

# args — array value (semicolons, no spaces inside brackets)
extra_body = parameters.quantile_levels=[0.1;0.5;0.9]|parameters.prediction_length=10

# TOML
extra_body = [
    "parameters.max_new_tokens=50",
    "parameters.top_p=0.95",
    "parameters.do_sample=true",
    "parameters.quantile_levels=[0.1;0.5;0.9]",
]
```
→ merged into the body as:
```json
{"parameters":{"max_new_tokens":50,"top_p":0.95,"do_sample":true,"quantile_levels":[0.1,0.5,0.9]}}
```
Restrictions:
- Cannot be used with `content_type=text/csv`.
- Cannot be used with `json_shape=raw_array` (top-level list — nothing to merge into).
- Conflicts with feature_order keys at any depth fail at run time.

## Auto-tags

Every output line carries the following tags:

| Tag                            | Value                                |
|--------------------------------|--------------------------------------|
| `sagemaker_endpoint`           | `endpoint_name`                      |
| `sagemaker_source_measurement` | `source_measurement`                 |
| `sagemaker_region`             | `region`                             |
| `sagemaker_model`              | `target_model` *(only when set)*     |

Single-valued tags from `tag_values` are also written to the output line.

## Software Requirements

- **{{% product-name %}}** with the Processing Engine enabled
- **AWS credentials** available to the {{% product-name %}} host process (via environment variables, IAM role, or AWS credentials file) with permission to call `sagemaker:InvokeEndpoint`
- **Python packages**:
  - `boto3` (AWS SDK)
  - `pandas` (timestamp parsing)
  - `jmespath` is included as a transitive dependency of `boto3`/`botocore`

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled:

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package boto3
   influxdb3 install package pandas
   ```
3. Make AWS credentials available to {{% product-name %}} (one of):
   - Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, optionally `AWS_SESSION_TOKEN` in the host environment
   - Run {{% product-name %}} on an EC2 instance / EKS pod with an IAM role that allows `sagemaker:InvokeEndpoint`
   - Mount `~/.aws/credentials` and set `AWS_PROFILE`

## Trigger setup

### With trigger arguments

```bash
influxdb3 create trigger \
  --database mydb \
  --path "sagemaker.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments 'endpoint_name=my-endpoint,source_measurement=sensor_data,feature_order={motor_speed}|{ambient_temperature},output_fields=score=predictions[*].score' \
  sagemaker_score
```
### With a TOML configuration file

```bash
influxdb3 create trigger \
  --database mydb \
  --path "sagemaker.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments 'config_file_path=sagemaker_config.toml' \
  sagemaker_score
```
Place `sagemaker_config.toml` in your plugin directory — the one set via `--plugin-dir` and exposed as `INFLUXDB3_PLUGIN_DIR` (or `PLUGIN_DIR`) — or provide an absolute path. See `sagemaker_config_example.toml` for ready-to-use templates covering all supported endpoint types.

## Example usage

### Example 1: SageMaker Canvas tabular model (CSV)

Score the latest row of sensor data against a Canvas model that expects CSV input and returns a single float per row.

```bash
influxdb3 create trigger \
  --database factory \
  --path "sagemaker.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments 'endpoint_name=canvas-deployment-2026-01-10,source_measurement=press,feature_order={motor_speed}|{ambient_temperature}|{vibration},content_type=text/csv,accept=text/csv,output_fields=quality_score=0,limit=1,batch_inference=false,region=us-east-1' \
  press_quality
```
Request body sent to SageMaker:
```
1500,25.5,0.3
```
Response:
```
0.87
```
Result: a row in measurement `press_predictions` with field `quality_score=0.87` (float).

### Example 2: AWS built-in algorithm — Random Cut Forest anomaly score

RCF expects `{"instances":[{"features":[...]}]}`.

```bash
influxdb3 create trigger \
  --database iot \
  --path "sagemaker.py" \
  --trigger-spec "every:30s" \
  --trigger-arguments 'endpoint_name=rcf-anomaly,source_measurement=metrics,feature_order={cpu}|{mem}|{rps}|{p99_ms},json_shape=instances_features,output_fields=anomaly_score=scores[*].score,interval=2min,limit=20' \
  rcf_score
```
Request body for 20 rows (batch):
```json {lint="false"}
{"instances":[{"features":[42.1,71.0,1834,8.4]}, ..., {"features":[39.9,72.2,1903,9.0]}]}
```
Response:
```json {lint="false"}
{"scores":[{"score":0.83},{"score":0.71}, ..., {"score":0.92}]}
```
Each score is written as `anomaly_score` field. Use `timestamp_path` if your model returns timestamps.

### Example 3: TensorFlow Serving with renamed JSON keys

Rename InfluxDB columns to keys the model expects (`Speed`, `Temp`, `Vib`).

```bash
influxdb3 create trigger \
  --database factory \
  --path "sagemaker.py" \
  --trigger-spec "every:30s" \
  --trigger-arguments 'endpoint_name=tf-serving,source_measurement=press,feature_order={motor_speed:Speed}|{ambient_temperature:Temp}|{vibration:Vib},json_shape=instances_object,output_fields=p_fail=predictions[*].p_fail|p_ok=predictions[*].p_ok,limit=10' \
  press_failure
```
Request body:
```json {lint="false"}
{"instances":[{"Speed":1500,"Temp":25.5,"Vib":0.3}, ...]}
```
Two prediction fields per row are written: `p_fail` and `p_ok`.

### Example 4: Hugging Face LLM with parameters (TOML config)

Score a free-text sensor log against a Hugging Face text classification endpoint, with generation parameters. Using a TOML file makes the `extra_body` list easy to maintain.

`hf_classifier.toml`:
```toml
endpoint_name      = "hf-classifier"
source_measurement = "tickets"
region             = "eu-west-1"
interval           = "5min"
limit              = 1
content_type       = "application/json"
accept             = "application/json"
json_shape         = "raw_object"
batch_inference    = false

feature_order = ["{text:inputs}"]
output_fields = ["label=label", "score=score"]

extra_body = [
    "parameters.top_k=5",
    "parameters.temperature=0.3",
]

target_measurement = "ticket_classifications"
```
```bash
influxdb3 create trigger \
  --database support \
  --path "sagemaker.py" \
  --trigger-spec "every:5min" \
  --trigger-arguments 'config_file_path=hf_classifier.toml' \
  ticket_classifier
```
Request body:
```json {lint="false"}
{"inputs":"Bearing 7 reports rising temperature for 20 minutes...","parameters":{"top_k":5,"temperature":0.3}}
```
### Example 5: Forecasting with response timestamps

DeepAR-style forecast where the model returns predicted timestamps along with values. The plugin writes each prediction at its own future timestamp.

```bash
influxdb3 create trigger \
  --database forecasts \
  --path "sagemaker.py" \
  --trigger-spec "every:15min" \
  --trigger-arguments 'endpoint_name=deepar-fcast,source_measurement=demand,feature_order={value},json_shape=instances_features,output_fields=forecasting=predictions[*].mean,timestamp_path=predictions[*].t,limit=24,interval=24h,target_measurement=demand_forecasts' \
  demand_forecast
```
Each forecasted point is written with timestamp from `predictions[*].t` — autodetected as ISO string, Unix seconds, or nanoseconds.

### Example 6: Multi-model endpoint with tag filtering

Score only rows from a specific sensor against a specific model deployed on a multi-model endpoint, with the `region` tag carried through to the output.

```bash
influxdb3 create trigger \
  --database iot \
  --path "sagemaker.py" \
  --trigger-spec "every:1min" \
  --trigger-arguments 'endpoint_name=mme-models,target_model=motor-v3.tar.gz,source_measurement=sensors,feature_order={rpm}|{torque},output_fields=health=predictions[*].health,tag_values=region:eu-central-1.sensor_id:motor-7,limit=5' \
  motor_health
```
Output lines carry tags `sagemaker_endpoint=mme-models`, `sagemaker_source_measurement=sensors`, `sagemaker_region=eu-central-1` (default region), `sagemaker_model=motor-v3.tar.gz`, `region=eu-central-1`, `sensor_id=motor-7`.

### Example 7: Time-series forecasting with Amazon Chronos-Bolt (TOML config)

Collect 20 historical sensor readings and send them to a Chronos-Bolt endpoint as one time series. The model returns mean and quantile forecasts for 10 future steps — each step is written as a separate row.

`chronos.toml`:
```toml
endpoint_name      = "chronos-bolt-small-endpoint"
source_measurement = "sensor_readings"
region             = "eu-central-1"
interval           = "1h"
limit              = 20
content_type       = "application/json"
accept             = "application/json"
json_shape         = "inputs_timeseries"
batch_inference    = true
forecast_output    = true

# Single {col} token required for inputs_timeseries
feature_order = ["{value}"]

# Each path returns a 10-element array → 10 output rows
# Quantile key names start with a digit, so quote them in JMESPath
output_fields = [
    "mean=predictions[0].mean",
    "q10=predictions[0].\"0.1\"",
    "q90=predictions[0].\"0.9\"",
]

# Array values use semicolons as element separator
extra_body = [
    "parameters.prediction_length=10",
    "parameters.quantile_levels=[0.1;0.5;0.9]",
]

target_measurement = "sensor_forecasts"
```
```bash
influxdb3 create trigger \
  --database iot \
  --path "sagemaker.py" \
  --trigger-spec "every:1h" \
  --trigger-arguments 'config_file_path=chronos.toml' \
  chronos_forecast
```
Request body sent to SageMaker (20 historical values packed into `target`):
```json {lint="false"}
{"inputs": [{"target": [1.1, 2.3, 1.8, ...]}], "parameters": {"prediction_length": 10, "quantile_levels": [0.1, 0.5, 0.9]}}
```
Response:
```json {lint="false"}
{"predictions": [{"mean": [-0.0, 3.5, ...], "0.1": [-2.4, 1.5, ...], "0.9": [1.7, 5.6, ...]}]}
```
Result: 10 rows written to `sensor_forecasts`, each with fields `mean`, `q10`, `q90`.

## Code overview

### Files

- `sagemaker.py` — the main plugin file. Contains the JSON metadata header, configuration parsing, request body builders, response extractors, and the `process_scheduled_call` entry point.
- `sagemaker_config_example.toml` — annotated TOML templates for all supported endpoint types (instances_array, instances_object, CSV, LLM/HuggingFace, multi-model, Chronos-Bolt time-series forecasting).

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name' ORDER BY event_time DESC LIMIT 50"
```
Each log line includes a unique `task_id` (UUID) so messages from a single scheduled call can be correlated. Levels:
- **INFO** — initialization, source query, row count, write completion
- **WARN** — Content-Type mismatch, length mismatch in batch response, missing path values, ignored aliases
- **ERROR** — config validation failure, batch inference failure, write failure

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Entry point invoked by the Processing Engine on each tick.

1. Loads cached config or builds it from `args` (validates schema, parses `feature_order`, `output_fields`, `tag_values`, `extra_body`)
2. Builds and runs the source SQL query (with optional tag filter)
3. Either sends one batched `InvokeEndpoint` call or iterates per row, depending on `batch_inference`
4. Parses the response according to `accept` and `output_fields`
5. Builds typed `LineBuilder` per prediction row with auto-tags, single-valued filter tags, and timestamp
6. Writes all lines in one batched call to InfluxDB

#### `build_request_body(rows, tokens, content_type, json_shape, extra_body=None)`

Builds the request body as a Python object first, optionally deep-merges `extra_body`, then serialises to JSON. Returns a CSV string for `content_type=text/csv`.

#### `extract_outputs(response_body, response_ct, accept, output_fields, timestamp_compiled, ..., forecast_output)`

Returns a list of `(timestamp_or_None, {field: value})` tuples. Dispatches to one of:
- `_extract_from_json_forecast` — when `forecast_output=True`: fields may be arrays (indexed per row) or scalars (broadcast)
- `_extract_from_json` — single JSON document, JMESPath projections for batch or scalar paths for per-row
- `_extract_from_jsonlines` — one record per line
- `_extract_from_csv` — `csv.reader` per line, integer column index
- `_extract_from_plain` — single scalar from the body

If the actual response Content-Type differs from the requested `accept`, the plugin warns and tries to parse with the actual one (if supported).

## Troubleshooting

### Common issues

#### Issue: `feature_order references columns that don't exist in '<measurement>'`

**Solution:** Check the column names in `feature_order` and confirm the source measurement has data.

The plugin validates feature_order columns against `information_schema.columns` at start-up. The error message lists missing columns and all available columns — fix the typo in `feature_order` or write some data into the measurement first.

#### Issue: `Got M prediction(s) for N input row(s)`

**Solution:** Verify that the SageMaker model returns one prediction per submitted input row, or lower the batch size while debugging.

The number of predictions returned by the model differs from the number of source rows sent in the batch. The plugin writes whatever predictions came back and warns about the delta. If consistent, check whether your model auto-aggregates or rejects malformed rows.

#### Issue: `text/plain accepts exactly one output field`

**Solution:** Use a single output field with an empty path.

Plain-text responses are scalar — define one entry in `output_fields` with an empty path: `output_fields=result=`.

#### Issue: `json_shape 'inputs' is not batch-compatible`

**Solution:** Disable batch inference, limit the query to one row, or choose a batch-compatible JSON shape.

`inputs` and `raw_object` produce single-row bodies. Either set `batch_inference=false`, set `limit=1`, or switch to a batch-compatible shape (`inputs_array`, `instances_array`, etc.).

#### Issue: `extra_body conflicts with main body at '<path>'`

**Solution:** Move the static value to a different path or remove the duplicate key.

The static path you set in `extra_body` collides with a key produced by `feature_order`. Pick a different alias or remove the conflicting path.

#### Issue: `Invalid interval format`

**Solution:** Use a duration in `<number><unit>` form with a supported unit.

Interval must be `<number><unit>`. Unit must be one of `s`, `min`, `h`, `d`, `w`, `m`, `q`, `y`. Note that `m` means **months** (≈30 days), not minutes — use `min` for minutes.

#### Issue: AWS authentication errors (`UnrecognizedClientException`, `AccessDeniedException`)

**Solution:** Provide AWS credentials or an IAM role that can invoke the target SageMaker endpoint.

The {{% product-name %}} host process needs AWS credentials with permission to call `sagemaker:InvokeEndpoint` on your endpoint. Set `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`, configure an IAM role on the instance, or set `AWS_PROFILE` to a profile in `~/.aws/credentials`.

#### Issue: `Empty response body from SageMaker`

**Solution:** Check the SageMaker endpoint and model logs in CloudWatch.

The model returned an empty body. Check the model's CloudWatch logs in AWS — usually it indicates a model exception or an endpoint that is `OutOfService`.

### Debugging tips

1. **Inspect the source query** — every scheduled call logs `Source query: SELECT ...`. Run it manually:

   ```bash
   influxdb3 query --database mydb "SELECT time, motor_speed, ambient_temperature FROM sensors WHERE time > now() - INTERVAL '5 minutes' ORDER BY time DESC LIMIT 1"
   ```
2. **Test the endpoint outside the plugin** — confirm Content-Type and Accept on a known-good payload:

   ```bash
   aws sagemaker-runtime invoke-endpoint \
     --endpoint-name my-endpoint \
     --content-type application/json \
     --accept application/json \
     --body '{"instances":[[1500,25.5,0.3]]}' \
     /tmp/out.json && cat /tmp/out.json
   ```
3. **Switch to per-row mode** — set `batch_inference=false` to isolate which row fails when batch parsing is unclear.

4. **Force a config rebuild** — config is cached for 1 hour. After updating trigger arguments or the TOML file, delete and recreate the trigger or wait for the cache to expire.

### Performance considerations

- **Batch inference** is dramatically cheaper. With 60 rows at 200ms latency, batch sends one HTTP request (~250ms total); per-row sends 60 requests (~12s total). Use `batch_inference=false` only when the model truly does not support batched bodies.
- **Limit your batch size** to stay under SageMaker's 6 MB body limit. Roughly 50–500 rows per batch for tabular data is a safe range.
- **Schema cache** — measurement columns are cached for 1 hour after the first lookup.
- **Config cache** — parsed config is cached for 1 hour; the boto3 client is reused for the duration of one scheduled call.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
