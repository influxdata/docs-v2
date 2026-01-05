# Generated Content - Do Not Edit Directly

The plugin documentation files in this directory are **generated from source READMEs** in the [influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins) repository.

## Workflow

1. **Source of truth**: `influxdb3_plugins/influxdata/<plugin>/README.md`
2. **Sync script**: `yarn sync-plugins` transforms and ports content to this directory
3. **Transformations**: The sync applies shortcodes, formatting, and docs-specific sections

## To Make Changes

1. Edit the source README in `influxdb3_plugins/influxdata/<plugin>/README.md`
2. Run `yarn sync-plugins` from the docs-v2 root to port changes
3. Commit changes in both repositories

## Documentation

See [helper-scripts/influxdb3-plugins/README.md](/helper-scripts/influxdb3-plugins/README.md) for the complete sync workflow documentation.

## Files in This Directory

| File | Source |
|------|--------|
| `basic-transformation.md` | `influxdb3_plugins/influxdata/basic_transformation/README.md` |
| `downsampler.md` | `influxdb3_plugins/influxdata/downsampler/README.md` |
| `forecast-error-evaluator.md` | `influxdb3_plugins/influxdata/forecast_error_evaluator/README.md` |
| `influxdb-to-iceberg.md` | `influxdb3_plugins/influxdata/influxdb_to_iceberg/README.md` |
| `mad-check.md` | `influxdb3_plugins/influxdata/mad_check/README.md` |
| `notifier.md` | `influxdb3_plugins/influxdata/notifier/README.md` |
| `prophet-forecasting.md` | `influxdb3_plugins/influxdata/prophet_forecasting/README.md` |
| `state-change.md` | `influxdb3_plugins/influxdata/state_change/README.md` |
| `stateless-adtk-detector.md` | `influxdb3_plugins/influxdata/stateless_adtk_detector/README.md` |
| `system-metrics.md` | `influxdb3_plugins/influxdata/system_metrics/README.md` |
| `threshold-deadman-checks.md` | `influxdb3_plugins/influxdata/threshold_deadman_checks/README.md` |
