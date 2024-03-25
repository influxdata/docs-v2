---
title: Create a user
seotitle: Create a user in InfluxDB
description: Create a user in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: Create a user
    parent: Manage users
weight: 101
aliases:
  - /influxdb/v2/users/create-user
---

Use the `influx` command line interface (CLI) to create a user.

{{% note %}}
Additional users cannot be created in the InfluxDB UI.
{{% /note %}}

To create a new user, you must have an [operator token](/influxdb/v2/reference/glossary/#token).
For more information, see how to [create an operator token](/influxdb/v2/admin/tokens/create-token/#create-an-operator-token).
Use the [`influx user create` command](/influxdb/v2/reference/cli/influx/user/create)
and provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- The [organization name or ID](/influxdb/v2/admin/organizations/view-orgs/) to
  add the new user to.
- A username for the new user with the `--name, -n` flag.
- _Optional_: the `--password, -p` flag and a password for the user. If you don't provide a password, the new user will be prompted to provide one.

{{< cli/influx-creds-note >}}

{{% code-placeholders "(USER|ORG)_(NAME|PASSWORD)" %}}
```sh
influx user create \
  --org ORG_NAME \
  --name USER_NAME \
  --password USER_PASSWORD
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}:
  The name of the organization to add the new user to
- {{% code-placeholder-key %}}`USER_NAME`{{% /code-placeholder-key %}}:
  The username of the new user
- {{% code-placeholder-key %}}`USER_PASSWORD`{{% /code-placeholder-key %}}:
  The password for the new user
