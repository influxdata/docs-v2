---
title: influx ping
description: >
  The `influx ping` command checks the health of a running InfluxDB instance by
  querying the `/health` endpoint.
menu:
  influxdb_cloud_ref:
    name: influx ping
    parent: influx
weight: 101
influxdb/cloud/tags: [ping, health]
related:
  - /influxdb/cloud/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/cloud/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

{{% note %}}
#### Available with InfluxDB OSS 2.x only
The `influx ping` command works with **InfluxDB OSS 2.x**, but does not work with **InfluxDB Cloud**.
{{% /note %}}

{{< duplicate-oss >}}
