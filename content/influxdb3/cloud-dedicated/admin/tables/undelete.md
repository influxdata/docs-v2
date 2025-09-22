---
title: Undelete a table
description: >
  Use the [`influxctl table undelete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/undelete/)
  to restore a previously deleted table in your {{< product-name omit=" Cluster" >}} cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage tables
weight: 204
list_code_example: |
  ```bash { placeholders="DATABASE_NAME|TABLE_ID" }
  influxctl table undelete DATABASE_NAME TABLE_ID
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/table/undelete/
  - /influxdb3/cloud-dedicated/admin/tables/delete/
  - /influxdb3/cloud-dedicated/admin/tokens/table/create/
---

Use the [`influxctl table undelete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/table/undelete/)
to restore a previously deleted table in your {{< product-name omit=" Cluster" >}} cluster.

> [!Important]
> To undelete a table:
> 
> - A new table with the same name cannot already exist.
> - You must have appropriate permissions to manage databases.

When you undelete a table, it is restored with the same partition template and
other settings as when it was deleted.

> [!Warning]
> Tables can only be undeleted for
> {{% show-in "cloud-dedicated" %}}approximately 14 days{{% /show-in %}}{{% show-in "clustered" %}}a configurable "hard-delete" grace period{{% /show-in %}}
> after they are deleted.
> After this grace period, all Parquet files associated with the deleted table
> are permanently removed and the table cannot be undeleted.

## Undelete a table using the influxctl CLI

```bash { placeholders="DATABASE_NAME|TABLE_ID" }
influxctl table undelete DATABASE_NAME TABLE_ID
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database associated with the deleted table
- {{% code-placeholder-key %}}`TABLE_ID`{{% /code-placeholder-key %}}:
  ID of the deleted table to restore

> [!Tip]
> #### View deleted table IDs
>
> To view the IDs of deleted tables, use the `influxctl table list` command with
> the `--filter-status=deleted` flag--for example:
>
> <!--pytest.mark.skip-->
> 
> ```bash {placeholders="DATABASE_NAME" }
> influxctl table list --filter-status=deleted DATABASE_NAME
> ```
>
> Replace {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}
> with the name of the database associated with the table you want to undelete.
