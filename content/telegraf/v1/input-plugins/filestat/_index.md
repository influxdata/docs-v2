---
description: "Telegraf plugin for collecting metrics from File statistics"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: File statistics
    identifier: input-filestat
tags: [File statistics, "input-plugins", "configuration", "system"]
introduced: "v0.13.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.4/plugins/inputs/filestat/README.md, File statistics Plugin Source
---

# File statistics Input Plugin

This plugin gathers metrics about file existence, size, and other file
statistics.

**Introduced in:** Telegraf v0.13.0
**Tags:** system
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read stats about given file(s)
[[inputs.filestat]]
  ## Files to gather stats about.
  ## These accept standard unix glob matching rules, but with the addition of
  ## ** as a "super asterisk". See https://github.com/gobwas/glob.
  files = ["/etc/telegraf/telegraf.conf", "/var/log/**.log"]

  ## If true, read the entire file and calculate an md5 checksum.
  md5 = false
```

## Metrics

### Measurements & Fields

- filestat
  - exists (int, 0 | 1)
  - size_bytes (int, bytes)
  - modification_time (int, unix time nanoseconds)
  - md5 (optional, string)

### Tags

- All measurements have the following tags:
  - file (the path the to file, as specified in the config)

## Example Output

```text
filestat,file=/tmp/foo/bar,host=tyrion exists=0i 1507218518192154351
filestat,file=/Users/sparrc/ws/telegraf.conf,host=tyrion exists=1i,size=47894i,modification_time=1507152973123456789i  1507218518192154351
```
