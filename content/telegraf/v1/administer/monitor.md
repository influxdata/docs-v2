---
title: Monitor Telegraf
description: >
  Monitor Telegraf health with the internal input plugin, Telegraf logs, and
  Telegraf Controller heartbeat reporting.
menu:
  telegraf_v1:
    name: Monitor Telegraf
    parent: Administer Telegraf
weight: 102
related:
  - /telegraf/v1/input-plugins/internal/
  - /telegraf/v1/configuration/agent/
  - /telegraf/v1/administer/manage-at-scale/
  - /telegraf/v1/administer/agent-status/
---

Monitor Telegraf itself to catch problems such as failing collections,
output backpressure, and dropped metrics.
Telegraf provides self-metrics and logs on each agent, and
[Telegraf Controller](/telegraf/controller/) provides fleet-level
monitoring.

## Collect Telegraf metrics with the internal plugin

The [internal input plugin](/telegraf/v1/input-plugins/internal/) collects
metrics about the running Telegraf process and its plugins, and emits them
through the normal pipeline like any other metrics:

```toml
[[inputs.internal]]
  ## If true, collect telegraf memory stats.
  collect_memstats = true

  ## If true, collect metrics from Go's runtime.metrics.
  # collect_gostats = false

  ## Collect statistics per plugin instance and not per plugin type
  # per_instance = false
```

Useful measurements include:

- **`internal_agent`**: agent-wide totals, such as `metrics_gathered`,
  `metrics_written`, `metrics_dropped`, `gather_errors`, and
  `gather_timeouts`.
- **`internal_gather`**: per-input collection statistics, such as
  `gather_time_ns` and `gather_timeouts`.
- **`internal_write`**: per-output write statistics, such as `buffer_size`,
  `buffer_limit`, and `metrics_dropped`.
- **`internal_memstats`**: Go memory statistics for the Telegraf process.

Watch `internal_write` in particular: a `buffer_size` that climbs toward
`buffer_limit` means the output can't keep up and metrics will be dropped
when the buffer fills.
See
[Buffering and delivery](/telegraf/v1/concepts/data-pipeline/#buffering-and-delivery).

Plugins that define an `alias` report per-instance statistics with the alias
as a tag, which makes multiple instances of the same plugin easy to tell
apart.

## Read Telegraf logs

By default, Telegraf logs to stderr, or to the journal when running under
systemd.
Use the agent [logging settings](/telegraf/v1/configuration/agent/#logging)
to change the format, write to a file, or enable rotation, and set
[`debug = true`](/telegraf/v1/configuration/agent/#debug) for verbose
output while diagnosing problems.

On Windows, service startup messages go to the Windows event log.
See
[Windows service logging](/telegraf/v1/administer/run-as-service/#windows-service-logging).

## Monitor agents with Telegraf Controller

For a fleet of agents, Telegraf instances that run the
[heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) report
back to [Telegraf Controller](/telegraf/controller/) on an interval.
Each heartbeat includes agent metrics, error counts, plugin statistics, and
a self-evaluated status computed from CEL expressions in the plugin
configuration.

Telegraf Controller displays each agent's status and marks agents that stop
reporting.
To configure status evaluation, see
[Configure agent statuses](/telegraf/v1/administer/agent-status/).
