---
description: "Telegraf plugin for collecting metrics from Trig"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Trig
    identifier: input-trig
tags: [Trig, "input-plugins", "configuration", "testing"]
introduced: "v0.3.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/inputs/trig/README.md, Trig Plugin Source
---

# Trig Input Plugin

This plugin is for demonstration purposes and inserts sine and cosine values
as metrics.

**Introduced in:** Telegraf v0.3.0
**Tags:** testing
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Inserts sine and cosine waves for demonstration purposes
[[inputs.trig]]
  ## Set the amplitude
  amplitude = 10.0
```

## Metrics

- trig
  - fields:
    - cosine (float)
    - sine (float)

## Example Output

```text
trig,host=MBP15-SWANG.local cosine=10,sine=0 1632338680000000000
trig,host=MBP15-SWANG.local sine=5.877852522924732,cosine=8.090169943749473 1632338690000000000
trig,host=MBP15-SWANG.local sine=9.510565162951535,cosine=3.0901699437494745 1632338700000000000
```
