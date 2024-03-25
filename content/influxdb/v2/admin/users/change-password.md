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
to update a password for a user. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- The username (with the `--name, -n` flag) or the user ID (with the `--id, -i` flag).
  View usernames and IDs in the output of `influx user list`.
- _Optional_: the `--password, -p` flag and the new password. If you don't provide a password flag,
  enter the new password when prompted.

##### Update a password

{{% code-placeholders "USERNAME|PASSWORD" %}}
```sh
influx user password \
  --name USERNAME \
  --password PASSWORD
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`USERNAME`{{% /code-placeholder-key %}}:
  The username to change the password for
- {{% code-placeholder-key %}}`PASSWORD`{{% /code-placeholder-key %}}:
  The new password
