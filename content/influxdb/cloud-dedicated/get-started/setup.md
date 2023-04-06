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

1.  **Download, install, and configure the `influxctl` CLI**.
    
    The `influxctl` CLI provides a simple way to interact with and manage your
    InfluxDB Cloud Dedicated cluster from a command line.

2.  **Configure the `influxctl` CLI to connect to and authenticate with your dedicated cluster**.

    1.  **Set up a connection profile**.
        Create a file named `config.toml` at the following locations depending on
        your operating system:

        | OS      | Configuration file location                           |
        | :------ | :---------------------------------------------------- |
        | Linux   | `~/.config/influxctl/config.toml`                     |
        | macOS   | `~/Library/Application Support/influxctl/config.toml` |
        | Windows | `%APPDATA%\influxctl\config.toml`                     |

        Add a `default` profile to `config.toml` with the following properties:

        - **account_id**: Your InfluxDB Cloud Dedicated account ID
        - **cluster_id**: Your InfluxDB Cloud Dedicated cluster ID
        - **cluster_url**: Your InfluxDB Cloud Dedicated cluster URL

        ```toml
        [default]
          account_id = "YOUR_ACCOUNT_ID"
          cluster_id = "YOUR_CLUSTER_ID"
          cluster_url = "YOUR_CLUSTER_URL"
        ```

        _You can add multiple profiles to your `config.toml`.
        For more information about `influxctl` profiles, see [...](#)_

    2.  **Authenticate with your cluster**.
        
        The next time you run an `influxctl` CLI command, you will be directed
        to login to Auth0. Use the Auth0 credentials provided to you to login.
        Once successfully authenticated, Auth0 issues a short-lived (1 hour)
        token for the `influxctl` CLI that grants adminstrative access to your
        InfluxDB Cloud Dedicated cluster.

3.  **Create a database**.

    Use the **`influxctl database create` command** to create a database.
    You can use an existing database or create a new one specifically for this
    getting started tutorial. 
    
    Provide the following:

    - Database name (All examples in this tutorial assume a database named
    **"get-started"**).
    - Database retention period as a duration value

    ```sh
    influxctl database create get-started 1d
    ```

4.  **Create a database token**. <span id="create-a-database-token"></span>

    Use the `influxctl token create` command to create a database token with
    read and write permissions on the **get-started** database.
    Provide the following:

    - Permission grants
    - _(Optional)_ Token description

    ```sh
    influxctl token create \
      --read-database=get-started \
      --write-database=get-started \
      "Read/write token for get started database"
    ```


{{< page-nav prev="/influxdb/cloud-dedicated/get-started/" next="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}
