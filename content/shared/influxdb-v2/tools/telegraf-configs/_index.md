---
title: Telegraf configurations
description: >
  InfluxDB OSS lets you automatically generate Telegraf configurations or upload custom
  Telegraf configurations that collect metrics and write them to InfluxDB OSS.
weight: 101
menu:
  influxdb_v2:
    parent: Tools & integrations
influxdb/v2/tags: [telegraf]
aliases:
  - /influxdb/v2/telegraf-configs/
related:
  - /influxdb/v2/write-data/no-code/use-telegraf/manual-config/
  - /influxdb/v2/write-data/no-code/use-telegraf/auto-config/
---

InfluxDB lets you automatically generate Telegraf configurations or upload custom
Telegraf configurations that collect metrics and write them to InfluxDB.
Telegraf retrieves configurations from InfluxDB on startup.

## Use InfluxDB Telegraf configurations
With a Telegraf configuration stored in InfluxDB, the `telegraf` agent can retrieve
the configuration from an InfluxDB HTTP(S) endpoint.

- Ensure Telegraf has network access to InfluxDB (OSS or Cloud).
- Start the `telegraf` agent using the `--config` flag to provide the URL of the
  InfluxDB Telegraf configuration. For example:

    ```sh
    telegraf --config http://localhost:8086/api/v2/telegrafs/<telegraf-config-id>
    ```

{{% note %}}
_[Setup instructions](/influxdb/v2/tools/telegraf-configs/view/#view-setup-instructions) for
each Telegraf configuration are provided in the InfluxDB UI._
{{% /note %}}

## Manage Telegraf configurations

{{< children >}}
