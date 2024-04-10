---
title: influx delete
description: The `influx delete` command deletes points from an InfluxDB bucket.
menu:
  influxdb_cloud_serverless:
    name: influx delete
    parent: influx
weight: 101
influxdb/cloud-serverless/tags: [delete]
related:
  - /influxdb/cloud-serverless/write-data/delete-data/
  - /influxdb/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
metadata: [influx CLI 2.0.3+]
updated_in: CLI v2.2.0
---

{{% warn %}}
#### InfluxDB Cloud Serverless does not support data deletion

InfluxDB Cloud Serverless does not currently support deleting data.
This command is only supported when used with **InfluxDB OSS v2** and
**InfluxDB Cloud (TSM)**.
{{% /warn %}}

{{< duplicate-oss >}}
