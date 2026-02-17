---
description: "Telegraf plugin for collecting metrics from Teamspeak"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Teamspeak
    identifier: input-teamspeak
tags: [Teamspeak, "input-plugins", "configuration", "server"]
introduced: "v1.5.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/inputs/teamspeak/README.md, Teamspeak Plugin Source
---

# Teamspeak Input Plugin

This plugin collects statistics of one or more virtual [Teamspeak](https://www.teamspeak.com)
servers using the `ServerQuery` interface. Currently this plugin only supports
Teamspeak 3 servers.

> [!NOTE]
> For querying external Teamspeak server, make sure to add the Telegraf host
> to the `query_ip_allowlist.txt` file in the Teamspeak Server directory.

**Introduced in:** Telegraf v1.5.0
**Tags:** server
**OS support:** all

[teamspeak]: https://www.teamspeak.com

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Reads metrics from a Teamspeak 3 Server via ServerQuery
[[inputs.teamspeak]]
  ## Server address for Teamspeak 3 ServerQuery
  # server = "127.0.0.1:10011"
  ## Username for ServerQuery
  username = "serverqueryuser"
  ## Password for ServerQuery
  password = "secret"
  ## Nickname of the ServerQuery client
  nickname = "telegraf"
  ## Array of virtual servers
  # virtual_servers = [1]
```

### Teamspeak configuration

For information about how to configure the Teamspeak server take a look at
the [Teamspeak 3 ServerQuery Manual](http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf).

[manual]: http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf

## Metrics

- teamspeak
  - uptime
  - clients_online
  - total_ping
  - total_packet_loss
  - packets_sent_total
  - packets_received_total
  - bytes_sent_total
  - bytes_received_total
  - query_clients_online

### Tags

- The following tags are used:
  - virtual_server
  - name

## Example Output

```text
teamspeak,virtual_server=1,name=LeopoldsServer,host=vm01 bytes_received_total=29638202639i,uptime=13567846i,total_ping=26.89,total_packet_loss=0,packets_sent_total=415821252i,packets_received_total=237069900i,bytes_sent_total=55309568252i,clients_online=11i,query_clients_online=1i 1507406561000000000
```
