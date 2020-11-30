---
title: Manage users
seotitle: Manage users in InfluxDB
description: Manage users in InfluxDB using the InfluxDB UI or the influx CLI.
influxdb/v2.0/tags: [users, authentication]
menu:
  influxdb_2_0:
    name: Manage users
weight: 11
products: [oss]
---

Users are those with access to InfluxDB.
To grant a user permission to access data, add them as a [member of an organization](/influxdb/v2.0/organizations/members/)
and provide them with an [authentication token](/influxdb/v2.0/security/tokens/).

The following articles walk through managing users.

{{% note %}}
#### InfluxDB 2.0/1.x compatibility
If you [upgraded from 1.x to 2.0](/influxdb/v2.0/upgrade/v1-to-v2/),
use the [`influx v1 auth`](/influxdb/v2.0/reference/cli/influx/v1/auth/) commands
to manage authorizations for the InfluxDB [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
{{% /note %}}

{{< children >}}
