---
title: Update a user
seotitle: Update a user in InfluxDB
description: Update a user in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: Update a user
    parent: Manage users
weight: 103
aliases:
  - /influxdb/v2/users/update-user/
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to update a user.

## Update a user in the InfluxDB UI

{{% note %}}
User information cannot be updated in the InfluxDB UI.
{{% /note %}}

## Update a user using the influx CLI

Use the [`influx user update` command](/influxdb/v2/reference/cli/influx/user/update)
to update a user. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- The user ID _(provided in the output of `influx user list`)_ using the `--id, -i` flag.
- The new username for the user using the `--name, -n` flag.

##### Update the name of a user

{{% code-placeholders "USER_ID|NEW_USERNAME" %}}
```sh
influx user update \
  --id USER_ID \
  --name NEW_USERNAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`USER_ID`{{% /code-placeholder-key %}}:
  The ID of the user to update
- {{% code-placeholder-key %}}`NEW_USERNAME`{{% /code-placeholder-key %}}:
  The new username for the user
