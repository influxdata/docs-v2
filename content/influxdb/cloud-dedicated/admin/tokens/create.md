---
title: Create a token
description: >
  Use the [`influxctl token create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/)
  to create a database token in your InfluxDB Cloud Dedicated cluster.
  Provide a token description and grant permissions to databases.
menu:
  influxdb_cloud_dedicated:
    parent: Manage tokens
weight: 201
list_code_example: |
  ```sh
  influxctl token create \
    --write-database <DATABASE_NAME> \
    --read-database <DATABASE_NAME> \
    <TOKEN_DESCRIPTION>
  ```
---

Use the [`influxctl token create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/)
to create a token that grants access to databases in your InfluxDB Cloud Dedicated cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl token create` command and provide the following:

    - Token permissions (read and write per database)
      - `--read-database`: Grant read permissions to a database
      - `--write-database`: Grant write permissions to a database
    - Token description

```sh
influxctl token create \
  --read-database <DATABASE_NAME> \
  --write-database <DATABASE_NAME> \
  <TOKEN_DESCRIPTION>
```

The command returns the token ID and the token string.
**This is the only time the token string is available in plain text.**

InfluxDB might take some time to synchronize new tokens.
If a new token doesn't immediately work for querying or writing, wait a few seconds and try again.

{{% note %}}
#### Store secure tokens in a secret store

Token strings are returned _only_ on token creation.
We recommend storing database tokens in a **secure secret store**.
For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).
{{% /note %}}

#### Example token creation commands

{{< expand-wrapper >}}
{{% expand "Create a token with read and write access to a database" %}}

```sh
influxctl token create \
  --read-database mydb \
  --write-database mydb \
  "Read/write token for mydb"
```

{{% /expand %}}
{{% expand "Create a token with read-only access to a database" %}}

```sh
influxctl token create \
  --read-database mydb \
  "Read-only token for mydb"
```

{{% /expand %}}
{{% expand "Create a token with read-only access to multiple database" %}}

```sh
influxctl token create \
  --read-database mydb1 \
  --read-database mydb2 \
  "Read-only token for mydb1 and mydb2"
```

{{% /expand %}}
{{% expand "Create a token with mixed permissions on multiple database" %}}

```sh
influxctl token create \
  --read-database mydb1 \
  --read-database mydb2 \
  --write-database mydb2 \
  "Read-only on mydb1, Read/write on mydb2"
```

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
#### Tokens cannot be updated

Once created, token permissions cannot be updated.
If you need a token with different permissions, create a new token with the
appropriate permissions.
{{% /note %}}
