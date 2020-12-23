---
title: influx backup
description: The `influx backup` command backs up data stored in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx backup
    parent: influx
weight: 101
influxdb/cloud/tags: [backup]
related:
  - /influxdb/cloud/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
---

{{% note %}}
#### Available with InfluxDB OSS 2.x only
The `influx backup` command works with **InfluxDB OSS 2.x**, but does not work with **InfluxDB Cloud**.
For information about backing up data in InfluxDB Cloud, see
[InfluxDB Cloud durabilty](/influxdb/cloud/reference/internals/durability/) or
[contact InfluxData Support](mailto:support@influxdata.com).
{{% /note %}}

{{< duplicate-oss >}}
