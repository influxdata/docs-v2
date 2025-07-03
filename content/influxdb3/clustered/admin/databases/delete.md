---
title: Delete a database
description: >
  Use the [`influxctl database delete` command](/influxdb3/clustered/reference/cli/influxctl/database/delete/)
  to delete a database from your InfluxDB cluster.
  Provide the name of the database you want to delete.
menu:
  influxdb3_clustered:
    parent: Manage databases
weight: 203
list_code_example: |
  ```sh
  influxctl database delete <DATABASE_NAME>
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/database/delete/
---

Use the [`influxctl database delete` command](/influxdb3/clustered/reference/cli/influxctl/database/delete/)
to delete a database from your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl database delete` command and provide the following:

    - The name of the database to delete

3.  Confirm that you want to delete the database.

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl database delete DATABASE_NAME
```
{{% /code-placeholders %}}

> [!Warning]
> #### Wait before writing to a new database with the same name
>
> After deleting a database from your {{% product-name omit=" Clustered" %}}
> cluster, you can reuse the name to create a new database, but **wait two to
> three minutes** after deleting the previous database before writing to the new
> database to allow write caches to clear.
>
> #### Tokens still grant access to databases with the same name
>
> [Database tokens](/influxdb3/clustered/admin/tokens/database/) are associated to
> databases by name. If you create a new database with the same name, tokens
> that granted access to the deleted database will also grant access to the new
> database.
> 
> #### Never directly modify the Catalog
> 
> Never directly modify the [PostgreSQL-compatible Catalog](/influxdb3/clustered/reference/internals/storage-engine/#catalog).
> Doing so will result in an undefined state for various components and may lead to data loss and crashes.
