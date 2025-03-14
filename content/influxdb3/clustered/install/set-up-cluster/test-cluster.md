---
title: Test your InfluxDB Cluster
description: >
  Test to ensure your InfluxDB cluster can write and query data successfully.
menu:
  influxdb3_clustered:
    name: Test your cluster
    parent: Set up your cluster
weight: 250
---

With your InfluxDB cluster deployed and running, test to ensure you can
successfully write and query data from InfluxDB.

1. [Download and install influxctl](#download-and-install-influxctl)
1. [Retrieve your cluster's admin token](#retrieve-your-clusters-admin-token)
1. [Configure influxctl to connect to your cluster](#configure-influxctl-to-connect-to-your-cluster)
1. [Create a new database](#create-a-new-database)
1. [Write test data to the new database](#write-test-data-to-the-new-database)
1. [Query the test data from your database](#query-the-test-data-from-your-database)

## Download and install influxctl

[`influxctl`](/influxdb3/clustered/reference/cli/influxctl/) is a command line tool
that lets you manage, write data to, and query data from your InfluxDB cluster
from your local machine.

<a href="/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl" class="btn" target="_blank">Download and install influxctl</a>

## Retrieve your cluster's admin token

InfluxDB Clustered generates a valid access token (known as the _admin token_)
and stores it as a secret in your cluster's `influxdb` namespace.
During this phase of the installation process, use the admin token with
`influxctl` in lieu of configuring and using an identity provider.

Use `kubectl` to retrieve the admin token from your `influxdb` namespace secret
store and copy it to a file:

```sh
kubectl get secrets/admin-token \
  --template={{.data.token}} \
  --namespace influxdb | base64 -d > token.json
```

## Configure influxctl to connect to your cluster

Create an [`influxctl` connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles)
for your InfluxDB cluster. Connection profiles are stored in a `config.toml`
file on your local machine and contain the credentials necessary to connect to
and authorize with your InfluxDB cluster.

1.  Create a file named `config.toml` with the following contents:

    {{< code-placeholders "INFLUXDB_(HOST|PORT)|DIRECTORY_PATH" >}}
```toml
[[profile]]
  name = "default"
  product = "clustered"
  host = "{{< influxdb/host >}}"
  port = "INFLUXDB_PORT"

  [profile.auth.token]
    token_file = "/DIRECTORY_PATH/token.json"
```
    {{< /code-placeholders >}}

    In the example above, replace the following:

    - {{% code-placeholder-key %}}`INFLUXDB_PORT`{{% /code-placeholder-key %}}:
      The port to use to connect to your InfluxDB cluster.
    - {{% code-placeholder-key %}}`DIRECTORY_PATH`{{% /code-placeholder-key %}}:
      The directory path to your admin token file, `token.json`.

    > [!Note]
    > To set your InfluxDB cluster host, click
    > **{{< icon "cog" "v2" >}} Set InfluxDB cluster URL** below the codeblock above
    > and provide your cluster's host. This will update your cluster's host in all
    > code examples.

2.  Make this configuration file available to `influxctl` in one of the following
    ways:

    - Include the `--config` flag with all `influxctl` commands to specify the
      filepath of your `config.toml`.
    - Store the `config.toml` file at the
      [default location](/influxdb3/clustered/reference/cli/influxctl/#default-connection-profile-store-location) 
      that `influxctl` expects to find connection profiles based on your
      operating system. If your connection profile is in the default location,
      you do not need to include the `--config` flag with your `influxctl` commands.

> [!Note]
> #### Connection configuration examples 
> 
> In the examples below, replace {{% code-placeholder-key %}}`CONFIG_PATH`{{% /code-placeholder-key %}}
> with the directory path to your connection configuration file. If you placed
> your configuration file in the default location for your operating system, remove
> `--config /CONFIG_PATH/config.toml` from the example commands before running them.

## Create a new database

Use [`influxctl database create`](/influxdb3/clustered/reference/cli/influxctl/database/create/)
to create a new database named `testdb`. Include the following:

- _(Optional)_ The path to your connection profile configuration file.
- The database name--`testdb`.

{{% code-placeholders "CONFIG_PATH" %}}
```sh
influxctl --config /CONFIG_PATH/config.toml database create testdb
```
{{% /code-placeholders %}}

## Write test data to the new database

Use [`influxctl write`](/influxdb3/clustered/reference/cli/influxctl/write/) to
write the following test data to your `testdb` database. Provide the following:

- _(Optional)_ The path to your connection profile configuration file.
- The database name--`testdb`.
- [Line protocol](/influxdb3/clustered/reference/syntax/line-protocol/) to write
  to InfluxDB.

{{% influxdb/custom-timestamps %}}

{{% code-placeholders "CONFIG_PATH" %}}
```bash
influxctl --config /CONFIG_PATH/config.toml write \
  --database testdb \
  "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000000000000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000000000000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600000000000
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600000000000
"
```
{{% /code-placeholders %}}

{{% /influxdb/custom-timestamps %}}

## Query the test data from your database

Use [`influxctl query`](/influxdb3/clustered/reference/cli/influxctl/query/) to
query the test data from your `testdb` database. Provide the following:

- _(Optional)_ The path to your connection profile configuration file.
- The database name--`testdb`.
- The SQL query to execute.

{{% code-placeholders "CONFIG_PATH" %}}
```bash
influxctl --config /CONFIG_PATH/config.toml query \
  --database testdb \
  "SELECT * FROM home"
```
{{% /code-placeholders %}}


This should return results similar to:

{{% influxdb/custom-timestamps %}}

|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   0 | 35.9 | Living Room | 21.1 | 2022-01-01T08:00:00Z |
|   0 | 35.9 | Kitchen     |   21 | 2022-01-01T08:00:00Z |
|   0 | 21.4 | Living Room | 21.4 | 2022-01-01T09:00:00Z |
|   0 | 36.2 | Kitchen     |   23 | 2022-01-01T09:00:00Z |

{{% /influxdb/custom-timestamps %}}

If the query successfully returns data, your InfluxDB cluster is set up and functional.

{{< page-nav prev="/influxdb3/clustered/install/set-up-cluster/test-cluster/" prevText="Test your cluster" next="/influxdb3/clustered/install/customize-cluster/" nextText="Phase 2: Customize your cluster">}}

