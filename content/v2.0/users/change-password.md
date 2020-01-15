---
title: Change your password
seotitle: Change your password in InfluxDB
description: Change your password in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Change your password
    parent: Manage users
weight: 105
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to update your password.

## Change your password in the InfluxDB UI

{{% note %}}
User passwords cannot be updated in the InfluxDB UI.
{{% /note %}}

## Change your password using the influx CLI

Use the [`influx user password` command](/v2.0/reference/cli/influx/user/password)
to update a password for a user. To update a password, you need the following:

- Username or user ID _(provided in the output of `influx user find`)_
- New password

##### Update a password
```sh
# Pattern
influx user password -n <username>

# Example
influx user password -n johndoe
```

When prompted, enter and confirm the new password.
