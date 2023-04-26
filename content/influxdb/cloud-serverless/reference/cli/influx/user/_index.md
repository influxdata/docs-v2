---
title: influx user
description: The `influx user` command and its subcommands manage user information in InfluxDB OSS.
menu:
  influxdb_cloud_serverless:
    name: influx user
    parent: influx
weight: 101
influxdb/cloud-serverless/tags: [users]
cascade:
  related:
    - /influxdb/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  metadata: [influx CLI 2.0.0+, InfluxDB OSS only]
  prepend:
    block: note
    content: |
      #### Works with InfluxDB OSS 2.x

      The `influx user` command and its subcommands manage **InfluxDB OSS 2.x** users,
      but do not manage users in **InfluxDB Cloud**.
      Use the InfluxDB Cloud UI to manage account information.
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/
---

{{< duplicate-oss >}}
