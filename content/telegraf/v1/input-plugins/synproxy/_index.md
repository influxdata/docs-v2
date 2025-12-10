---
description: "Telegraf plugin for collecting metrics from Synproxy"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Synproxy
    identifier: input-synproxy
tags: [Synproxy, "input-plugins", "configuration", "network"]
introduced: "v1.13.0"
os_support: "linux"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.0/plugins/inputs/synproxy/README.md, Synproxy Plugin Source
---

# Synproxy Input Plugin

This plugin gathers metrics about the Linux netfilter's [synproxy](https://wiki.nftables.org/wiki-nftables/index.php/Synproxy)
module used for mitigating SYN attacks.

**Introduced in:** Telegraf v1.13.0
**Tags:** network
**OS support:** linux

[synproxy]: https://wiki.nftables.org/wiki-nftables/index.php/Synproxy

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Get synproxy counter statistics from procfs
# This plugin ONLY supports Linux
[[inputs.synproxy]]
  # no configuration
```

## Troubleshooting

Execute the following CLI command in Linux to test the synproxy counters:

```sh
cat /proc/net/stat/synproxy
```

## Metrics

The following synproxy counters are gathered

- synproxy
  - fields:
    - cookie_invalid (uint32, packets, counter) - Invalid cookies
    - cookie_retrans (uint32, packets, counter) - Cookies retransmitted
    - cookie_valid (uint32, packets, counter) - Valid cookies
    - entries (uint32, packets, counter) - Entries
    - syn_received (uint32, packets, counter) - SYN received
    - conn_reopened (uint32, packets, counter) - Connections reopened

## Example Output

This section shows example output in Line Protocol format.

```text
synproxy,host=Filter-GW01,rack=filter-node1 conn_reopened=0i,cookie_invalid=235i,cookie_retrans=0i,cookie_valid=8814i,entries=0i,syn_received=8742i 1549550634000000000
```
