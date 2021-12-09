---
title: Manage security and authorization
description: >
  Security, access control, and sensitive secret handling are incredibly important
  when handling any sort of sensitive data.
  This section provides information about managing the security of your InfluxDB instance.
weight: 12
menu:
  influxdb_2_1:
    name: Security & authorization
influxdb/v2.1/tags: [security, authentication]
---

Security, access control, and sensitive secret handling are incredibly important
when handling any sort of sensitive data.
This section provides information about managing the security of your InfluxDB instance.

{{% note %}}
#### InfluxDB 2.x/1.x compatibility
If you [upgraded from 1.x to {{< current-version >}}](/influxdb/v2.1/upgrade/v1-to-v2/),
use the [`influx v1 auth`](/influxdb/v2.1/reference/cli/influx/v1/auth/) commands
to manage authorizations for the [1.x compatibility API](/influxdb/v2.1/reference/api/influxdb-1x/).
{{% /note %}}

{{< children >}}
