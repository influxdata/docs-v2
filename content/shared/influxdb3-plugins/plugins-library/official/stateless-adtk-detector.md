The ADTK Anomaly Detector Plugin provides advanced time series anomaly detection for {{% product-name %}} using the ADTK (Anomaly Detection Toolkit) library. Apply statistical and machine learning-based detection methods to identify outliers, level shifts, volatility changes, and seasonal anomalies in your data. Features consensus-based detection requiring multiple detectors to agree before triggering alerts, reducing false positives.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [{{% product-name %}} Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter         | Type   | Default  | Description                                                                                 |
|-------------------|--------|----------|---------------------------------------------------------------------------------------------|
| `measurement`     | string | required | Measurement to analyze for anomalies                                                        |
| `field`           | string | required | Numeric field to evaluate                                                                   |
| `detectors`       | string | required | Dot-separated list of advanced ADTK detectors for different anomaly types                   |
| `detector_params` | string | required | Base64-encoded JSON parameters for each detector                                            |
| `window`          | string | required | Data analysis window with flexible scheduling. Format: `<number><unit>` (for example, "1h", "30m") |
| `senders`         | string | required | Dot-separated notification channels with multi-channel notification support                 |

### Advanced parameters

| Parameter                | Type   | Default | Description                                                                                  |
|--------------------------|--------|---------|----------------------------------------------------------------------------------------------|
| `min_consensus`          | number | 1       | Minimum detectors required to agree for consensus-based filtering to reduce false positives  |
| `min_condition_duration` | string | "0s"    | Minimum duration for configurable anomaly persistence before alerting                        |

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

## Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
 	- `adtk` (for anomaly detection)
 	- `pandas` (for data manipulation)
 	- `requests` (for HTTP notifications)

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
   influxdb3 install package requests
   influxdb3 install package adtk
   influxdb3 install package pandas
   ```
### Create trigger

Create a scheduled trigger for anomaly detection:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename adtk_anomaly_detection_plugin.py \
  --trigger-spec "every:10m" \
  --trigger-arguments "measurement=cpu,field=usage,detectors=QuantileAD.LevelShiftAD,detector_params=eyJRdWFudGlsZUFKIjogeyJsb3ciOiAwLjA1LCAiaGlnaCI6IDAuOTV9LCAiTGV2ZWxTaGlmdEFKIjogeyJ3aW5kb3ciOiA1fX0=,window=10m,senders=slack,slack_webhook_url=https://hooks.slack.com/services/..." \
  anomaly_detector
```
### Enable trigger

```bash
influxdb3 enable trigger --database mydb anomaly_detector
```
## Examples

### Basic anomaly detection

Detect outliers using quantile-based detection:

```bash
# Base64 encode detector parameters: {"QuantileAD": {"low": 0.05, "high": 0.95}}
echo '{"QuantileAD": {"low": 0.05, "high": 0.95}}' | base64

influxdb3 create trigger \
  --database sensors \
  --plugin-filename adtk_anomaly_detection_plugin.py \
  --trigger-spec "every:5m" \
  --trigger-arguments "measurement=temperature,field=value,detectors=QuantileAD,detector_params=eyJRdWFudGlsZUFKIjogeyJsb3ciOiAwLjA1LCAiaGlnaCI6IDAuOTV9fQ==,window=1h,senders=slack,slack_webhook_url=https://hooks.slack.com/services/..." \
  temp_anomaly_detector
```
### Multi-detector consensus

Use multiple detectors with consensus requirement:

```bash
# Base64 encode: {"QuantileAD": {"low": 0.1, "high": 0.9}, "LevelShiftAD": {"window": 10}}
echo '{"QuantileAD": {"low": 0.1, "high": 0.9}, "LevelShiftAD": {"window": 10}}' | base64

influxdb3 create trigger \
  --database monitoring \
  --plugin-filename adtk_anomaly_detection_plugin.py \
  --trigger-spec "every:15m" \
  --trigger-arguments "measurement=cpu_metrics,field=utilization,detectors=QuantileAD.LevelShiftAD,detector_params=eyJRdWFudGlsZUFEIjogeyJsb3ciOiAwLjEsICJoaWdoIjogMC45fSwgIkxldmVsU2hpZnRBRCI6IHsid2luZG93IjogMTB9fQ==,min_consensus=2,window=30m,senders=discord,discord_webhook_url=https://discord.com/api/webhooks/..." \
  cpu_consensus_detector
```
### Volatility shift detection

Monitor for sudden changes in data volatility:

```bash
# Base64 encode: {"VolatilityShiftAD": {"window": 20}}
echo '{"VolatilityShiftAD": {"window": 20}}' | base64

influxdb3 create trigger \
  --database trading \
  --plugin-filename adtk_anomaly_detection_plugin.py \
  --trigger-spec "every:1m" \
  --trigger-arguments "measurement=stock_prices,field=price,detectors=VolatilityShiftAD,detector_params=eyJWb2xhdGlsaXR5U2hpZnRBRCI6IHsid2luZG93IjogMjB9fQ==,window=1h,min_condition_duration=5m,senders=sms,twilio_from_number=+1234567890,twilio_to_number=+0987654321" \
  volatility_detector
```

## Troubleshooting

### Common issues

**Detector parameter encoding**

- Ensure detector_params is valid Base64-encoded JSON
- Use command line Base64 encoding: `echo '{"QuantileAD": {"low": 0.05}}' | base64`
- Verify JSON structure matches detector requirements

**False positive notifications**

- Increase `min_consensus` to require more detectors to agree
- Add `min_condition_duration` to require anomalies to persist
- Adjust detector-specific thresholds in `detector_params`

**Missing dependencies**

- Install required packages: `adtk`, `pandas`, `requests`
- Ensure the Notifier Plugin is installed for notifications

**Data quality issues**

- Verify sufficient data points in the specified window
- Check for null values or data gaps that affect detection
- Ensure field contains numeric data suitable for analysis

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