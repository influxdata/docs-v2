---
description: "Telegraf plugin for transforming metrics using S2 Geo"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: S2 Geo
    identifier: processor-s2geo
tags: [S2 Geo, "processor-plugins", "configuration", "annotation"]
introduced: "v1.14.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/processors/s2geo/README.md, S2 Geo Plugin Source
---

# S2 Geo Processor Plugin

This plugin uses the WGS-84 coordinates in decimal degrees specified in the
latitude and longitude fields and adds a tag with the corresponding S2 cell ID
token of specified [cell level](https://s2geometry.io/resources/s2cell_statistics.html).

**Introduced in:** Telegraf v1.14.0
**Tags:** annotation
**OS support:** all

[cell levels]: https://s2geometry.io/resources/s2cell_statistics.html

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Add the S2 Cell ID as a tag based on latitude and longitude fields
[[processors.s2geo]]
  ## The name of the lat and lon fields containing WGS-84 latitude and
  ## longitude in decimal degrees.
  # lat_field = "lat"
  # lon_field = "lon"

  ## New tag to create
  # tag_key = "s2_cell_id"

  ## Cell level (see https://s2geometry.io/resources/s2cell_statistics.html)
  # cell_level = 9
```

## Example

```diff
- mta,area=llir,id=GO505_20_2704,status=1 lat=40.878738,lon=-72.517572 1560540094
+ mta,area=llir,id=GO505_20_2704,status=1,s2_cell_id=89e8ed4 lat=40.878738,lon=-72.517572 1560540094
```
