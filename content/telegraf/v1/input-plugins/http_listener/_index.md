---
description: "Telegraf plugin for collecting metrics from HTTP Listener"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: HTTP Listener
    identifier: input-http_listener
tags: [HTTP Listener, "input-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# HTTP Listener Input Plugin

This service input plugin that listens for requests sent according to the
[InfluxDB HTTP API](https://docs.influxdata.com/influxdb/v1.8/guides/write_data/). The intent of the plugin is to allow
Telegraf to serve as a proxy/router for the `/write` endpoint of the InfluxDB
HTTP API.

> [!NOTE]
> This plugin was renamed to [`influxdb_listener`]() in v1.9
> and is deprecated since then. If you wish to receive general metrics via HTTP
> it is recommended to use the [`http_listener_v2`]() plugin
> instead.

**introduces in:** Telegraf v1.30.0
**deprecated in:** Telegraf v1.9.0
**removal in:** Telegraf v1.35.0
**tags:** servers, web
**supported OS:** all

[influxdb_http_api]: https://docs.influxdata.com/influxdb/v1.8/guides/write_data/
[influxdb_listener]: /plugins/inputs/influxdb_listener/README.md
[http_listener_v2]: /plugins/inputs/http_listener_v2/README.md
