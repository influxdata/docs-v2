---
title: influx setup
description: >
  The `influx setup` command walks through the initial InfluxDB OSS setup process,
  creating a default user, organization, and bucket.
menu:
  influxdb_cloud_ref:
    name: influx setup
    parent: influx
weight: 101
influxdb/cloud/tags: [get-started]
related:
  - /influxdb/cloud/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/setup/
---

{{% note %}}
#### Available with InfluxDB OSS 2.x only
The `influx setup` command initiates the setup process for **InfluxDB OSS 2.x** instances.
The command does not work with **InfluxDB Cloud**.
{{% /note %}}

{{< duplicate-oss >}}
