---
title: Manage security and authorization
description: >
  Security, access control, and sensitive secret handling are incredibly important
  when handling any sort of sensitive data.
  This section provides information about managing the security of your InfluxDB instance.
weight: 13
menu:
  influxdb_v2:
    name: Manage security
    parent: Administer InfluxDB
influxdb/v2/tags: [security, authentication]
aliases:
  - /influxdb/v2/security/
---

Security, access control, and sensitive secret handling are incredibly important
when handling any sort of sensitive data.
This section provides information about managing the security of your InfluxDB instance.

{{% note %}}
#### InfluxDB 2.x/1.x compatibility

If you [upgraded from 1.x to {{< current-version >}}](/influxdb/v2/upgrade/v1-to-v2/),
use the [`influx v1 auth`](/influxdb/v2/reference/cli/influx/v1/auth/) commands
to manage authorizations for the [1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/).
{{% /note %}}

{{< children >}}
