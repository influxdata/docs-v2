---
title: Undelete a database
description: >
  Use the [`influxctl database undelete` command](/influxdb3/clustered/reference/cli/influxctl/database/undelete/)
  to restore a previously deleted database in your {{< product-name omit=" Cluster" >}} cluster.
menu:
  influxdb3_clustered:
    parent: Manage databases
weight: 204
list_code_example: |
  ```sh
  influxctl database undelete <DATABASE_NAME>
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/database/undelete/
  - /influxdb3/clustered/admin/databases/delete/
  - /influxdb3/clustered/admin/tokens/database/create/
---

Use the [`influxctl database undelete` command](/influxdb3/clustered/reference/cli/influxctl/database/undelete/)
to restore a previously deleted database in your {{< product-name omit=" Cluster" >}} cluster.

> [!Important]
> To undelete a database:
> 
> - The database name must match the name of the deleted database.
> - A new database with the same name cannot already exist.
> - You must have appropriate permissions to manage databases.

When you undelete a database, it is restored with the same retention period,
table limits, and column limits as when it was deleted.

> [!Warning]
> Databases can only be undeleted for
> {{% show-in "cloud-dedicated" %}}approximately 7 days{{% /show-in %}}{{% show-in "clustered" %}}a configurable "hard-delete" grace period{{% /show-in %}}
> after they are deleted.
> After this grace period, all Parquet files associated with the deleted database
> are permanently removed and the database cannot be undeleted.

## Undelete a database using the influxctl CLI

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl database undelete DATABASE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the deleted database to restore

## Recreate tokens for the database

After successfully undeleting a database:

1.  **Verify the database was restored** by [listing all databases](/influxdb3/clustered/admin/databases/list/).
2.  **If you previously deleted tokens associated with the deleted database, create new database tokens**
    - Any tokens that existed before deletion are not restored.
    [Create new database tokens](/influxdb3/clustered/admin/tokens/database/create/)
    with appropriate permissions for the restored database.
3.  **Update your applications** to use the new database tokens.

{{% note %}}
#### Undeleted databases retain their original configuration

When a database is undeleted, it retains the same database ID, retention period,
and table/column limits it had before deletion. However, database tokens are not
restored and must be recreated.
{{% /note %}}
