<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The ADTK Anomaly Detector Plugin provides advanced time series anomaly detection for {{% product-name %}} using the ADTK (Anomaly Detection Toolkit) library. Apply statistical and machine learning-based detection methods to identify outliers, level shifts, volatility changes, and seasonal anomalies in your data. Features consensus-based detection requiring multiple detectors to agree before triggering alerts, reducing false positives.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter         | Type   | Default  | Description                                                                                 |
|-------------------|--------|----------|---------------------------------------------------------------------------------------------|
| `measurement`     | string | required | Measurement to analyze for anomalies                                                        |
| `field`           | string | required | Numeric field to evaluate                                                                   |
| `detectors`       | string | required | Dot-separated list of advanced ADTK detectors for different anomaly types                   |
| `detector_params` | string | required | Base64-encoded JSON parameters for each detector                                            |
| `window`          | string | required | Data analysis window. Format: `<number><unit>` (for example, "1h", "30min"). Must be positive      |
| `senders`         | string | required | Dot-separated notification channels with multi-channel notification support                 |

Duration units: `us`, `ms`, `s`, `min`, `h`, `d`, `w`.

### Advanced parameters

| Parameter                   | Type    | Default  | Description                                                                                                |
|-----------------------------|---------|----------|------------------------------------------------------------------------------------------------------------|
| `min_consensus`             | number  | 1        | Minimum detectors required to agree for consensus-based filtering to reduce false positives (1 or greater) |
| `min_condition_duration`    | string  | "0s"     | Minimum duration for configurable anomaly persistence before alerting                                      |
| `group_by_tags`             | bool    | false    | Analyze every tag combination as its own time series                                                       |
| `max_notifications_per_run` | number  | 20       | Maximum number of notifications a single run may send                                                      |

#### Analyzing tagged measurements

By default the whole window forms a single time series. When a measurement holds several tag combinations (for example `host=server1` and `host=server2`), those rows share timestamps, and ADTK keeps only the first value of each timestamp — so one arbitrary series is analyzed and the rest of the data is ignored.

Set `group_by_tags=true` to analyze each tag combination separately. Every series then gets its own detector run, its own consensus evaluation, and its own debounce state, so a measurement with N tag combinations can produce up to N notifications per run.

#### Notification behavior

The timestamp of the last alerted point is remembered per series, so a `window` longer than the trigger interval does not resend anomalies that earlier runs already reported.

A single run sends at most `max_notifications_per_run` notifications. Anomalies beyond the limit are counted in a warning and are not resent by later runs — raise the limit if a run legitimately produces more alerts.

Points that have no value for `field` are dropped before detection and reported in the log; without this a single NULL makes every detector fail.

### Notification parameters

| Parameter              | Type   | Default  | Description                                                              |
|------------------------|--------|----------|--------------------------------------------------------------------------|
| `influxdb3_auth_token` | string | env var  | {{% product-name %}} API token                                                     |
| `notification_text`    | string | template | Customizable notification template message with dynamic variables        |
| `notification_path`    | string | "notify" | Notification endpoint path                                               |
| `port_override`        | number | 8181     | InfluxDB port override                                                   |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}.

When a config file is given, it replaces the inline trigger arguments entirely. In TOML, `detectors` and `senders` accept either a list (`["QuantileAD", "PersistAD"]`) or a dot-separated string, and detector parameters may be given as a `[detector_params]` table or as a base64-encoded JSON string.

#### Example TOML configuration

[adtk_anomaly_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/stateless_adtk_detector/adtk_anomaly_config_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

### Supported ADTK detectors

| Detector               | Description                           | Required Parameters      |
|------------------------|---------------------------------------|--------------------------|
| `GeneralizedESDTestAD` | Extreme Studentized Deviate test      | `alpha` (optional)       |
| `InterQuartileRangeAD` | Detects outliers using IQR method     | None                     |
| `ThresholdAD`          | Detects values above/below thresholds | `high`, `low` (optional) |
| `QuantileAD`           | Detects outliers based on quantiles   | `low`, `high` (optional) |
| `LevelShiftAD`         | Detects sudden level changes          | `window` (int)           |
| `VolatilityShiftAD`    | Detects volatility changes            | `window` (int)           |
| `PersistAD`            | Detects persistent anomalous values   | None                     |
| `SeasonalAD`           | Detects seasonal pattern deviations   | None                     |

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python 3.11+**
- **Python packages**:
  - `influxdata-plugin-utils>=0.3.0` (for configuration loading, parsing, and schema introspection)
  - `adtk` (for anomaly detection)
  - `pandas<3` (for data manipulation)
  - `requests` (for HTTP notifications)

`pandas` must stay below 3.0. Window-based detectors (`LevelShiftAD`, `VolatilityShiftAD`, `PersistAD`)
return `NaN` for the first `window` points, which pandas 3 refuses to store in a boolean result. With
pandas 3 installed those three detectors fail with `Invalid value 'nan' for dtype 'bool'`, are skipped
with a warning, and stop contributing to the consensus.
- **Notification Sender Plugin** *(optional)*: Required if using the `senders` parameter. See the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/).

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
   influxdb3 install package "influxdata-plugin-utils>=0.3.0"
   influxdb3 install package requests
   influxdb3 install package adtk
   influxdb3 install package "pandas<3"
   ```
3. *(Optional)* For notifications, install the [influxdata/notifier plugin](/influxdb3/version/plugins/library/official/notifier/) and create an HTTP trigger for it.

## Trigger setup

### Scheduled trigger

Create a scheduled trigger for anomaly detection:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/stateless_adtk_detector/adtk_anomaly_detection_plugin.py" \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=cpu,field=usage,detectors=QuantileAD.LevelShiftAD,detector_params=eyJRdWFudGlsZUFKIjogeyJsb3ciOiAwLjA1LCAiaGlnaCI6IDAuOTV9LCAiTGV2ZWxTaGlmdEFKIjogeyJ3aW5kb3ciOiA1fX0=,window=10min,senders=slack,slack_webhook_url=$SLACK_WEBHOOK_URL" \
  anomaly_detector
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

### Enable trigger

```bash
influxdb3 enable trigger --database mydb anomaly_detector
```
## Example usage

### Example 1: Quantile-based detection

Detect outliers using quantile-based detection. This plugin analyzes existing time series data and sends notifications when anomalies are detected.

```bash
# Base64 encode detector parameters: {"QuantileAD": {"low": 0.05, "high": 0.95}}
echo '{"QuantileAD": {"low": 0.05, "high": 0.95}}' | base64

influxdb3 create trigger \
  --database sensors \
  --path "gh:influxdata/stateless_adtk_detector/adtk_anomaly_detection_plugin.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "measurement=temperature,field=value,detectors=QuantileAD,detector_params=eyJRdWFudGlsZUFKIjogeyJsb3ciOiAwLjA1LCAiaGlnaCI6IDAuOTV9fQ==,window=1h,senders=slack,slack_webhook_url=$SLACK_WEBHOOK_URL" \
  temp_anomaly_detector
```
Set `SLACK_WEBHOOK_URL` to your Slack incoming webhook URL.

### Example 2: Multi-detector consensus

Use multiple detectors with consensus requirement:

```bash
# Base64 encode: {"QuantileAD": {"low": 0.1, "high": 0.9}, "LevelShiftAD": {"window": 10}}
echo '{"QuantileAD": {"low": 0.1, "high": 0.9}, "LevelShiftAD": {"window": 10}}' | base64

influxdb3 create trigger \
  --database monitoring \
  --path "gh:influxdata/stateless_adtk_detector/adtk_anomaly_detection_plugin.py" \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=cpu_metrics,field=utilization,detectors=QuantileAD.LevelShiftAD,detector_params=eyJRdWFudGlsZUFEIjogeyJsb3ciOiAwLjEsICJoaWdoIjogMC45fSwgIkxldmVsU2hpZnRBRCI6IHsid2luZG93IjogMTB9fQ==,min_consensus=2,window=30min,senders=discord,discord_webhook_url=$DISCORD_WEBHOOK_URL" \
  cpu_consensus_detector
```
Set `DISCORD_WEBHOOK_URL` to your Discord incoming webhook URL.

### Volatility shift detection

Monitor for sudden changes in data volatility:

```bash
# Base64 encode: {"VolatilityShiftAD": {"window": 20}}
echo '{"VolatilityShiftAD": {"window": 20}}' | base64

influxdb3 create trigger \
  --database trading \
  --path "gh:influxdata/stateless_adtk_detector/adtk_anomaly_detection_plugin.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments "measurement=stock_prices,field=price,detectors=VolatilityShiftAD,detector_params=eyJWb2xhdGlsaXR5U2hpZnRBRCI6IHsid2luZG93IjogMjB9fQ==,window=1h,min_condition_duration=5min,senders=sms,twilio_from_number=+1234567890,twilio_to_number=+0987654321" \
  volatility_detector
```

## Code overview

### Files

- `adtk_anomaly_detection_plugin.py`: The main plugin code containing the scheduled handler for anomaly detection
- `adtk_anomaly_config_scheduler.toml`: Example TOML configuration file
- `test_adtk_anomaly_detection.py`: Pytest suite (49 tests, runs without a live {{% product-name %}} server)
- `requirements.txt`: Runtime dependencies (`influxdata-plugin-utils>=0.3.0`, `requests`, `adtk`, `pandas<3`)
- `requirements-dev.txt`: Development dependencies (`pytest`)

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'anomaly_detector'"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled anomaly detection tasks. Queries data within the specified window, applies ADTK detectors, and sends notifications for detected anomalies.

Key operations:

1. Parses configuration and decodes detector parameters
2. Queries data from source measurement
3. Applies configured ADTK detectors
4. Evaluates consensus across detectors
5. Sends notifications when anomalies are confirmed

#### `parse_detectors(influxdb3_local, config, task_id)`

Resolves the detectors to apply together with their parameters. Detectors that are unknown, have no entry in `detector_params`, or miss a parameter required to construct them are skipped with a warning and do not count toward `min_consensus`.

#### `split_by_tags(df, tags, group_by_tags)`

Splits query results into one frame per tag combination when `group_by_tags` is enabled, so detectors never mix values written under different tag sets.

## Troubleshooting

### Common issues

#### Issue: Detector parameter encoding errors

**Solution**: Ensure detector_params is valid Base64-encoded JSON. Use command line Base64 encoding: `echo '{"QuantileAD": {"low": 0.05}}' | base64`. Verify JSON structure matches detector requirements.

#### Issue: False positive notifications

**Solution**: Increase `min_consensus` to require more detectors to agree. Add `min_condition_duration` to require anomalies to persist. Adjust detector-specific thresholds in `detector_params`.

#### Issue: A newly created measurement is reported as not found

**Solution**: Table and tag names are cached for one hour per trigger. Wait for the cache to expire, or recreate the trigger to clear it.

#### Issue: Anomalies of some tag combinations are never detected

**Solution**: Set `group_by_tags=true`. Without it, rows of different tag combinations share timestamps and only the first series survives.

#### Issue: A detector is skipped with a warning

**Solution**: The warning names the reason: the detector is not in the supported list (check the spelling), has no entry in `detector_params`, or misses a required parameter (`window` for `LevelShiftAD` and `VolatilityShiftAD`). `Invalid value 'nan' for dtype 'bool'` means pandas 3 is installed — downgrade to `pandas<3`.

#### Issue: No anomalies are ever reported

**Solution**: Check the warnings. `min_consensus` must not exceed the number of detectors that were actually applied — skipped detectors reduce that count. `min_condition_duration` must be shorter than `window`, otherwise no anomaly can persist long enough within a single query window.

#### Issue: Missing dependencies

**Solution**: Install required packages: `influxdata-plugin-utils`, `adtk`, `pandas`, `requests`. Ensure the Notifier Plugin is installed for notifications.

#### Issue: Data quality issues

**Solution**: Verify sufficient data points in the specified window. Check for null values or data gaps that affect detection. Ensure field contains numeric data suitable for analysis.

### Base64 parameter encoding

Generate properly encoded detector parameters:

```bash
# Single detector
echo '{"QuantileAD": {"low": 0.05, "high": 0.95}}' | base64 -w 0

# Multiple detectors
echo '{"QuantileAD": {"low": 0.1, "high": 0.9}, "LevelShiftAD": {"window": 15}}' | base64 -w 0

# Threshold detector
echo '{"ThresholdAD": {"high": 100, "low": 10}}' | base64 -w 0
```
### Message template variables

Available variables for notification templates:

- `$table`: Measurement name
- `$field`: Field name with anomaly
- `$value`: Anomalous value
- `$detectors`: List of detecting methods
- `$tags`: Tag values
- `$timestamp`: Anomaly timestamp

### Detector configuration reference

For detailed detector parameters and options, see the [ADTK documentation](https://adtk.readthedocs.io/en/stable/api/detectors.html).

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
