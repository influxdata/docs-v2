---
title: Upgrade from InfluxDB 1.x to InfluxDB 2.0
description: >
  Upgrade from InfluxDB 1.x to InfluxDB 2.0.
menu:
  influxdb_2_0_ref:
    parent: Upgrade InfluxDB
    name: Upgrade from InfluxDB 1.x to InfluxDB 2.0
weight: 9
---

Use the `influxd upgrade` command to upgrade InfluxDB 1.x to InfluxDB 2.0.
This command copies all data stored in 1.x [databases](/influxdb/v1.8/concepts/glossary/#database) and
[retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp)
to 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).

{{% warn %}}
Back up all data before upgrading with `influx upgrade`.
{{% /warn %}}

1. [Download the InfluxDB OSS 2.0rc](https://portal.influxdata.com/downloads/),
   unpackage the InfluxDB binaries, and then place them in your `$PATH`.
2. Stop your running InfluxDB 1.x instance.
3. If your configuration file is at the default location (`~/.influxdbv2/configs`), run:

    ```sh
    influxd upgrade
    ```
     Otherwise, run:
    ```sh
    influxd upgrade --config <path to config file>
    ```
    
4. Follow the prompts to set up a new InfluxDB 2.0 instance.

For more information on upgrading, including how to handle non-standard installations, see [`influxd upgrade`](/influxdb/v2.0/reference/cli/influxd/upgrade/).
