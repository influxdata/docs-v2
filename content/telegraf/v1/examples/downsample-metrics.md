---
title: Downsample metrics before writing
description: >
  Use Telegraf aggregator plugins to write raw metrics to one InfluxDB 3
  database and five-minute statistical summaries to another.
menu:
  telegraf_v1:
    name: Downsample metrics
    parent: Configuration examples
weight: 111
related:
  - /telegraf/v1/configure_plugins/aggregator_processor/
  - /telegraf/v1/aggregator-plugins/basicstats/
  - /telegraf/v1/configuration/filtering/
---

Collect at high resolution, keep the raw data briefly, and store compact
statistical summaries long-term.
This configuration collects CPU and memory metrics every 10 seconds,
writes the raw metrics to one database, and writes 5-minute min, max, and
mean summaries to another.

## Configuration

```toml { placeholders="AUTH_TOKEN|RAW_DATABASE_NAME|SUMMARY_DATABASE_NAME" }
[agent]
  interval = "10s"

[[inputs.cpu]]
  totalcpu = true

[[inputs.mem]]

[[aggregators.basicstats]]
  ## Summarize each 5-minute window.
  period = "5m"
  stats = ["min", "max", "mean"]

  ## Keep the raw metrics flowing to the outputs.
  drop_original = false

  ## Rename the aggregates so outputs can route on the name.
  name_suffix = "_5m"

[[outputs.influxdb_v3]]
  ## Raw metrics: everything except the renamed aggregates.
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "RAW_DATABASE_NAME"
  namedrop = ["*_5m"]

[[outputs.influxdb_v3]]
  ## Aggregates only.
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "SUMMARY_DATABASE_NAME"
  namepass = ["*_5m"]
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`RAW_DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database for full-resolution metrics, typically with a short
  retention period
- {{% code-placeholder-key %}}`SUMMARY_DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database for long-term summaries

## How it works

- **`aggregators.basicstats`** collects matching metrics into 5-minute
  windows and emits `<field>_min`, `<field>_max`, and `<field>_mean`
  fields at the end of each period.
- **`drop_original = false`** (the default) lets the raw metrics continue
  to the outputs alongside the aggregates.
  The result is two streams in one pipeline: raw `cpu` and `mem` metrics
  every 10 seconds, plus `cpu_5m` and `mem_5m` aggregates every 5
  minutes.
- **`name_suffix = "_5m"`** renames the aggregate metrics, which is what
  makes them routable: the raw output excludes them with
  `namedrop = ["*_5m"]`, and the summary output selects only them with
  `namepass = ["*_5m"]`.
- Each output batches and delivers independently, so a slow or unavailable
  destination doesn't block the other.

To keep only the summaries and discard raw data entirely, set
`drop_original = true` and remove the raw output.
See
[Why processors run twice](/telegraf/v1/configure_plugins/aggregator_processor/#why-processors-run-twice)
for how aggregates flow through the pipeline.

## Example output

Raw metrics, every 10 seconds:

```text
cpu,cpu=cpu-total,host=host1 usage_idle=92.4,usage_user=4.2 1709572230000000000
mem,host=host1 used_percent=64.2 1709572230000000000
```

Aggregates, every 5 minutes:

```text
cpu_5m,cpu=cpu-total,host=host1 usage_idle_min=88.1,usage_idle_max=94.6,usage_idle_mean=91.7,usage_user_min=3.1,usage_user_max=6.8,usage_user_mean=4.4 1709572500000000000
mem_5m,host=host1 used_percent_min=63.8,used_percent_max=65.1,used_percent_mean=64.3 1709572500000000000
```

## Extend this example

- Swap or add aggregators for different summaries: quantiles, histograms,
  or final values.
  See [Common aggregator examples](/telegraf/v1/configure_plugins/aggregator_processor/#common-aggregator-examples).
- Scope the aggregator to specific measurements with `namepass` on the
  aggregator itself.
- For more routing patterns, see
  [Route metrics to different outputs](/telegraf/v1/examples/route-metrics/).
