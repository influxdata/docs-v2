---
title: View users
seotitle: View users in InfluxDB
description: Review a list of users in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: View users
    parent: Manage users
weight: 102
aliases:
  - /influxdb/v2/users/view-users/
---

Use the `influx` command line interface (CLI) to view users.

## View users using the influx CLI

Use the [`influx user list` command](/influxdb/v2/reference/cli/influx/user/list)
to view users. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.

```sh
influx user list
```

Filtering options such as filtering by username or ID are available.
See the [`influx user list` documentation](/influxdb/v2/reference/cli/influx/user/list)
for information about other available flags.
