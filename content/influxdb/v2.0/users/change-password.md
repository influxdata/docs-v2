---
title: Change your password
seotitle: Change your password in InfluxDB
description: Change your password in InfluxDB using the influx CLI.
menu:
  influxdb_2_0:
    name: Change your password
    parent: Manage users
weight: 105
---

Use `influx` command line interface (CLI) to update your password.

{{% note %}}
User passwords cannot be updated in the InfluxDB UI.
{{% /note %}}

## Change your password using the influx CLI

Use the [`influx user password` command](/influxdb/v2.0/reference/cli/influx/user/password)
to update a password for a user. To update a password, you need the following:

- Username or user ID _(provided in the output of `influx user list`)_
- New password

##### Update a password
```sh
# Syntax
influx user password -n <username>

# Example
influx user password -n johndoe
```

When prompted, enter and confirm the new password.
