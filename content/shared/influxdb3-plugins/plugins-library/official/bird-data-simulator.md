<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The Bird Tracking Simulator Plugin generates a stream of synthetic bird telemetry for demos, testing, and sample-data workflows.
On its first run, it creates a persistent flock of named birds, assigns each bird a species, natural range, starting location, heading, and healthy body temperature, then stores that flock in the Processing Engine cache.
Each scheduled call advances the flock with sinusoidal flight speed, gentle heading changes, latitude and longitude updates, and temperature jitter.

The plugin intentionally exposes only volume controls.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger.
The trigger interval plus the options below control how much data the plugin writes.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters.
This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Optional parameters

There are no required parameters.
All configuration parameters control data volume only.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bird_count` | integer | `25` | Number of persistent simulated birds to track |
| `points_per_bird` | integer | `1` | Number of movement points to emit for each bird on each scheduled call. When greater than `1`, timestamps are evenly spaced across the elapsed time since the previous call. |

### TOML configuration

This plugin does not expose TOML configuration.
Use the two inline volume options above and the trigger interval to control output volume.

## Requirements

### Data requirements

This plugin does not require incoming writes or source measurements.
It generates data directly from a scheduled trigger.
The generated flock state is stored in the Processing Engine's trigger-specific cache.
Changing `bird_count` creates a new cached flock with the requested size.

### Schema requirements

The plugin writes to the `bird_tracking` measurement.

Tags:

- `species`: common species name, such as `American Robin`
- `name`: generated name for the individual bird

Fields:

- `body_temp`: body temperature in degrees Celsius
- `longitude`: current longitude in decimal degrees
- `latitude`: current latitude in decimal degrees
- `speed`: current speed in miles per hour
- `heading`: current heading in degrees, where `0` is north and `90` is east

### Species metadata

The plugin embeds 20 United States bird species with simplified ranges, weight ranges, healthy body temperature ranges, and approximate top flight speeds directly in `bird_data_simulator.py`.

The species catalog uses [Cornell Lab All About Birds](https://www.allaboutbirds.org/guide/) species accounts and range maps as the primary reference for species presence, range, habitat, and measurements.
General healthy body temperature ranges are based on published avian veterinary reference values such as the [Merck Veterinary Manual normal temperature table](https://www.merckvetmanual.com/reference-values-and-conversion-tables/reference-guides/normal-rectal-temperature-ranges).

### Software requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**:
  - `Faker`

## Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install `Faker` into the Processing Engine Python environment:

   ```bash
   influxdb3 install package Faker
   ```
## Trigger setup

### Basic scheduled trigger

```bash
influxdb3 create trigger \
  --database sample_data \
  --path "gh:influxdata/bird_data_simulator/bird_data_simulator.py" \
  --trigger-spec "every:1s" \
  bird_tracking
```
### Larger flock

```bash
influxdb3 create trigger \
  --database sample_data \
  --path "gh:influxdata/bird_data_simulator/bird_data_simulator.py" \
  --trigger-spec "every:1s" \
  --trigger-arguments bird_count=100 \
  bird_tracking_large
```
### More points per bird

```bash
influxdb3 create trigger \
  --database sample_data \
  --path "gh:influxdata/bird_data_simulator/bird_data_simulator.py" \
  --trigger-spec "every:10s" \
  --trigger-arguments bird_count=50,points_per_bird=10 \
  bird_tracking_dense
```
## Example usage

### Generate bird telemetry

```bash
# Create a small flock that writes once per second.
influxdb3 create trigger \
  --database sample_data \
  --path "gh:influxdata/bird_data_simulator/bird_data_simulator.py" \
  --trigger-spec "every:1s" \
  --trigger-arguments bird_count=10 \
  bird_tracking_demo

# Query generated points after the trigger runs.
influxdb3 query \
  --database sample_data \
  "SELECT * FROM bird_tracking ORDER BY time DESC LIMIT 5"
```
### Expected output

```text
species          | name  | body_temp | longitude   | latitude  | speed | heading | time
-----------------|-------|-----------|-------------|-----------|-------|---------|---------------------
American Robin   | Willa | 41.822    | -83.182337  | 39.912884 | 21.4  | 83.2    | 2026-04-29T12:00:04Z
Cactus Wren      | Felix | 42.117    | -111.913552 | 33.382018 | 8.7   | 244.9   | 2026-04-29T12:00:04Z
Florida Scrub-Jay| Pearl | 41.603    | -81.224901  | 28.399102 | 12.1  | 11.6    | 2026-04-29T12:00:04Z
```

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
