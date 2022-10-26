---
title: Set up InfluxDB
seotitle: Get started setting up InfluxDB
list_title: Set up InfluxDB
description: >
  ...
menu:
  influxdb_2_4:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 5]
---

## Set up InfluxDB

1.  **Download and install InfluxDB**.

    Installation instructions depend on your
    operating system. For detailed installation and setup instructions, see
    [Install InfluxDB](/influxdb/v2.4/install/).

    {{% note %}}
Many of the set up instructions provided below are also covered in the InfluxDB
installation documentation. If you've already installed and setup both InfluxDB

    {{% /note %}}

2.  **Start the InfluxDB service**.

    ```sh
    influxd
    ```

    {{% note %}}
#### Configure InfluxDB

There are multiple ways to custom-configure InfluxDB.
For information about what configuration options are available and how to set them,
see [InfluxDB configuration options](/influxdb/v2.4/reference/config-options/).
    {{% /note %}}

3.  (_Optional_) **Download, install, and configure the `influx` CLI**.
    
    The `influx` CLI provides a simple way to interact with InfluxDB from a 
    command line. For detailed installation and setup instructions,
    see [Use the influx CLI](/influxdb/v2.4/tools/influx-cli/).

{{< page-nav prev="/influxdb/v2.4/get-started/" next="/influxdb/v2.4/get-started/write/" >}}

<!-- 
*Note:** To run InfluxDB, start the `influxd` daemon ([InfluxDB service](/influxdb/v2.4/reference/cli/influxd/)) using the [InfluxDB command line interface](/influxdb/v2.4/reference/cli/influx/). Once you've started the `influxd` daemon, use `localhost:8086` to log in to your InfluxDB instance.

To start InfluxDB, do the following:
  1. Open a terminal.
  2. Type `influxd` in the command line.

```sh
influxd
```
-->