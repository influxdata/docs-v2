---
title: influx export
description: The `influx export` command exports existing resources as an InfluxDB template.
menu:
  influxdb_cloud_iox:
    parent: influx
weight: 101
cascade:
  related:
    - /influxdb/cloud/influxdb-templates/create/
    - /influxdb/cloud-iox/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
    - /influxdb/cloud-iox/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  metadata: [influx CLI 2.0.0+]
  prepend:
    block: warn
    content: |
      #### Not supported in InfluxDB IOx-powered organizations

      While this command is included in the `influx` CLI, this functionality is
      not available in InfluxDB Cloud organizations powered by the InfluxDB IOx
      storage engine.
---

{{< duplicate-oss >}}
