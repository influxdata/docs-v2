---
title: Manage databases with InfluxDB 3 Explorer
seotitle: Manage InfluxDB databases with InfluxDB 3 Explorer
menu:
  influxdb3_explorer:
    name: Manage Databases
draft: true
---

<!--
  MARKED AS DRAFT.
  SAVING CONTENT FOR A FUTURE PR.
 -->

## View databases

## Create a database

> [!Important]
> Using {{% product-name %}} to create a database in InfluxDB 3 requires that
> Explorer is running in [admin mode](/influxdb3/explorer/install/#run-in-query-or-admin-mode)
> and that the token used in the InfluxDB 3 server configuration is an
> [admin token](/influxdb3/enterprise/admin/tokens/admin/).

To use {{% product-name %}} to create a new databases in an InfluxDB 3 instance:

1.  Navigate to **Manage Databases**.
2.  Click **+ Create New**.
3.  Provide a **Database name**.
    _For information about naming restrictions, see
    [InfluxDB 3 naming restrictions](/influxdb3/enterprise/admin/databases/create/#database-naming-restrictions)._
4.  _(Optional)_ Specify a **Retention Period** for the database.
    This determines how long InfluxDB retains data (based on timestamp) in the
    database before expiring and removing the data. If no retention period is
    specified, InfluxDB does not expire data in the database.

    Set the following:

    - **Retention Period**: The number of time units to retain data.
    - **Unit**: The unit of time to use in the retention period definition .

5.  Click **{{< icon "check" >}} Create Database**.

## Delete a database