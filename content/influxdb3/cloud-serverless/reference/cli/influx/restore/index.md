---
title: influx restore
description: The `influx restore` command restores backup data and metadata from an InfluxDB backup directory.
influxdb3/cloud-serverless/tags: [restore]
menu:
  influxdb3_cloud_serverless:
    parent: influx
weight: 101
related:
  - /influxdb3/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb3/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
metadata: [influx CLI 2.0.0+]
updated_in: CLI v2.0.7
---

> [!Note]
> #### Works with InfluxDB OSS 2.x
> 
> The `influx restore` command works with **InfluxDB OSS 2.x**, but does not work with **InfluxDB Cloud**.
> For information about restoring data in InfluxDB Cloud, see
> [InfluxDB Cloud durability](/influxdb3/cloud-serverless/reference/internals/durability/).

{{< duplicate-oss >}}