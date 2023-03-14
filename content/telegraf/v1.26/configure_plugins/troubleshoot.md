---
title: Troubleshoot Telegraf
description: Resolve common issues with Telegraf.
menu:
  telegraf_1_26:

    name: Troubleshoot
    Parent: Configure plugins
    weight: 79
aliases:
  - /telegraf/v1.26/administration/troubleshooting/
  - /telegraf/v1.26/administration/troubleshooting/
---

## Validate your Telegraf configuration with `--test`

Run a single telegraf collection, outputting metrics to stdout:
`telegraf --config telegraf.conf --test`

## Use the `--once` option to single-shot execute

Once tested, run `telegraf --config telegraf.conf --once` to perform a single-shot execution of all configured plugins. This sends output to partner systems specified in the `telegraf.conf` rather than writing to `stdout`.

## Add `outputs.file` to read to a file or STDOUT

The following step might be helpful if:
- You're encountering issues in your output and trying to determine if it’s an issue with your configuration or connection.
-  `-test` outputs metrics to stdout as expected and your input, parsers, processors, and aggregators are configured correctly. Note that if it's a listener plugin, `-test` wouldn't output any metrics right away.

Add the `file` output plugin with the metrics reporting to STDOUT or to a file.
```toml
[[outputs.file]]
  files = ["stdout"]
```

## Set `debug = true` in your settings

When you set `debug = true` in global settings, Telegraf runs with debug log messages.

```
2021-06-28T19:18:00Z I! Starting Telegraf 1.19.0
2021-06-28T19:18:00Z I! Loaded inputs: cpu disk diskio mem net processes swap system
2021-06-28T19:18:00Z I! Loaded aggregators:
2021-06-28T19:18:00Z I! Loaded processors:
2021-06-28T19:18:00Z I! Loaded outputs: influxdb_v2
2021-06-28T19:18:00Z I! Tags enabled: host=MBP15-INFLUX.local
2021-06-28T19:18:00Z I! [agent] Config: Interval:10s, Quiet:false, Hostname:"MBP15-INFLUX.local", Flush Interval:30s
2021-06-28T19:18:00Z D! [agent] Initializing plugins
2021-06-28T19:18:00Z D! [agent] Connecting outputs
2021-06-28T19:18:00Z D! [agent] Attempting connection to [outputs.influxdb_v2]
2021-06-28T19:18:00Z D! [agent] Successfully connected to outputs.influxdb_v2
2021
-06-28T19:18:00Z D! [agent] Starting service inputs
```
