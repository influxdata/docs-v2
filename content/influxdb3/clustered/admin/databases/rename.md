---
title: Rename a database
description: >
  Use the [`influxctl database rename` command](/influxdb3/clustered/reference/cli/influxctl/database/rename/)
  to rename a database in your {{< product-name omit=" Cluster" >}} cluster.
menu:
  influxdb3_clustered:
    parent: Manage databases
weight: 202
list_code_example: |
  ##### CLI
  ```sh
  influxctl database rename <DATABASE_NAME> <NEW_DATABASE_NAME>
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/database/rename/
  - /influxdb3/clustered/admin/tokens/database/create/
---

Use the [`influxctl database rename` command](/influxdb3/clustered/reference/cli/influxctl/database/rename/)
to rename a database in your {{< product-name omit=" Cluster" >}} cluster.

> [!Note]
> Renaming a database does not change the database ID, modify data in the database,
> or update [database tokens](/influxdb3/clustered/admin/tokens/database/).
> After renaming a database, any existing database tokens will stop working and you
> must create new tokens with permissions for the renamed database.

## Rename a database using the influxctl CLI

{{% code-placeholders "DATABASE_NAME|NEW_DATABASE_NAME" %}}
```sh
influxctl database rename DATABASE_NAME NEW_DATABASE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Current name of the database to rename
- {{% code-placeholder-key %}}`NEW_DATABASE_NAME`{{% /code-placeholder-key %}}: New name for the database

## Update database tokens after renaming

After renaming a database, existing database tokens will no longer work because
they reference the old database name. Do the following:

1. [Create new database tokens](/influxdb3/clustered/admin/tokens/database/create/)
   with permissions for the renamed database.
2. Update your applications and clients to use the new tokens.
3. [Delete the old database tokens](/influxdb3/clustered/admin/tokens/database/delete/)
   that reference the old database name.

{{% note %}}
#### Renamed database retains its ID

The database ID remains the same after renaming. When you list databases,
you'll see the new name associated with the original database ID.
{{% /note %}}
