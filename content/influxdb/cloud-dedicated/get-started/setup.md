---
title: Set up InfluxDB Cloud Dedicated
seotitle: Set up InfluxDB | Get started with InfluxDB Cloud Dedicated
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB Cloud Dedicated for the "Get started with InfluxDB"
  tutorial and for general use.
menu:
  influxdb_cloud_dedicated:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 3]
related:
  - /influxdb/cloud-dedicated/admin/buckets/
  - /influxdb/cloud-dedicated/reference/cli/influx/
  - /influxdb/cloud-dedicated/reference/api/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

- [Request an InfluxDB Cloud Dedicated cluster](#request-an-influxdb-cloud-dedicated-cluster)
- [Download, install, and configure the influxctl CLI](#download-install-and-configure-the-influxctl-cli)
- [Create a database](#create-a-database)
- [Create a database token](#create-a-database-token)

## Request an InfluxDB Cloud Dedicated cluster

[Contact the InfluxData Sales team]({{< dedicated-link >}}) to request an
InfluxDB Cloud Dedicated cluster.
When your cluster is deployed, your InfluxData account representative provides
the following:

- An **Auth0 login** to authenticate access to your cluster
- Your InfluxDB Cloud Dedicated **account ID**
- Your InfluxDB Cloud Dedicated **cluster ID**
- Your InfluxDB Cloud Dedicated **cluster URL**

## Download, install, and configure the influxctl CLI
    
The [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/)
provides a simple way to manage your InfluxDB Cloud Dedicated cluster from a
command line. It lets you perform administrative tasks such as managing
databases and tokens.

1.  **Download the `influxctl` CLI**.

    _[Contact InfluxData Support](https://support.influxdata.com) for
    information about downloading and installing the `influxctl` CLI._

2.  **Create a connection profile and provide your InfluxDB Cloud Dedicated connection credentials**.
    The `influxctl` CLI uses [connection profiles](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
    to connect to and authenticate with your InfluxDB Cloud Dedicated cluster.

    To create a connection profile, run `influxctl init` to start an interactive
    prompt that creates and stores a connection profile.

    ```sh
    influxctl init
    ```

    Provide the following required credentials:

    - Account ID
    - Cluster ID

    _For more information about `influxctl` profiles, see
    [Configure connection profiles](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)_.

## Create a database

Use the [`influxctl database create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/create/)
to create a database. You can use an existing database or create a new one
specifically for this getting started tutorial.
_Examples in this getting started tutorial assume a database named **"get-started"**._

{{% note %}}
#### Authenticate with your cluster
    
The first time you run an `influxctl` CLI command, you are directed
to login to **Auth0**. Once logged in, Auth0 issues a short-lived (1 hour)
management token for the `influxctl` CLI that grants administrative access
to your InfluxDB Cloud Dedicated cluster.
{{% /note %}}

Provide the following:

- Database name.
- _(Optional)_ Database [retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
  as a duration value.
  If no retention period is specified, the default is infinite.

```sh
influxctl database create \
  --retention-period 1y \
  get-started
```

## Create a database token

Use the [`influxctl token create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/create/)
to create a database token with read and write permissions for your database.

Provide the following:

- Permission grants
  - `--read-database`: Grants read access to a database
  - `--write-database` Grants write access to a database
- Token description

```sh
influxctl token create \
  --read-database get-started \
  --write-database get-started \
  "Read/write token for get-started database"
```

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/" next="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}
