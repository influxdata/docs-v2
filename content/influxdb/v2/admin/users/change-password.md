---
title: Change your password
seotitle: Change your password in InfluxDB
description: Change your password in InfluxDB using the influx CLI.
menu:
  influxdb_v2:
    name: Change your password
    parent: Manage users
weight: 105
aliases:
  - /influxdb/v2/users/change-password/
---

Use `influx` command line interface (CLI) to update your password.

{{% note %}}
User passwords cannot be updated in the InfluxDB UI.
{{% /note %}}

## Change your password using the influx CLI

Use the [`influx user password` command](/influxdb/v2/reference/cli/influx/user/password)
to update a password for a user. To update a password, you need the following:

- Username or user ID _(provided in the output of `influx user list`)_
- New password
- [Operator token](/influxdb/v2/security/tokens/#operator-token)

##### Update a password
```sh
# Syntax
influx user password -n <username> -t <token>

# Example
influx user password -n johndoe -t My5uPErSecR37t0k3n
```

When prompted, enter and confirm the new password.
