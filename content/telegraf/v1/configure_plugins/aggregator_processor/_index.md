---
title: Transform data with aggregator and processor plugins
description: >
  Use processor plugins to transform, decorate, and filter metrics, and
  aggregator plugins to produce windowed statistics such as means, quantiles,
  and histograms. Includes common examples for both plugin types.
menu:
  telegraf_v1:
    name: Processors and aggregators
    parent: Use plugins
weight: 103
related:
  - /telegraf/v1/processor-plugins/
  - /telegraf/v1/aggregator-plugins/
  - /telegraf/v1/concepts/data-pipeline/
  - /telegraf/v1/configuration/plugin-options/
---

Processor and aggregator plugins sit between inputs and outputs and
transform metrics as they pass through Telegraf.

- [Data flow](#data-flow)
- [Processor or aggregator?](#processor-or-aggregator)
- [Common processor examples](#common-processor-examples)
- [Common aggregator examples](#common-aggregator-examples)
- [Scope plugins with metric filtering](#scope-plugins-with-metric-filtering)
- [Control processor order](#control-processor-order)
- [Why processors run twice](#why-processors-run-twice)
- [Downsample before writing](#downsample-before-writing)

## Data flow

When you configure processor and aggregator plugins, Telegraf arranges
them into a fixed sequence between inputs and outputs.
Metrics from every input plugin flow through the same processor and
aggregator stages, and the results fan out to every output plugin whose
filters they pass.
The following diagram shows the flow for a configuration with four input
plugins, processors, aggregators, and two output plugins:

{{< diagram >}}
graph TD
  cpu[<strong>inputs.cpu</strong>]
  mem[<strong>inputs.mem</strong>]
  mysql[<strong>inputs.mysql</strong>]
  docker[<strong>inputs.docker</strong>]
  P1[<strong>Processor plugins</strong> \n <em>First pass</em>]
  Agg[<strong>Aggregator plugins</strong> \n <em>Windowed aggregates</em>]
  P2[<strong>Processor plugins</strong> \n <em>Second pass</em>]
  influx[<strong>outputs.influxdb_v3</strong>]
  file[<strong>outputs.file</strong>]

  cpu --> P1
  mem --> P1
  mysql --> P1
  docker --> P1
  P1 --> Agg
  Agg -- aggregates --> P2
  Agg -- original metrics --> influx
  Agg -- original metrics --> file
  P2 --> influx
  P2 --> file
{{< /diagram >}}

Aggregate metrics emitted by the aggregators take a second trip through
the processors.
Original metrics continue directly to the outputs.
For details, see [Why processors run twice](#why-processors-run-twice).

## Processor or aggregator?

**Processor plugins** act on each metric as it passes through and
immediately emit the result.
Use a processor when the transformation needs only the metric in hand:
renaming, converting types, adding tags, mapping values, or running
calculations on a single metric.
For the complete list, see
[processor plugins](/telegraf/v1/processor-plugins/).

**Aggregator plugins** produce new *aggregate* metrics, such as a running
mean, minimum, maximum, quantiles, or standard deviation.
Use an aggregator when the result depends on multiple metrics observed over
time.
Because aggregates summarize a time window, every aggregator is configured
with a `period`.
The emitted aggregate represents the metrics observed during the past
`period`.
For the complete list, see
[aggregator plugins](/telegraf/v1/aggregator-plugins/).

Keep the following aggregator behaviors in mind:

- Aggregators only aggregate metrics with timestamps inside the current
  period. Metrics older than `now() - period` are not included.
- By default, aggregators emit the aggregates *and* pass the original
  metrics downstream.
  If you only care about the aggregates, set `drop_original = true` to emit
  only the aggregates.
- Aggregates are created for each unique combination of measurement, field,
  and tag set the plugin receives.
  Use `taginclude` to group aggregates by specific tags only.

Both plugin types share common options, including `order` for processors
and `period`, `delay`, `grace`, and `drop_original` for aggregators.
See [Common plugin options](/telegraf/v1/configuration/plugin-options/).

## Common processor examples

The following examples show frequently used processors, with the metrics
before and after processing.

### Add tags to all metrics

Use the [override processor](/telegraf/v1/processor-plugins/override/) to
add static tags, such as environment or region, to every metric that passes
through:

```toml
[[processors.override]]
  [processors.override.tags]
    environment = "production"
    region = "us-west"
```

##### Before

```text
cpu,cpu=cpu0 usage_idle=92.4 1709572232000000000
```

##### After

```text
cpu,cpu=cpu0,environment=production,region=us-west usage_idle=92.4 1709572232000000000
```

### Rename measurements, tags, and fields

Use the [rename processor](/telegraf/v1/processor-plugins/rename/) to align
names across sources, with one `replace` sub-table per rename:

```toml
[[processors.rename]]
  [[processors.rename.replace]]
    tag = "hostname"
    dest = "host"

  [[processors.rename.replace]]
    field = "lower"
    dest = "min"

  [[processors.rename.replace]]
    field = "upper"
    dest = "max"
```


##### Before

```text
temperature,hostname=node1 lower=17.9,upper=32.3 1709572232000000000
```

##### After

```text
temperature,host=node1 min=17.9,max=32.3 1709572232000000000
```

### Convert field types

Use the [converter processor](/telegraf/v1/processor-plugins/converter/)
when a source reports numbers as strings.
The table key is the target type, and the array lists the fields to
convert:

```toml
[[processors.converter]]
  [processors.converter.fields]
    float = ["temp"]
    integer = ["humidity"]
```

##### Before

```text
sensors,node=node1 temp="32.3",humidity="23" 1709572232000000000
```

##### After

```text
sensors,node=node1 temp=32.3,humidity=23i 1709572232000000000
```

### Map values to codes

Use the [enum processor](/telegraf/v1/processor-plugins/enum/) to map
string states to numeric codes you can alert and do math on:

```toml
[[processors.enum]]
  [[processors.enum.mapping]]
    fields = ["status"]
    dest = "status_code"
    [processors.enum.mapping.value_mappings]
      green = 1
      amber = 2
      red = 3
```


##### Before

```text
service,host=web01 status="green" 1709572232000000000
```

##### After

```text
service,host=web01 status="green",status_code=1i 1709572232000000000
```

### Reshape values with regular expressions

Use the [regex processor](/telegraf/v1/processor-plugins/regex/) to derive
new values from existing ones.
The following example collapses HTTP response codes into classes (`2xx`,
`4xx`) for a lower-cardinality tag:

```toml
[[processors.regex]]
  namepass = ["nginx_requests"]

  [[processors.regex.tags]]
    key = "resp_code"
    pattern = "^(\\d)\\d\\d$"
    replacement = "${1}xx"
```

##### Before

```text
nginx_requests,resp_code=200 request_time=1.5 1709572232000000000
```

##### After

```text
nginx_requests,resp_code=2xx request_time=1.5 1709572232000000000
```

The `namepass` option restricts the processor to `nginx_requests` metrics.
See [Scope plugins with metric filtering](#scope-plugins-with-metric-filtering).

### Write custom logic

When no processor fits, use the
[starlark processor](/telegraf/v1/processor-plugins/starlark/) to script
your own transformation in Starlark, a dialect of Python:

```toml
[[processors.starlark]]
  source = '''
def apply(metric):
    metric.fields["temp_f"] = metric.fields["temp"] * 9 / 5 + 32
    return metric
'''
```

##### Before

```text
sensors,node=node1 temp=32.3 1709572232000000000
```

##### After

```text
sensors,node=node1 temp=32.3,temp_f=90.14 1709572232000000000
```

The [execd processor](/telegraf/v1/processor-plugins/execd/) goes further
and streams metrics through any external program.
See [external plugins](/telegraf/v1/configure_plugins/external_plugins/).

## Common aggregator examples

The following examples show frequently used aggregators.

### Calculate basic statistics

Use the
[basicstats aggregator](/telegraf/v1/aggregator-plugins/basicstats/) to
compute statistics such as count, min, max, mean, and standard deviation
over each period.
The aggregate fields append the statistic name to the original field name:

```toml
[[aggregators.basicstats]]
  period = "30s"
  drop_original = false
  stats = ["min", "max", "mean"]
```

```text
# Original metrics passed through, plus per-period aggregates:
cpu,cpu=cpu0 usage_idle_min=88.1,usage_idle_max=94.6,usage_idle_mean=91.7 1709572260000000000
```

### Report the final value in each period

Use the [final aggregator](/telegraf/v1/aggregator-plugins/final/) to emit
the last value of a series, either when the series stops reporting
(`output_strategy = "timeout"`, the default) or once per period
(`output_strategy = "periodic"`).
This is useful for downsampling and for capturing the end state of batch
jobs.
Emitted fields append `_final` to the field name unless you set
`keep_original_field_names = true`.

```toml
[[aggregators.final]]
  period = "30s"
  output_strategy = "periodic"
  keep_original_field_names = true
  drop_original = true
```

```text
# Only the last value per series in each 30s window is emitted:
cpu,cpu=cpu0 usage_idle=91.2 1709572260000000000
```

### Calculate quantiles

Use the
[quantile aggregator](/telegraf/v1/aggregator-plugins/quantile/) to compute
quantiles over each period.
Aggregate fields append the quantile to the field name, for example
`request_time_050` for the median:

```toml
[[aggregators.quantile]]
  period = "30s"
  quantiles = [0.50, 0.95, 0.99]
```

The default `t-digest` algorithm approximates quantiles efficiently for
large sample counts.
For small sample counts, the exact algorithms (`exact R7` and `exact R8`)
trade memory for accuracy.

### Build histograms

Use the
[histogram aggregator](/telegraf/v1/aggregator-plugins/histogram/) to count
values into configured buckets, producing Prometheus-style cumulative
histograms with a `le` tag:

```toml
[[aggregators.histogram]]
  period = "30s"
  [[aggregators.histogram.config]]
    buckets = [0.0, 10.0, 50.0, 100.0]
    measurement_name = "cpu"
    fields = ["usage_idle"]
```

```text
cpu,cpu=cpu0,le=0.0 usage_idle_bucket=0i 1709572260000000000
cpu,cpu=cpu0,le=10.0 usage_idle_bucket=1i 1709572260000000000
cpu,cpu=cpu0,le=50.0 usage_idle_bucket=2i 1709572260000000000
cpu,cpu=cpu0,le=100.0 usage_idle_bucket=4i 1709572260000000000
cpu,cpu=cpu0,le=+Inf usage_idle_bucket=4i 1709572260000000000
```

### Merge fields from related metrics

Use the [merge aggregator](/telegraf/v1/aggregator-plugins/merge/) to
combine metrics that share a measurement, tag set, and timestamp into a
single multi-field metric.
This reduces write overhead when inputs emit each field as a separate
metric:

```toml
[[aggregators.merge]]
  ## Round timestamps to merge metrics that arrive
  ## within a small interval.
  round_timestamp_to = "1s"
  drop_original = true
```

##### Before

```text
cpu,host=node1 usage_time=42 1709572232000000000
cpu,host=node1 idle_time=42 1709572232000000000
```

##### After

```text
cpu,host=node1 usage_time=42,idle_time=42 1709572232000000000
```

## Scope plugins with metric filtering

Use [metric filtering](/telegraf/v1/configuration/filtering/) to control
which metrics pass through a processor or aggregator.
Metrics that don't match a plugin's filters bypass the plugin and continue
downstream unchanged.

For example, to apply a scaling processor only to metrics from one input,
filter on the measurement name:

```toml
[[processors.scale]]
  namepass = ["temperature"]
  [[processors.scale.scaling]]
    input_minimum = 0.0
    input_maximum = 1.0
    output_minimum = 0.0
    output_maximum = 100.0
    fields = ["level"]
```

## Control processor order

The `order` option on each processor sets the sequence processors run in.
Processors without `order` run before those that define it, so if order
matters, set `order` on every processor.
See [order](/telegraf/v1/configuration/plugin-options/#order).

## Why processors run twice

When at least one aggregator is configured, Telegraf builds the pipeline
with a processor stage on each side of aggregation.
Processors run first, then aggregators, then processors a second time.
Without aggregators, processors run once.

The second pass exists because aggregates are new metrics.
An aggregator creates its aggregates in the middle of the pipeline, after
the first processor pass has already happened, so without a second pass
there would be no way to transform them.
Running aggregator output through the processors again lets you rename
aggregate fields, convert their units, or apply any other processing to the
aggregates themselves.

### What flows through the second pass

- **Aggregate metrics** emitted by aggregators run through the second
  processor pass and then continue to the outputs.
- **Original metrics** don't run through processors again.
  After the first pass, a metric that matches an aggregator's filters is
  copied into the aggregation window, and the original continues directly
  to the outputs.
  If the aggregator sets `drop_original = true`, Telegraf drops the
  original instead.
- **Metrics that match no aggregator** also continue directly to the
  outputs.

The second pass runs the same processors in the same order as the first
pass, and each processor's filters apply on both passes.

### Run processors on only one side

Because aggregates are computed from metrics the processors already
transformed, the second pass transforms the aggregates again.
For example, with a processor that scales values by 10, a raw value of `5`
becomes `50` in the first pass.
An aggregator then emits a mean of `50`, and the second pass scales the
aggregate to `500`.

To avoid processing metrics twice, use the following `[agent]` settings to
disable one of the two passes:

- [`skip_processors_before_aggregators`](/telegraf/v1/configuration/agent/#skip_processors_before_aggregators):
  processors run only *after* aggregators.
- [`skip_processors_after_aggregators`](/telegraf/v1/configuration/agent/#skip_processors_after_aggregators):
  processors run only *before* aggregators.

> [!Important]
> The default value of `skip_processors_after_aggregators` is scheduled to
> change to `true` in Telegraf 1.40, making a single processor pass the
> default behavior.
> Telegraf logs a warning at startup until you set the option explicitly.
> If your pipeline depends on the second pass, set
> `skip_processors_after_aggregators = false` in the `[agent]` table.

### Keep aggregates out of specific processors

To keep the second pass for some processors but exclude others, make the
aggregates distinguishable and filter on the difference.
Aggregates often keep the original measurement name, so rename them with
`name_override` on the aggregator, then exclude them from the processor
with `namedrop`:

```toml
[[aggregators.basicstats]]
  period = "5m"
  stats = ["mean"]
  namepass = ["cpu"]
  name_override = "cpu_5m"

[[processors.scale]]
  namedrop = ["cpu_5m"]
  [[processors.scale.scaling]]
    factor = 10.0
    fields = ["usage_user"]
```

Raw `cpu` metrics are scaled in the first pass, while the renamed `cpu_5m`
aggregates bypass the scale processor in the second pass.

> [!Note]
> If you use custom processor scripts, make them idempotent (repeatable,
> without side effects).
> For custom processing that is not idempotent, use
> [metric filtering](#scope-plugins-with-metric-filtering) so aggregated
> metrics bypass the processor instead of being processed a second time.

## Downsample before writing

Combining the pieces above, the following configuration collects CPU and
memory metrics every 10 seconds, but writes only 5-minute statistics to
InfluxDB, reducing storage while keeping the shape of the data:

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[agent]
  interval = "10s"

[[inputs.cpu]]
  totalcpu = true

[[inputs.mem]]

[[aggregators.basicstats]]
  period = "5m"
  drop_original = true
  stats = ["min", "max", "mean"]
  namepass = ["cpu", "mem"]

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Setting `drop_original = true` keeps the raw 10-second metrics from
reaching the output, so only the aggregates are written.
To write raw metrics to one destination and aggregates to another, keep
`drop_original = false` and use
[metric filtering on the outputs](/telegraf/v1/configure_plugins/output_plugins/#send-different-metrics-to-different-outputs).
