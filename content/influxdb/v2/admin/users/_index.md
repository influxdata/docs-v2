---
title: Manage users
seotitle: Manage users in InfluxDB
description: Manage users in InfluxDB using the InfluxDB UI or the influx CLI.
influxdb/v2/tags: [users, authentication]
menu:
  influxdb_v2:
    name: Manage users
    parent: Administer InfluxDB
weight: 11
aliases:
  - /influxdb/v2/users/
---

Users are those with access to InfluxDB.
To grant a user permission to access data, add them as a
[member of an organization](/influxdb/v2/admin/organizations/members/)
and provide them with an [API token](/influxdb/v2/security/tokens/).

The following articles walk through managing users.

{{% note %}}
#### InfluxDB 2.x/1.x compatibility
If you [upgraded from 1.x to {{< current-version >}}](/influxdb/v2/upgrade/v1-to-v2/),
use the [`influx v1 auth`](/influxdb/v2/reference/cli/influx/v1/auth/) commands
to manage authorizations for the InfluxDB [1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/).
{{% /note %}}

{{< children >}}
