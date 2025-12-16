---
description: "Telegraf plugin for transforming metrics using Tag Limit"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Tag Limit
    identifier: processor-tag_limit
tags: [Tag Limit, "processor-plugins", "configuration", "filtering"]
introduced: "v1.12.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.0/plugins/processors/tag_limit/README.md, Tag Limit Plugin Source
---

# Tag Limit Processor Plugin

This plugin ensures that only a certain number of tags are preserved for any
given metric, and to choose the tags to preserve when the number of tags
appended  by the data source is over the limit.

This can be useful when dealing with output systems (e.g. Stackdriver) that
impose hard limits on the number of tags/labels per metric or where high
levels of cardinality are computationally and/or financially expensive.

**Introduced in:** Telegraf v1.12.0
**Tags:** filtering
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Restricts the number of tags that can pass through this filter and chooses which tags to preserve when over the limit.
[[processors.tag_limit]]
  ## Maximum number of tags to preserve
  limit = 3

  ## List of tags to preferentially preserve
  keep = ["environment", "region"]
```

## Example

```diff
+ throughput month=Jun,environment=qa,region=us-east1,lower=10i,upper=1000i,mean=500i 1560540094000000000
+ throughput environment=qa,region=us-east1,lower=10i 1560540094000000000
```
