---
title: Route metrics to different outputs
description: >
  Use Telegraf metric filtering to send different metrics from one pipeline
  to different InfluxDB 3 databases and other destinations.
menu:
  telegraf_v1:
    name: Route metrics to outputs
    parent: Configuration examples
weight: 112
related:
  - /telegraf/v1/configuration/filtering/
  - /telegraf/v1/configure_plugins/output_plugins/
---

Send different subsets of one metric stream to different destinations.
Each output plugin applies its own
[metric filters](/telegraf/v1/configuration/filtering/) before writing, so
routing is a property of the outputs, not the inputs.

This example collects system and application metrics, then routes them
three ways: infrastructure metrics to one database, application metrics to
another, and error events to a file for local inspection.

## Configuration

```toml { placeholders="AUTH_TOKEN|INFRA_DATABASE_NAME|APP_DATABASE_NAME" }
[[inputs.cpu]]
  totalcpu = true

[[inputs.mem]]

## Application metrics pushed to a local listener as line protocol.
[[inputs.http_listener_v2]]
  service_address = ":8186"
  paths = ["/write"]
  data_format = "influx"

[[outputs.influxdb_v3]]
  ## Infrastructure metrics only.
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "INFRA_DATABASE_NAME"
  namepass = ["cpu", "mem"]

[[outputs.influxdb_v3]]
  ## Application metrics: everything except infrastructure.
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "APP_DATABASE_NAME"
  namedrop = ["cpu", "mem"]

[[outputs.file]]
  ## Error events only, matched by tag, for local debugging.
  files = ["/var/log/telegraf/errors.out"]
  [outputs.file.tagpass]
    level = ["error", "critical"]
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`INFRA_DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database for infrastructure metrics
- {{% code-placeholder-key %}}`APP_DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database for application metrics

## How it works

- **Every metric visits every output**, and each output's filters decide
  whether to write it.
  Metrics can match more than one output: an application event tagged
  `level=error` writes to both the application database and the error
  file.
- **`namepass` and `namedrop`** filter by measurement name.
  The two `influxdb_v3` outputs use complementary rules, so every metric
  lands in exactly one database.
- **`tagpass`** filters on tag values.
  It must be the last option in the plugin definition: TOML assigns any
  option that appears after a sub-table, like `[outputs.file.tagpass]`,
  to that sub-table, so options placed after it would be misread.
  See [Table ordering](/telegraf/v1/configuration/toml/#table-ordering).
- Each output buffers and retries independently.
  A full or unreachable destination doesn't affect delivery to the
  others.

## Example output

Sent to the infrastructure database:

```text
cpu,cpu=cpu-total,host=host1 usage_idle=92.4,usage_user=4.2 1709572230000000000
mem,host=host1 used_percent=64.2 1709572230000000000
```

Sent to the application database:

```text
orders,host=host1,region=us-west,level=info processed=142i,failed=0i 1709572231000000000
payments,host=host1,region=us-west,level=error latency_ms=2841i,failed=3i 1709572231000000000
```

Also written to `/var/log/telegraf/errors.out`:

```text
payments,host=host1,region=us-west,level=error latency_ms=2841i,failed=3i 1709572231000000000
```

## Extend this example

- Route by tag instead of name to split environments or regions across
  databases, for example `tagpass` on a `region` tag.
- Apply the same filtering to processors and aggregators to scope
  transformations.
  See [Scope plugins with metric filtering](/telegraf/v1/configure_plugins/aggregator_processor/#scope-plugins-with-metric-filtering).
- To route copies of everything to a second destination, add an output
  with no filters.
  For splitting raw and downsampled streams, see
  [Downsample metrics before writing](/telegraf/v1/examples/downsample-metrics/).
