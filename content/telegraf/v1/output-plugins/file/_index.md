---
description: "Telegraf plugin for sending metrics to File"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: File
    identifier: output-file
tags: [File, "output-plugins", "configuration", "system"]
introduced: "v0.10.3"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/outputs/file/README.md, File Plugin Source
---

# File Output Plugin

This plugin writes metrics to one or more local files in one of the supported
[data formats](/telegraf/v1/data_formats/output).

**Introduced in:** Telegraf v0.10.3
**Tags:** system
**OS support:** all

[data_formats]: /docs/DATA_FORMATS_OUTPUT.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Send telegraf metrics to file(s)
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Use batch serialization format instead of line based delimiting.  The
  ## batch format allows for the production of non line based output formats and
  ## may more efficiently encode and write metrics.
  # use_batch_format = false

  ## The file will be rotated after the time interval specified.  When set
  ## to 0 no time based rotation is performed.
  # rotation_interval = "0h"

  ## The logfile will be rotated when it becomes larger than the specified
  ## size.  When set to 0 no size based rotation is performed.
  # rotation_max_size = "0MB"

  ## Maximum number of rotated archives to keep, any older logs are deleted.
  ## If set to -1, no archives are removed.
  # rotation_max_archives = 5

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "influx"

  ## Compress output data with the specified algorithm.
  ## If empty, compression will be disabled and files will be plain text.
  ## Supported algorithms are "zstd", "gzip" and "zlib".
  # compression_algorithm = ""

  ## Compression level for the algorithm above.
  ## Please note that different algorithms support different levels:
  ##   zstd  -- supports levels 1, 3, 7 and 11.
  ##   gzip -- supports levels 0, 1 and 9.
  ##   zlib -- supports levels 0, 1, and 9.
  ## By default the default compression level for each algorithm is used.
  # compression_level = -1
```
