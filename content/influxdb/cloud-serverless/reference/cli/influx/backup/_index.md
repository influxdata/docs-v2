---
title: influx backup
description: The `influx backup` command backs up data stored in InfluxDB.
menu:
  influxdb_cloud_serverless:
    name: influx backup
    parent: influx
weight: 101
influxdb/cloud-serverless/tags: [backup]
related:
  - /influxdb/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/cloud-serverless/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
metadata: [influx CLI 2.0.0+, InfluxDB OSS only]
updated_in: CLI v2.0.2
---

{{% note %}}
#### Works with InfluxDB OSS 2.x

The `influx backup` command works with **InfluxDB OSS 2.x**, but does not work with **InfluxDB Cloud**.
For information about backing up data in InfluxDB Cloud, see
[InfluxDB Cloud Serverless durability](/influxdb/cloud/reference/internals/durability/) or
[contact InfluxData Support](mailto:support@influxdata.com).
{{% /note %}}

{{< duplicate-oss >}}
