---
description: "Telegraf plugin for aggregating metrics using Merge"
menu:
  telegraf_v1_ref:
    parent: aggregator_plugins_reference
    name: Merge
    identifier: aggregator-merge
tags: [Merge, "aggregator-plugins", "configuration", "transformation"]
introduced: "v1.13.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.2/plugins/aggregators/merge/README.md, Merge Plugin Source
---

# Merge Aggregator Plugin

This plugin merges metrics of the same series and timestamp into new metrics
with the super-set of fields. A series here is defined by the metric name and
the tag key-value set.

Use this plugin when fields are split over multiple metrics, with the same
measurement, tag set and timestamp.

**Introduced in:** Telegraf v1.13.0
**Tags:** transformation
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Merge metrics into multifield metrics by series key
[[aggregators.merge]]
  ## General Aggregator Arguments:
  ## The period on which to flush & clear the aggregator.
  # period = "30s"

  ## Precision to round the metric timestamp to
  ## This is useful for cases where metrics to merge arrive within a small
  ## interval and thus vary in timestamp. The timestamp of the resulting metric
  ## is also rounded.
  # round_timestamp_to = "1ns"

  ## If true, the original metric will be dropped by the
  ## aggregator and will not get sent to the output plugins.
  drop_original = true
```

## Example

```diff
- cpu,host=localhost usage_time=42 1567562620000000000
- cpu,host=localhost idle_time=42 1567562620000000000
+ cpu,host=localhost idle_time=42,usage_time=42 1567562620000000000
```
