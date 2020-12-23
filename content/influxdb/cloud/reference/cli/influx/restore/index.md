---
title: influx restore
description: The `influx restore` command restores backup data and metadata from an InfluxDB backup directory.
influxdb/cloud/tags: [restore]
menu:
  influxdb_cloud_ref:
    parent: influx
weight: 101
related:
  - /influxdb/cloud/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
---

{{% note %}}
#### Available with InfluxDB OSS 2.x only
The `influx restore` command works with **InfluxDB OSS 2.x**, but does not work with **InfluxDB Cloud**.
For information about restoring data in InfluxDB Cloud, see
[InfluxDB Cloud durabilty](/influxdb/cloud/reference/internals/durability/) and
[contact InfluxData Support](mailto:support@influxdata.com).
{{% /note %}}

{{< duplicate-oss >}}
