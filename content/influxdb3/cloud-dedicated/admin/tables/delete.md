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
  - /influxdb3/cloud-dedicated/admin/tables/undelete/
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/
---

Use the Admin UI or the [`influxctl table delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/delete/)
to delete a table from a database in your {{< product-name omit=" Cluster" >}} cluster.

> [!Warning]
> #### Wait before writing to a new table with the same name
>
> After deleting a table from your {{% product-name omit=" Cluster" %}}
> cluster, you can reuse the name to create a new table, but **wait two to
> three minutes** after deleting the previous table before writing to the new
> table to allow write caches to clear.

> [!Note]
> #### Deleted tables may be able to be restored
>
> Deleted tables may be able to be [restored](/influxdb3/cloud-dedicated/admin/tables/undelete/)
> within approximately 7 days of deletion.

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
#### Pause writes before deleting a table

{{% product-name %}} creates tables implicitly using table names specified in
line protocol written to the databases.
To prevent the deleted table from being immediately recreated by incoming write requests,
pause all write requests to the table before deleting it.
{{% /note %}}
