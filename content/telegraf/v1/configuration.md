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

> [!Note]
> See [Get started](/telegraf/v1/get_started/) to quickly get up and running with Telegraf.

## Generate a configuration file

The `telegraf config` command lets you generate a configuration file using Telegraf's list of plugins.

- [Create a configuration with default input and output plugins](#create-a-configuration-with-default-input-and-output-plugins)
- [Create a configuration with specific input and output plugins](#create-a-configuration-with-specific-input-and-output-plugins)
- [Windows PowerShell v5 encoding](#windows-powershell-v5-encoding)

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
and [output plugins](/telegraf/v1/configure_plugins/output_plugins/).
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

### Windows PowerShell v5 encoding

In PowerShell 5, the default encoding is UTF-16LE and not UTF-8.
Telegraf expects a valid UTF-8 file.
This is not an issue with PowerShell 6 or newer, as well as the Command Prompt
or with using the Git Bash shell.

When using PowerShell 5 or earlier, specify the output encoding when generating
a full configuration file:

```powershell
telegraf.exe config | Out-File -Encoding utf8 telegraf.conf
```

This will generate a UTF-8 encoded file with a byte-order mark (BOM).
However, Telegraf correctly handles the leading BOM.

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

> [!Warning]
> #### Telegraf doesn't support partial configurations
> 
> Telegraf doesn't concatenate configuration files before processing them.
> Each configuration file that you provide must be a valid configuration.
> 
> If you want to use separate files to manage a configuration, you can use your
> own custom code to concatenate and pre-process the files, and then provide the
> complete configuration to Telegraf--for example:
> 
> 1.  Configure plugin sections and assign partial configs a file extension different
>     from `.conf` to prevent Telegraf loading them--for example:
> 
>     ```toml
>     # main.opcua: Main configuration file 
>     ...
>     [[inputs.opcua_listener]]
>       name = "PluginSection"
>       endpoint = "opc.tcp://10.0.0.53:4840"
>     ...
>     ```
> 
>     ```toml
>     # group_1.opcua
>       [[inputs.opcua_listener.group]]
>       name = "SubSection1"
>     ...
>     ```
> 
>     ```toml
>     # group_2.opcua
>       [[inputs.opcua_listener.group]]
>       name = "SubSection2"
>     ... 
>     ```
> 
> 2.  Before you start Telegraf, run your custom script to concatenate
      `main.opcua`, `group_1.opcua`,
>    `group_2.opcua` into a valid `telegraf.conf`.
> 3.  Start Telegraf with the complete, valid `telegraf.conf` configuration. 

## Set environment variables

Use environment variables anywhere in the configuration file by enclosing them in `${}`.
For strings, variables must be in quotes (for example, `"test_${STR_VAR}"`).
For numbers and booleans, variables must be unquoted (for example, `${INT_VAR}`,
`${BOOL_VAR}`).

When using double quotes, escape any backslashes (for example: `"C:\\Program Files"`) or
other special characters.
If using an environment variable with a single backslash, enclose the variable
in single quotes to signify a string literal (for example:
`'C:\Program Files'`).

Telegraf also supports Shell parameter expansion for environment variables which
allows the following:

- `${VARIABLE:-default}`: evaluates to `default` if `VARIABLE` is unset or empty
  in the environment.
- `${VARIABLE-default}`: evaluates to `default` only if `VARIABLE` is unset in
  the environment. Similarly, the following syntax allows you to specify
  mandatory variables:
- `${VARIABLE:?err}`: exits with an error message containing `err` if `VARIABLE`
  is unset or empty in the environment.
- `${VARIABLE?err}`: exits with an error message containing `err` if `VARIABLE`
  is unset in the environment.

When using the `.deb` or `.rpm` packages, you can define environment variables
in the `/etc/default/telegraf` file.

You can also set environment variables using the Linux `export` command:

<!--pytest.mark.skip-->
```bash
export password=mypassword
```

> **Note:** Use a secret store or environment variables to store sensitive credentials.

### Example: Telegraf environment variables

Set environment variables in the Telegraf environment variables file
(`/etc/default/telegraf`).

#### For InfluxDB 1.x:

<!--pytest.mark.skip-->

```sh
USER="alice"
INFLUX_URL="http://localhost:8086"
INFLUX_SKIP_DATABASE_CREATION="true"
INFLUX_PASSWORD="passw0rd123"
```

#### For InfluxDB OSS v2:

<!--pytest.mark.skip-->

```sh
INFLUX_HOST="http://localhost:8086"
INFLUX_TOKEN="replace_with_your_token"
INFLUX_ORG="your_username"
INFLUX_BUCKET="replace_with_your_bucket_name"
```

#### For InfluxDB Cloud Serverless:

<!--pytest.mark.skip-->

```sh
# For AWS West (Oregon)
INFLUX_HOST="https://us-west-2-1.aws.cloud2.influxdata.com"
# Other Cloud URLs at https://docs.influxdata.com/influxdb/cloud/reference/regions/
INFLUX_TOKEN="replace_with_your_token"
INFLUX_ORG="yourname@yourcompany.com"
INFLUX_BUCKET="replace_with_your_bucket_name"
```

In the Telegraf configuration file (`/etc/telegraf.conf`), reference the variables--for example:

```toml
[global_tags]
  user = "${USER}"

[[inputs.mem]]

# For InfluxDB 1.x:
[[outputs.influxdb]]
  urls = ["${INFLUX_URL}"]
  skip_database_creation = ${INFLUX_SKIP_DATABASE_CREATION}
  password = "${INFLUX_PASSWORD}"

# For InfluxDB OSS 2:
[[outputs.influxdb_v2]]
  urls = ["${INFLUX_HOST}"]
  token = "${INFLUX_TOKEN}"
  organization = "${INFLUX_ORG}"
  bucket = "${INFLUX_BUCKET}"

# For InfluxDB Cloud:
[[outputs.influxdb_v2]]
  urls = ["${INFLUX_HOST}"]
  token = "${INFLUX_TOKEN}"
  organization = "${INFLUX_ORG}"
  bucket = "${INFLUX_BUCKET}"
```

When Telegraf runs, the effective configuration is the following:

```toml
[global_tags]
  user = "alice"

# For InfluxDB 1.x:
[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  skip_database_creation = true
  password = "passw0rd123"

# For InfluxDB OSS 2:
[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "replace_with_your_token"
  organization = "your_username"
  bucket = "replace_with_your_bucket_name"

# For InfluxDB Cloud:
[[outputs.influxdb_v2]]
  urls = ["https://us-west-2-1.aws.cloud2.influxdata.com"]
  token = "replace_with_your_token"
  organization = "yourname@yourcompany.com"
  bucket = "replace_with_your_bucket_name"
```

## Secret stores

Telegraf also supports secret stores for providing credentials or similar.
Configure one or more secret store plugins and then reference the secret in
your plugin configurations.

Reference secrets using the following syntax:

```txt
@{<secret_store_id>:<secret_name>}
```

- `secret_store_id`: the unique ID you define for your secret store plugin.
- `secret_name`: the name of the secret to use.

> [!Note]
> Both and `secret_store_id` and `secret_name` only support alphanumeric
> characters and underscores.

### Example: Use secret stores

This example illustrates the use of secret stores in plugins:

```toml
[global_tags]
  user = "alice"

[[secretstores.os]]
  id = "local_secrets"

[[secretstores.jose]]
  id = "cloud_secrets"
  path = "/etc/telegraf/secrets"
  # Optional reference to another secret store to unlock this one.
  password = "@{local_secrets:cloud_store_passwd}"

[[inputs.http]]
  urls = ["http://server.company.org/metrics"]
  username = "@{local_secrets:company_server_http_metric_user}"
  password = "@{local_secrets:company_server_http_metric_pass}"

[[outputs.influxdb_v2]]
  urls = ["https://us-west-2-1.aws.cloud2.influxdata.com"]
  token = "@{cloud_secrets:influxdb_token}"
  organization = "yourname@yourcompany.com"
  bucket = "replace_with_your_bucket_name"
```

### Notes on secret stores

Not all plugins support secrets.
When using plugins that support secrets, Telegraf locks the memory pages
containing the secrets.
Therefore, the locked memory limit has to be set to a
suitable value.
Telegraf will check the limit and the number of used secrets at
startup and will warn if your limit is too low.
In this case, please increase
the limit via `ulimit -l`.

If you are running Telegraf in a jail you might need to allow locked pages in
that jail by setting `allow.mlock = 1;` in your config.

## Global tags

Global tags can be specified in the `[global_tags]` section of the configuration
file in `key="value"` format.
Telegraf applies the global tags to all metrics gathered on this host.

## Agent configuration

The `[agent]` section contains the following configuration options:

- **interval**: Default data collection interval for all inputs.
- **round_interval**: Rounds collection interval to `interval`.
  For example, if `interval` is set to `10s`, then the agent collects on :00, :10, :20, etc.
- **metric_batch_size**: Telegraf sends metrics to outputs in batches of at
  most `metric_batch_size` metrics.
  This controls the size of writes that Telegraf sends to output plugins.
- **metric_buffer_limit**: Maximum number of unwritten metrics per output.
  Increasing this value allows for longer periods of output downtime without
  dropping metrics at the cost of higher maximum memory usage.
  The oldest metrics are overwritten in favor of new ones when the buffer fills up.
- **collection_jitter**: Jitter the collection by a random interval.
  Each plugin sleeps for a random time within the defined jitter before collecting.
  Use this to avoid many plugins querying things like sysfs at the
  same time, which can have a measurable effect on the system.
- **collection_offset**: Shift the collection by the given interval.
  Use this to avoid many plugins querying constraint devices
  at the same time by manually scheduling them in time.
- **flush_interval**: Default flushing interval for all outputs.
  Maximum `flush_interval` is `flush_interval` + `flush_jitter`.
- **flush_jitter**: Default flush jitter for all outputs.
  This jitters the flush interval by a random amount.
  This is primarily to avoid large write spikes for users
  running a large number of Telegraf instances.
  For example, a jitter of `5s` and an interval of `10s` means flushes happen
  every 10-15 seconds.
- **precision**: Round collected metrics to the precision specified as an interval.
  Precision is _not_ used for service inputs.
  It is up to each individual service input to set the timestamp at the appropriate precision.
- **debug**: Log at debug level.
- **quiet**: Log only error level messages.
- **logformat**: Log format controls the way messages are logged and can be one
  of `text`, `structured` or, on Windows, `eventlog`.
  The output file (if any) is determined by the `logfile` setting.
- **structured_log_message_key**: Message key for structured logs, to override
  the default of `msg`.
  Ignored if `logformat` is not `structured`.
- **logfile**: Name of the file to be logged to or stderr if unset or empty.
  This setting is ignored for the `eventlog` format.
- **logfile_rotation_interval**: The logfile rotates after the time interval specified.
  When set to 0 no time based rotation is performed.
- **logfile_rotation_max_size**: The logfile rotates when it becomes larger than the specified size.
  When set to 0 no size based rotation is performed.
- **logfile_rotation_max_archives**: Maximum number of rotated archives to keep,
  any older logs are deleted.
  If set to -1, no archives are removed.
- **log_with_timezone**: Pick a timezone to use when logging or type 'local' for local time.
  Example: 'America/Chicago'.
  [See this page for options/formats.](https://socketloop.com/tutorials/golang-display-list-of-timezones-with-gmt)
- **hostname**: Override the default hostname, if empty use `os.Hostname()`.
- **omit_hostname**: If set to true, do no set the "host" tag in the Telegraf agent.
- **snmp_translator**: Method of translating SNMP objects.
  Can be "netsnmp" (deprecated) which translates by calling external programs
  `snmptranslate` and `snmptable`, or "gosmi" which translates using the built-in
  gosmi library.
- **statefile**: Name of the file to load the states of plugins from and store the states to.
  If uncommented and not empty, this file is used to save the state of stateful
  plugins on termination of Telegraf.
  If the file exists on start, the state in the file is restored for the plugins.
- **always_include_local_tags**: Ensure tags explicitly defined in a plugin _always_ pass tag-filtering
  via `taginclude` or `tagexclude`.
  This removes the need to specify local tags twice.
- **always_include_global_tags**: Ensure tags explicitly defined in the `global_tags` section will _always_ pass
  tag-filtering via `taginclude` or `tagexclude`.
  This removes the need to specify those tags twice.
- **skip_processors_after_aggregators**: By default, processors are run a second time after aggregators.
  Changing this setting to true will skip the second run of processors.
- **buffer_strategy**: The type of buffer to use for Telegraf output plugins.
  Supported modes are `memory`, the default and original buffer type, and `disk`,
  an experimental disk-backed buffer which serializes all metrics to disk as
  needed to improve data durability and reduce the chance for data loss.
  This is only supported at the agent level.
- **buffer_directory**: The directory to use when in `disk` buffer mode.
  Each output plugin makes another subdirectory in this directory with the
  output plugin's ID.

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

### Data formats

Some output plugins support the `data_format` option, which specifies a serializer
to convert metrics before writing.
Common serializers include `json`, `influx`, `prometheus`, and `csv`.

Output plugins that support serializers may also offer `use_batch_format`, which
controls whether the serializer receives metrics individually or as a batch.
Batch mode enables more efficient encoding for formats like JSON arrays.

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "json"
  use_batch_format = true
```

For available serializers and configuration options, see
[output data formats](/telegraf/v1/data_formats/output/).

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

Filters fall under two categories:

- [Selectors](#selectors)
- [Modifiers](#modifiers)

#### Selectors

Selector filters include or exclude entire metrics.
When a metric is excluded from an input or output plugin, the metric is dropped.
If a metric is excluded from a processor or aggregator plugin, it skips the
plugin and is sent onwards to the next stage of processing.

- **namepass**: An array of glob pattern strings.
  Only metrics whose measurement name matches a pattern in this list are emitted.
  Additionally, custom list of separators can be specified using `namepass_separator`.
  These separators are excluded from wildcard glob pattern matching.
- **namedrop**: The inverse of `namepass`.
  If a match is found the metric is discarded.
  This is tested on metrics after they have passed the `namepass` test.
  Additionally, custom list of separators can be specified using `namedrop_separator`.
  These separators are excluded from wildcard glob pattern matching.
- **tagpass**: A table mapping tag keys to arrays of glob pattern strings.
  Only metrics that contain a tag key in the table and a tag value matching one of its
  patterns is emitted.
  This can either use the explicit table syntax (for example: a subsection using a `[...]` header)
  or inline table syntax (e.g like a JSON table with `{...}`).
  Please see the below notes on specifying the table.
- **tagdrop**: The inverse of `tagpass`.
  If a match is found the metric is discarded.
  This is tested on metrics after they have passed the `tagpass` test.
- **metricpass**: A Common Expression Language (CEL) expression with boolean result where
  `true` will allow the metric to pass, otherwise the metric is discarded.
  This filter expression is more general compared to `namepass` and also
  supports time-based filtering.
  Further details, such as available functions and expressions, are provided in the
  CEL language definition as well as in the extension documentation or the CEL language introduction.
  
  > [!Note]
  > *As CEL is an _interpreted_ language. This type of filtering is much slower
  > than `namepass`, `namedrop`, and others.
  > Consider using the more restrictive filter options where possible in case of
  > high-throughput scenarios.

#### Modifiers

Modifier filters remove tags and fields from a metric.
If all fields are removed, the metric is removed and as a result not passed through
to the following processors or any output plugin.
Tags and fields are modified before a metric is passed to a processor,
aggregator, or output plugin.
When used with an input plugin the filter applies after the input runs.

- **fieldinclude**: An array of glob pattern strings.
  Only fields whose field key matches a pattern in this list are emitted.
- **fieldexclude**: The inverse of `fieldinclude`.
  Fields with a field key matching one of the patterns will be discarded from the metric.
  This is tested on metrics after they have passed the `fieldinclude` test.
- **taginclude**: An array of glob pattern strings.
  Only tags with a tag key matching one of the patterns are emitted.
  In contrast to `tagpass`, which will pass an entire metric based on its tag,
  `taginclude` removes all non matching tags from the metric.
  Any tag can be filtered including global tags and the agent `host` tag.
- **tagexclude**: The inverse of `taginclude`.
  Tags with a tag key matching one of the patterns will be discarded from the metric.
  Any tag can be filtered including global tags and the agent `host` tag.

> [!Note]
> #### Include tagpass and tagdrop at the end of your plugin definition
> 
> Due to the way TOML is parsed, `tagpass` and `tagdrop` parameters
> must be defined at the _end_ of the plugin definition, otherwise subsequent
> plugin configuration options are interpreted as part of the tagpass and tagdrop
> tables.

To learn more about metric filtering, watch the following video:

{{< youtube R3DnObs_OKA >}}

## Filtering examples

#### Input configuration examples

The following example configuration collects per-cpu data, drops any
fields that begin with `time_`, tags measurements with `dc="denver-1"`, and then
outputs measurements at a 10 second interval to an InfluxDB database named
`telegraf` at the address `192.168.59.103:8086`.

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

#### Input Config: `namepass` and `namedrop` with separators

```toml
# Pass all metrics of type 'A.C.B' and drop all others like 'A.C.D.B'
[[inputs.socket_listener]]
  data_format = "graphite"
  templates = ["measurement*"]

  namepass = ["A.*.B"]
  namepass_separator = "."

# Drop all metrics of type 'A.C.B' and pass all others like 'A.C.D.B'
[[inputs.socket_listener]]
  data_format = "graphite"
  templates = ["measurement*"]

  namedrop = ["A.*.B"]
  namedrop_separator = "."
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

## Plugin selection via labels and selectors

You can control which plugin instances are enabled by adding labels to plugin
configurations and passing one or more selectors on the command line.

### Selectors

Provide selectors with one or more `--select` flags when starting Telegraf.
Each `--select` value is a semicolon-separated list of key=value pairs:

```text
<key>=<value>[;<key>=<value>]
```

- Pairs in a single `--select` value are combined with logical AND (all must match).
- Multiple `--select` flags are combined with logical OR (a plugin is enabled if it matches any selector set).

Selectors support simple glob patterns in values (for example `region=us-*`).

Example:

```console
telegraf --config config.conf --config-directory directory/ \
  --select="app=payments;region=us-*" \
  --select="env=prod" \
  --watch-config --print-plugin-config-source=true
```

### Labels

Add an optional `labels` table to a plugin, similar to `tags`.
Keys and values are plain strings.

Example:

```toml
[[inputs.cpu]]
  [inputs.cpu.labels]
    app = "payments"
    region = "us-east"
    env = "prod"
```

Telegraf matches the command-line selectors against a plugin's labels to decide
whether that plugin instance should be enabled.
For details on supported syntax and matching rules, see the labels selectors spec.

## Transport Layer Security (TLS)

Many Telegraf plugins support TLS configuration for secure communication.
Reference the detailed TLS documentation for configuration options and examples.
