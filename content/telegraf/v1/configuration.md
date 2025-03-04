---
title: Configuration options
description: >
  Overview of the Telegraf configuration file, enabling plugins, and setting
  environment variables.
aliases:
  - /telegraf/v1/administration/configuration/
menu:
  telegraf_v1_ref:
    name: Configuration options
    weight: 40
---

Telegraf uses a configuration file to define what plugins to enable and what
settings to use when Telegraf starts.
Each Telegraf plugin has its own set of configuration options.
Telegraf also provides global options for configuring specific Telegraf settings.

{{% note %}}
See [Get started](/telegraf/v1/get_started/) to quickly get up and running with Telegraf.
{{% /note %}}

## Generate a configuration file

The `telegraf config` command lets you generate a configuration file using Telegraf's list of plugins.

- [Create a configuration with default input and output plugins](#create-a-configuration-with-default-input-and-output-plugins)
- [Create a configuration with specific input and output plugins](#create-a-configuration-with-specific-input-and-output-plugins)

### Create a configuration with default input and output plugins

To generate a configuration file with default input and output plugins enabled,
enter the following command in your terminal:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux and macOS](#)
[Windows](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
telegraf config > telegraf.conf
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
.\telegraf.exe config > telegraf.conf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The generated file contains settings for all available plugins--some are enabled and the rest are commented out.

### Create a configuration file with specific input and output plugins

To generate a configuration file that contains settings for only specific plugins,
use the `--input-filter` and `--output-filter` options to
specify [input plugins](/telegraf/v1/configure_plugins/input_plugins/)
and [output plugins](/telegraf/v1/plugins/#output-plugins).
Use a colon (`:`) to separate plugin names.

#### Syntax

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux and macOS](#)
[Windows](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
telegraf \
--input-filter <INPUT_PLUGIN_NAME>[:<INPUT_PLUGIN_NAME>] \
--output-filter <OUTPUT_PLUGIN_NAME>[:<OUTPUT_PLUGIN_NAME>] \
config > telegraf.conf
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
.\telegraf.exe `
--input-filter <INPUT_PLUGIN_NAME>[:<INPUT_PLUGIN_NAME>] `
--output-filter <OUTPUT_PLUGIN_NAME>[:<OUTPUT_PLUGIN_NAME>] `
config > telegraf.conf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Example

The following example shows how to include configuration sections for the
[`inputs.cpu`](/telegraf/v1/plugins/#input-cpu),
[`inputs.http_listener_v2`](/telegraf/v1/plugins/#input-http_listener_v2),
[`outputs.influxdb_v2`](/telegraf/v1/plugins/#output-influxdb_v2), and
[`outputs.file`](/telegraf/v1/plugins/#output-file) plugins:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux and macOS](#)
[Windows](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
telegraf \
--input-filter cpu:http_listener_v2 \
--output-filter influxdb_v2:file \
config > telegraf.conf
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
.\telegraf.exe `
--input-filter cpu:http_listener_v2 `
--output-filter influxdb_v2:file `
config > telegraf.conf
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1/administration/configuration/).

## Configuration file locations

When starting Telegraf, use the `--config` flag to specify the configuration file location:

- Filename and path, for example: `--config /etc/default/telegraf`
- Remote URL endpoint, for example: `--config "http://remote-URL-endpoint"`

Use the `--config-directory` flag to include files ending with `.conf` in the
specified directory in the Telegraf configuration.

On most systems, the default locations are `/etc/telegraf/telegraf.conf` for
the main configuration file and `/etc/telegraf/telegraf.d` (on Windows, `C:\"Program Files"\Telegraf\telegraf.d`) for the directory of
configuration files.

Telegraf processes each configuration file separately, and
the effective configuration is the union of all the files.
If any file isn't a valid configuration, Telegraf returns an error.

{{% warn %}}

#### Telegraf doesn't support partial configurations

Telegraf doesn't concatenate configuration files before processing them.
Each configuration file that you provide must be a valid configuration.

If you want to use separate files to manage a configuration, you can use your
own custom code to concatenate and pre-process the files, and then provide the
complete configuration to Telegraf--for example:

1. Configure plugin sections and assign partial configs a file extension different
   from `.conf` to prevent Telegraf loading them--for example:

   ```toml
   # main.opcua: Main configuration file 
   ...
   [[inputs.opcua_listener]]
     name = "PluginSection"
     endpoint = "opc.tcp://10.0.0.53:4840"
   ...
   ```

   ```toml
   # group_1.opcua
     [[inputs.opcua_listener.group]]
     name = "SubSection1"
   ...
   ```

   ```toml
   # group_2.opcua
     [[inputs.opcua_listener.group]]
     name = "SubSection2"
   ... 
   ```

2. Before you start Telegraf, run your custom script to concatenate `main.opcua`, `group_1.opcua`,
   `group_2.opcua` into a valid `telegraf.conf`.
3. Start Telegraf with the complete, valid `telegraf.conf` configuration. 

{{% /warn %}}

## Set environment variables

Use environment variables anywhere in the configuration file by enclosing them in `${}`.
For strings, variables must be in quotes (for example, `"test_${STR_VAR}"`).
For numbers and Booleans, variables must be unquoted (for example, `${INT_VAR}`, `${BOOL_VAR}`).

You can also set environment variables using the Linux `export` command: `export password=mypassword`

> **Note:** Use a secret store or environment variables to store sensitive credentials.

### Example: Telegraf environment variables

Set environment variables in the Telegraf environment variables file (`/etc/default/telegraf`)--for example:

<!--pytest.mark.skip-->

```sh
USER="alice"
INFLUX_URL="http://localhost:8086"
INFLUX_SKIP_DATABASE_CREATION="true"
INFLUX_PASSWORD="monkey123"
```

In the Telegraf configuration file (`/etc/telegraf.conf`), reference the variables--for example:

```toml
[global_tags]
  user = "${USER}"

[[inputs.mem]]

[[outputs.influxdb]]
  urls = ["${INFLUX_URL}"]
  skip_database_creation = ${INFLUX_SKIP_DATABASE_CREATION}
  password = "${INFLUX_PASSWORD}"
```

When Telegraf runs, the effective configuration is the following:

```toml
[global_tags]
  user = "alice"

[[outputs.influxdb]]
  urls = "http://localhost:8086"
  skip_database_creation = true
  password = "monkey123"
```

## Global tags

Global tags can be specified in the `[global_tags]` section of the configuration file
in `key="value"` format.
Telegraf applies the global tags to all metrics gathered on this host.

## Agent configuration

The `[agent]` section contains the following configuration options:

- **interval**: Default data collection interval for all inputs
- **round_interval**: Rounds collection interval to `interval`.
  For example, if `interval` is set to `10s`, then the agent collects on :00, :10, :20, etc.
- **metric_batch_size**: Sends metrics to the output in batches of at
  most `metric_batch_size` metrics.
- **metric_buffer_limit**: Caches `metric_buffer_limit` metrics
  for each output, and flushes this buffer on a successful write.
  This should be a multiple of `metric_batch_size` and could not be less
  than 2 times `metric_batch_size`.
- **collection_jitter**: Used to jitter the collection by a random amount.
  Each plugin sleeps for a random time within jitter before collecting.
  This can be used to avoid many plugins querying things like **sysfs** at the
  same time, which can have a measurable effect on the system.
- **flush_interval**: Default data flushing interval for all outputs.
  Don't set this below `interval`.
  Maximum `flush_interval` is `flush_interval` + `flush_jitter`
- **flush_jitter**: Jitter the flush interval by a random amount.
  This is primarily to avoid
  large write spikes for users running a large number of Telegraf instances.
  For example, a `flush_jitter` of `5s` and `flush_interval` of `10s` means
  flushes happen every 10-15s.
- **precision**: Collected metrics are rounded to the precision specified as an
  `interval` (integer + unit, ex: `1ns`, `1us`, `1ms`, and `1s` . Precision isn't
  used for service inputs, such as `logparser` and `statsd`.
- **debug**: Run Telegraf in debug mode.
- **quiet**: Run Telegraf in quiet mode (error messages only).
- **logtarget**: Controls the destination for logs and can be set to `"file"`,
  `"stderr"`, or, on Windows, `"eventlog"`.
  When set to `"file"`, the output file is determined by the logfile setting.
- **logfile**: If logtarget is set to `“file”`, specify the logfile name.
  If set to an empty string, then logs are written to stderr.
- **logfile_rotation_interval**: Rotates the logfile after the time interval specified.
  When set to `0`, no time-based rotation is performed.
- **logfile_rotation_max_size**: Rotates logfile when it becomes larger than the
  specified size.
  When set to `0`, no size-based rotation is performed.
- **logfile_rotation_max_archives**: Maximum number of rotated archives to keep,
  any older logs are deleted.
  If set to `-1`, no archives are removed.
- **log_with_timezone**: Set a timezone to use when logging--for example, `"America/Chicago"`.
  To use local time, set to `"local"`.
  See [timezone options and formats](https://socketloop.com/tutorials/golang-display-list-of-timezones-with-gmt).
- **hostname**: Override default hostname, if empty use `os.Hostname()`.
- **omit_hostname**: If true, do not set the `host` tag in the Telegraf agent.
- **skip_processors_after_aggregators**: If true, processors do not run again
  after aggregators. Default is false.

## Input configuration

The following config parameters are available for all inputs:

- **alias**: Name an instance of a plugin.
- **interval**: How often to gather this metric. Normal plugins use a single
  global interval, but if one particular input should be run less or more often,
  you can configure that here. `interval` can be increased to reduce data-in rate limits.
- **precision**: Overrides the `precision` setting of the agent. Collected
  metrics are rounded to the precision specified as an `interval`. When this value is
  set on a service input (ex: `statsd`), multiple events occurring at the same
  timestamp may be merged by the output database.
- **collection_jitter**: Overrides the `collection_jitter` setting of the agent.  
  Collection jitter is used to jitter the collection by a random `interval`
- **name_override**: Override the base name of the measurement.
  (Default is the name of the input).
- **name_prefix**: Specifies a prefix to attach to the measurement name.
- **name_suffix**: Specifies a suffix to attach to the measurement name.
- **tags**: A map of tags to apply to a specific input's measurements.

## Output configuration

- **alias**: Name an instance of a plugin.
- **flush_interval**: Maximum time between flushes. Use this setting to
  override the agent `flush_interval` on a per plugin basis.
- **flush_jitter**: Amount of time to jitter the flush interval. Use this
  setting to override the agent `flush_jitter` on a per plugin basis.
- **metric_batch_size**: Maximum number of metrics to send at once. Use
  this setting to override the agent `metric_batch_size` on a per plugin basis.
- **metric_buffer_limit**: Maximum number of unsent metrics to buffer.
  Use this setting to override the agent `metric_buffer_limit` on a per plugin basis.
- **name_override**: Override the base name of the measurement.
  (Default is the name of the output).
- **name_prefix**: Specifies a prefix to attach to the measurement name.
- **name_suffix**: Specifies a suffix to attach to the measurement name.

## Aggregator configuration

The following config parameters are available for all aggregators:

- **alias**: Name an instance of a plugin.
- **period**: The period on which to flush & clear each aggregator. All metrics
  that are sent with timestamps outside of this period are ignored by the
  aggregator.
- **delay**: The delay before each aggregator is flushed. This is to control
  how long for aggregators to wait before receiving metrics from input plugins,
  in the case that aggregators are flushing and inputs are gathering on the
  same interval.
- **grace**: The duration the metrics are aggregated by the plugin
  even though they're outside the aggregation period.
  This setting is needed when the agent is expected to receive late metrics and can
  be rolled into the next aggregation period.
- **drop_original**: If true, the original metric is dropped by the
  aggregator and not sent to the output plugins.
- **name_override**: Override the base name of the measurement.
  (Default is the name of the input).
- **name_prefix**: Specifies a prefix to attach to the measurement name.
- **name_suffix**: Specifies a suffix to attach to the measurement name.
- **tags**: A map of tags to apply to a specific input's measurements.

For a demonstration of how to configure SNMP, MQTT, and PostGRE SQL plugins to
get data into Telegraf, see the following video:

{{< youtube 6XJdZ_kdx14 >}}

## Processor configuration

The following config parameters are available for all processors:

- **alias**: Name an instance of a plugin.
- **order**: This is the order in which processors are executed.
  If not specified, then order is random.

The [metric filtering](#metric-filtering) parameters can be used to limit what metrics are
handled by the processor.
Excluded metrics are passed downstream to the next processor.

## Metric filtering

Filters can be configured per input, output, processor, or aggregator.

- [Filters](#filters)
- [Filtering examples](#filter-examples)

### Filters

- **namepass**: An array of glob pattern strings.
  Only emits points whose measurement name matches a pattern in this list.
- **namedrop**: The inverse of `namepass`.
  Discards points whose measurement name matches a pattern in this list.
  This test applies to points _after_ they have passed the `namepass` test.
- **fieldpass**: An array of glob pattern strings.
  Only emits fields whose field key matches a pattern in this list.
- **fielddrop**: The inverse of `fieldpass`.
  Discards fields that have a field key matching one of the patterns.
- **tagpass**: A table that maps tag keys to arrays of glob pattern strings.
  Only emits points that contain a tag key in the table and a tag value that
  matches one of the associated patterns.
- **tagdrop**: The inverse of `tagpass`.
  Discards points that contain a tag key in the table and a tag value that
  matches one of the associated patterns.
  This test applies to points _after_ they have passed the `tagpass` test.
- **taginclude**: An array of glob pattern strings.
  Only tags with a tag key matching one of the patterns are emitted.
  In contrast to `tagpass`, which emits an entire
  point if a tag passes, `taginclude` removes all non-matching tags from the
  point. This filter can be used on inputs and outputs, but is more efficient
  when used on inputs (filtering out tags is more efficient during ingestion).
- **tagexclude**:
  The inverse of `taginclude`. Tags with a tag key matching one of the patterns
  are discarded from the point.

{{% note %}}
#### Include tagpass and tagdrop at the end of your plugin definition

Due to the way TOML is parsed, `tagpass` and `tagdrop` parameters
must be defined at the _end_ of the plugin definition, otherwise subsequent
plugin configuration options are interpreted as part of the tagpass and tagdrop
tables.
{{% /note %}}

To learn more about metric filtering, watch the following video:

{{< youtube R3DnObs_OKA >}}

## Filtering examples

#### Input configuration examples

The following example configuration collects per-cpu data, drops any
fields that begin with `time_`, tags measurements with `dc="denver-1"`, and then outputs measurements at a 10 s interval to an InfluxDB database named `telegraf` at the address `192.168.59.103:8086`.

```toml
[global_tags]
  dc = "denver-1"

[agent]
  interval = "10s"

# OUTPUTS
[[outputs.influxdb]]
  url = "http://192.168.59.103:8086" # required.
  database = "telegraf" # required.
  precision = "1s"

# INPUTS
[[inputs.cpu]]
  percpu = true
  totalcpu = false
  # filter all fields beginning with 'time_'
  fielddrop = ["time_*"]
```

#### Input Config: `tagpass` and `tagdrop`

**NOTE** `tagpass` and `tagdrop` parameters must be defined at the _end_ of
the plugin definition, otherwise subsequent plugin configuration options are
interpreted as part of the tagpass and tagdrop tables.

```toml
[[inputs.cpu]]
  percpu = true
  totalcpu = false
  fielddrop = ["cpu_time"]
  # Don't collect CPU data for cpu6 & cpu7
  [inputs.cpu.tagdrop]
    cpu = [ "cpu6", "cpu7" ]

[[inputs.disk]]
  [inputs.disk.tagpass]
    # tagpass conditions are OR, not AND.
    # If the (filesystem is ext4 or xfs) OR (the path is /opt or /home)
    # then the metric passes
    fstype = [ "ext4", "xfs" ]
    # Globs can also be used on the tag values
    path = [ "/opt", "/home*" ]
```

#### Input Config: `fieldpass` and `fielddrop`

```toml
# Drop all metrics for guest & steal CPU usage
[[inputs.cpu]]
  percpu = false
  totalcpu = true
  fielddrop = ["usage_guest", "usage_steal"]

# Only store inode related metrics for disks
[[inputs.disk]]
  fieldpass = ["inodes*"]
```

#### Input Config: `namepass` and `namedrop`

```toml
# Drop all metrics about containers for kubelet
[[inputs.prometheus]]
  urls = ["http://kube-node-1:4194/metrics"]
  namedrop = ["container_*"]

# Only store rest client related metrics for kubelet
[[inputs.prometheus]]
  urls = ["http://kube-node-1:4194/metrics"]
  namepass = ["rest_client_*"]
```

#### Input Config: `taginclude` and `tagexclude`

```toml
# Only include the "cpu" tag in the measurements for the cpu plugin.
[[inputs.cpu]]
  percpu = true
  totalcpu = true
  taginclude = ["cpu"]

# Exclude the `fstype` tag from the measurements for the disk plugin.
[[inputs.disk]]
  tagexclude = ["fstype"]
```

#### Input config: `prefix`, `suffix`, and `override`

The following example emits measurements with the name `cpu_total`:

```toml
[[inputs.cpu]]
  name_suffix = "_total"
  percpu = false
  totalcpu = true
```

The following example emits measurements with the name `foobar`:

```toml
[[inputs.cpu]]
  name_override = "foobar"
  percpu = false
  totalcpu = true
```

#### Input config: tags

The following example emits measurements with two additional tags: `tag1=foo` and
`tag2=bar`.

NOTE: Order matters; the `[inputs.cpu.tags]` table must be at the _end_ of the
plugin definition.

```toml
[[inputs.cpu]]
  percpu = false
  totalcpu = true
  [inputs.cpu.tags]
    tag1 = "foo"
    tag2 = "bar"
```

#### Multiple inputs of the same type

Additional inputs (or outputs) of the same type can be specified by defining
these instances in the configuration file. To avoid measurement collisions, use
the `name_override`, `name_prefix`, or `name_suffix` configuration options:

```toml
[[inputs.cpu]]
  percpu = false
  totalcpu = true

[[inputs.cpu]]
  percpu = true
  totalcpu = false
  name_override = "percpu_usage"
  fielddrop = ["cpu_time*"]
```

#### Output configuration examples:

```toml
[[outputs.influxdb]]
  urls = [ "http://localhost:8086" ]
  database = "telegraf"
  precision = "1s"
  # Drop all measurements that start with "aerospike"
  namedrop = ["aerospike*"]

[[outputs.influxdb]]
  urls = [ "http://localhost:8086" ]
  database = "telegraf-aerospike-data"
  precision = "1s"
  # Only accept aerospike data:
  namepass = ["aerospike*"]

[[outputs.influxdb]]
  urls = [ "http://localhost:8086" ]
  database = "telegraf-cpu0-data"
  precision = "1s"
  # Only store measurements where the tag "cpu" matches the value "cpu0"
  [outputs.influxdb.tagpass]
    cpu = ["cpu0"]
```

#### Aggregator Configuration Examples:

This will collect and emit the min/max of the system load1 metric every
30s, dropping the originals.

```toml
[[inputs.system]]
  fieldpass = ["load1"] # collects system load1 metric.

[[aggregators.minmax]]
  period = "30s"        # send & clear the aggregate every 30s.
  drop_original = true  # drop the original metrics.

[[outputs.file]]
  files = ["stdout"]
```

This will collect and emit the min/max of the swap metrics every
30s, dropping the originals. The aggregator will not be applied
to the system load metrics due to the `namepass` parameter.

```toml
[[inputs.swap]]

[[inputs.system]]
  fieldpass = ["load1"] # collects system load1 metric.

[[aggregators.minmax]]
  period = "30s"        # send & clear the aggregate every 30s.
  drop_original = true  # drop the original metrics.
  namepass = ["swap"]   # only "pass" swap metrics through the aggregator.

[[outputs.file]]
  files = ["stdout"]
```

To learn more about configuring the Telegraf agent, watch the following video:

{{< youtube txUcAxMDBlQ >}}
