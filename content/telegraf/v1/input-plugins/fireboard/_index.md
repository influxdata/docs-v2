---
description: "Telegraf plugin for collecting metrics from Fireboard"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Fireboard
    identifier: input-fireboard
tags: [Fireboard, "input-plugins", "configuration", "iot"]
introduced: "v1.12.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/inputs/fireboard/README.md, Fireboard Plugin Source
---

# Fireboard Input Plugin

This plugin gathers real-time temperature data from [fireboard](https://www.fireboard.com)
thermometers.

> [!NOTE]
> You will need to sign up to for the [Fireboard REST API](https://docs.fireboard.io/reference/restapi.html) in order to use
> this plugin.

**Introduced in:** Telegraf v1.12.0
**Tags:** iot
**OS support:** all

[fireboard]: https://www.fireboard.com
[api]: https://docs.fireboard.io/reference/restapi.html

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read real time temps from fireboard.io servers
[[inputs.fireboard]]
  ## Specify auth token for your account
  auth_token = "invalidAuthToken"
  ## You can override the fireboard server URL if necessary
  # url = https://fireboard.io/api/v1/devices.json
  ## You can set a different http_timeout if you need to
  ## You should set a string using an number and time indicator
  ## for example "12s" for 12 seconds.
  # http_timeout = "4s"
```

### auth_token

In lieu of requiring a username and password, this plugin requires an
authentication token that you can generate using the [Fireboard REST
API](https://docs.fireboard.io/reference/restapi.html#Authentication).

### url

While there should be no reason to override the URL, the option is available
in case Fireboard changes their site, etc.

### http_timeout

If you need to increase the HTTP timeout, you can do so here. You can set this
value in seconds. The default value is four (4) seconds.

## Metrics

The Fireboard REST API docs have good examples of the data that is available,
currently this input only returns the real time temperatures. Temperature
values are included if they are less than a minute old.

- fireboard
  - tags:
    - channel
    - scale (Celcius; Fahrenheit)
    - title (name of the Fireboard)
    - uuid (UUID of the Fireboard)
  - fields:
    - temperature (float, unit)

## Example Output

This section shows example output in Line Protocol format.  You can often use
`telegraf --input-filter <plugin-name> --test` or use the `file` output to get
this information.

```text
fireboard,channel=2,host=patas-mbp,scale=Fahrenheit,title=telegraf-FireBoard,uuid=b55e766c-b308-49b5-93a4-df89fe31efd0 temperature=78.2 1561690040000000000
```
