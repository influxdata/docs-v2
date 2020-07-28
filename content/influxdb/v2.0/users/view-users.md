---
title: View users
seotitle: View users in InfluxDB
description: Review a list of users in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_0:
    name: View users
    parent: Manage users
weight: 102
aliases:
  - /v2.0/users/view-users/
products: [oss]
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view users.

## View users in the InfluxDB UI

{{% note %}}
There is no list of users in the InfluxDB UI.
{{% /note %}}

## View users using the influx CLI

Use the [`influx user list` command](/v2.0/reference/cli/influx/user/list)
to view users.

```sh
influx user list
```

Filtering options such as filtering by username or ID are available.
See the [`influx user list` documentation](/v2.0/reference/cli/influx/user/list)
for information about other available flags.
