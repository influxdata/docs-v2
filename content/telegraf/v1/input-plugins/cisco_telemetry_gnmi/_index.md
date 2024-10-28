---
description: "Telegraf plugin for collecting metrics from Cisco GNMI Telemetry"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Cisco GNMI Telemetry
    identifier: input-cisco_telemetry_gnmi
tags: [Cisco GNMI Telemetry, "input-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Cisco GNMI Telemetry Input Plugin

Cisco GNMI Telemetry input plugin consumes telemetry data similar to the GNMI specification.
This GRPC-based protocol can utilize TLS for authentication and encryption.
This plugin has been developed to support GNMI telemetry as produced by Cisco IOS XR (64-bit) version 6.5.1 and later.

> [!NOTE]
> The `inputs.cisco_telemetry_gnmi` plugin was renamed to [`gmni`]()
> in v1.15.0 to better reflect its general support for gNMI devices.

**introduces in:** Telegraf v1.11.0
**deprecated in:** Telegraf v1.15.0
**removal in:** Telegraf v1.35.0
**tags:** networking
**supported OS:** all

[gnmi]: /plugins/inputs/gnmi/README.md
