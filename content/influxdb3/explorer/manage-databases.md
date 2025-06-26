---
title: Manage databases with InfluxDB 3 Explorer
seotitle: Manage InfluxDB databases with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to manage databases in an InfluxDB 3 instance.
menu:
  influxdb3_explorer:
    name: Manage databases
weight: 4
related:
  - /influxdb3/core/admin/databases/, Manage databases in InfluxDB 3 Core
  - /influxdb3/enterprise/admin/databases/, Manage databases in InfluxDB 3 Enterprise
---

{{% product-name %}} lets you manage databases in your InfluxDB 3 Core instance
or InfluxDB 3 Enterprise cluster.

> [!Important]
> Using {{% product-name %}} to manage a database in InfluxDB 3 requires that
> Explorer is running in [admin mode](/influxdb3/explorer/install/#run-in-query-or-admin-mode)
> and that the token used in the InfluxDB 3 server configuration is an
> [admin token](/influxdb3/enterprise/admin/tokens/admin/).

To manage databases, navigate to **Manage Databases** in Explorer.
This page provides a list of databases in the connected InfluxDB 3 server that
contains the database name, retention period, and number of tables
(which includes system tables).

## Create a database

1.  On the **Manage Databases** page, click **+ Create New**.
2.  Provide a **Database name**.
    _For information about naming restrictions, see
    [InfluxDB 3 naming restrictions](/influxdb3/enterprise/admin/databases/create/#database-naming-restrictions)._
3.  _(Optional)_ Specify a **Retention Period** for the database.
    This determines how long InfluxDB retains data (based on timestamp) in the
    database before expiring and removing the data. If no retention period is
    specified, InfluxDB does not expire data in the database.

    Set the following:

    - **Retention Period**: The number of time units to retain data.
    - **Unit**: The unit of time to use in the retention period definition.

4.  Click **{{< icon "check" >}} Create Database**.

## Delete a database

1. On the **Manage Databases** page, click **{{< icon "trash" >}}**.
2. Confirm that you want to delete the database.

> [!Caution]
> Deleting a database is a destructive action and cannot be undone.
