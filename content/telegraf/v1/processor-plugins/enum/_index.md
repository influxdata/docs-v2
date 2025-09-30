---
description: "Telegraf plugin for transforming metrics using Enum"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Enum
    identifier: processor-enum
tags: [Enum, "processor-plugins", "configuration", "transformation"]
introduced: "v1.8.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.1/plugins/processors/enum/README.md, Enum Plugin Source
---

# Enum Processor Plugin

This plugin allows the mapping of field or tag values according to the
configured enumeration. The main use-case is to rewrite numerical values into
human-readable values or vice versa. Default mappings can be configured to be
used for all remaining values.

**Introduced in:** Telegraf v1.8.0
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
# Map enum values according to given table.
[[processors.enum]]
  [[processors.enum.mapping]]
    ## Names of the fields to map. Globs accepted.
    fields = ["status"]

    ## Name of the tags to map. Globs accepted.
    # tags = ["status"]

    ## Destination tag or field to be used for the mapped value.  By default the
    ## source tag or field is used, overwriting the original value.
    dest = "status_code"

    ## Default value to be used for all values not contained in the mapping
    ## table.  When unset and no match is found, the original field will remain
    ## unmodified and the destination tag or field will not be created.
    # default = 0

    ## Table of mappings
    [processors.enum.mapping.value_mappings]
      green = 1
      amber = 2
      red = 3
```

## Example

```diff
- xyzzy status="green" 1502489900000000000
+ xyzzy status="green",status_code=1i 1502489900000000000
```

With unknown value and no default set:

```diff
- xyzzy status="black" 1502489900000000000
+ xyzzy status="black" 1502489900000000000
```
