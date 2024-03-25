---
title: Delete a user
seotitle: Delete a user from InfluxDB
description: Delete a user from InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: Delete a user
    parent: Manage users
weight: 103
aliases:
  - /influxdb/v2/users/delete-user/
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to delete a user.

{{% warn %}}
Deleting a user removes them completely from InfluxDB.
To remove a user from an organization without deleting the user entirely, see
[Remove a member from an organization](/influxdb/v2/admin/organizations/members/remove-member/).
{{% /warn %}}

## Delete a user from the InfluxDB UI

{{% note %}}
Users cannot be deleted from the InfluxDB UI.
{{% /note %}}

## Delete a user using the influx CLI

Use the [`influx user delete` command](/influxdb/v2/reference/cli/influx/user/delete)
to delete a user. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- The user ID _(provided in the output of `influx user list`)_

{{% code-placeholders "USER_ID" %}}
```sh
influx user delete --id USER_ID
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`USER_ID`{{% /code-placeholder-key %}} with
the ID of the user to delete.
