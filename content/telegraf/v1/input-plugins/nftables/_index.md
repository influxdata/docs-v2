---
description: "Telegraf plugin for collecting metrics from Nftables"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Nftables
    identifier: input-nftables
tags: [Nftables, "input-plugins", "configuration", "network", "system"]
introduced: "v1.37.0"
os_support: "linux"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/inputs/nftables/README.md, Nftables Plugin Source
---

# Nftables Plugin

This plugin gathers packets and bytes counters for rules within
Linux's [nftables](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page) firewall.

> [!IMPORTANT]
> Rules are identified by the associated comment so those **comments have to be unique**!
> Rules without comment are ignored.

**Introduced in:** Telegraf v1.37.0
**Tags:** network, system
**OS support:** linux

[nftables]: https://wiki.nftables.org/wiki-nftables/index.php/Main_Page

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
[[inputs.nftables]]
  ## Use the specified binary which will be looked-up in PATH
  # binary = "nft"

  ## Use sudo for command execution, can be restricted to "nft --json list table"
  # use_sudo = false

  ## Tables to monitor containing both a counter and comment declaration
  # tables = [ "filter" ]
```

Since telegraf will fork a process to run nftables, `AmbientCapabilities` is
required to transmit the capabilities bounding set to the forked process.

### Using sudo

You may edit your sudo configuration with the following:

```sudo
telegraf ALL=(root) NOPASSWD: /usr/bin/nft *
```

## Metrics

* nftables
  * tags:
    * table
    * chain
    * rule -- comment associated to the rule
  * fields:
    * pkts (integer, count)
    * bytes (integer, bytes)

## Example Output

```text
> nftables,chain=incoming,host=my_hostname,rule=comment_val_1,table=filter bytes=66435845i,pkts=133882i 1757367516000000000
> nftables,chain=outgoing,host=my_hostname,rule=comment_val2,table=filter bytes=25596512i,pkts=145129i 1757367516000000000
```
