---
description: "Telegraf plugin for transforming metrics using Port Name Lookup"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Port Name Lookup
    identifier: processor-port_name
tags: [Port Name Lookup, "processor-plugins", "configuration", "annotation"]
introduced: "v1.15.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/processors/port_name/README.md, Port Name Lookup Plugin Source
---

# Port Name Lookup Processor Plugin

This plugin allows converting a tag or field containing a well-known port,
either a number (e.g. `80`) for TCP ports or a port and protocol
(e.g. `443/tcp`), to the registered service name.

**Introduced in:** Telegraf v1.15.0
**Tags:** annotation
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Given a tag/field of a TCP or UDP port number, add a tag/field of the service name looked up in the system services file
[[processors.port_name]]
  ## Name of tag holding the port number
  # tag = "port"
  ## Or name of the field holding the port number
  # field = "port"

  ## Name of output tag or field (depending on the source) where service name will be added
  # dest = "service"

  ## Default tcp or udp
  # default_protocol = "tcp"

  ## Tag containing the protocol (tcp or udp, case-insensitive)
  # protocol_tag = "proto"

  ## Field containing the protocol (tcp or udp, case-insensitive)
  # protocol_field = "proto"
```

## Example

```diff
- measurement,port=80 field=123 1560540094000000000
+ measurement,port=80,service=http field=123 1560540094000000000
```
