---
title: Delete a table
description: >
  Use the Admin UI or the [`influxctl table delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/)
  to delete a table from a database in your {{< product-name omit=" Cluster" >}} cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage tables
weight: 203
list_code_example: |
  ```sh
  influxctl table delete <DATABASE_NAME> <TABLE_NAME>
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/
---

Use the Admin UI or the [`influxctl table delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/)
to delete a table from a database in your {{< product-name omit=" Cluster" >}} cluster.

> [!Warning]
> Deleting a table is irreversible. Once a table is deleted, all data stored in
> that table is permanently removed and cannot be recovered.

Provide the following arguments:

- **Database name**: Name of the database that contains the table to delete
- **Table name**: Name of the table to delete

{{% code-placeholders "DATABASE_NAME|TABLE_NAME" %}}
```sh
influxctl table delete DATABASE_NAME TABLE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name of the database that contains the table to delete
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: Name of the table to delete

When prompted, enter `y` to confirm the deletion.

{{% note %}}
#### Wait before reusing a deleted table name

After deleting a table, wait a few minutes before attempting to create a new
table with the same name to ensure the deletion process has fully completed.

{{% product-name %}} creates tables implicitly using table names specified in
line protocol written to the databases. To prevent the deleted table from being
immediately recreated by incoming write requests, pause all write requests to
the table before deleting it.
{{% /note %}}
