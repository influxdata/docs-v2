---
title: Undelete a database
description: >
  Use the Admin UI or the [`influxctl database undelete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/undelete/)
  to restore a previously deleted database in your {{< product-name omit=" Cluster" >}} cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage databases
weight: 204
list_code_example: |
  ```sh
  influxctl database undelete <DATABASE_NAME>
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/database/undelete/
  - /influxdb3/cloud-dedicated/admin/databases/delete/
  - /influxdb3/cloud-dedicated/admin/tokens/database/create/
---

Use the Admin UI or the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/)
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

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#admin-ui)
[influxctl](#influxctl)
{{% /tabs %}}
{{% tab-content %}}
{{< admin-ui-access >}}

In the database list, find the deleted database you want to restore.
Deleted databases are shown with a "Deleted" status indicator.
You can sort on column headers or use the **Search** field to find a specific database.

1. In the options menu (three vertical dots to the right of the database), click **Restore Database**. The **Restore Database** dialog displays.
2. In the **Restore Database** dialog, review the database name and deletion date.
3. Click the **Restore Database** button to restore the database.
{{% /tab-content %}}
{{% tab-content %}}

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Use the [`influxctl database undelete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/undelete/)
    to restore a deleted database. Provide the following:

    - The name of the deleted database to restore

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl database undelete DATABASE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the deleted database to restore
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Recreate tokens for the database

After successfully undeleting a database:

1.  **Verify the database was restored** by [listing all databases](/influxdb3/cloud-dedicated/admin/databases/list/).
2.  **If you previously deleted tokens associated with the deleted database, create new database tokens**
    - Any tokens that existed before deletion are not restored.
    [Create new database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/create/)
    with appropriate permissions for the restored database.
3.  **Update your applications** to use the new database tokens.

{{% note %}}
#### Undeleted databases retain their original configuration

When a database is undeleted, it retains the same database ID, retention period,
and table/column limits it had before deletion. However, database tokens are not
restored and must be recreated.
{{% /note %}}
