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

1.  {{< req text="(Optional)" color="magenta" >}} **Download, install, and configure the `...` CLI**.
    
    The `influx` CLI provides a simple way to interact with and manage your
    InfluxDB Cloud Dedicated cluster from a command line.
    For detailed installation and setup instructions,
    see [Use the ... CLI](#).

2.  **Create a management token.**
    <span id="create-a-management-token"></span>


3.  **Create a database token**. <span id="create-a-database-token"></span>


4.  {{< req >}} **Create a database**.

    You can use an existing database or create a new one specifically for this
    getting started tutorial. All examples in this tutorial assume a database named
    **"get-started"**.

    Use the **`...` CLI** to [create a database](/influxdb/cloud-dedicated/admin/buckets/create-bucket/).

{{< page-nav prev="/influxdb/cloud-dedicated/get-started/" next="/influxdb/cloud-dedicated/get-started/write/" keepTab=true >}}
