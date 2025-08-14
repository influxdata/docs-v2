---
title: Rename a table
description: >
  Use the [`influxctl table rename` command](/influxdb3/clustered/reference/cli/influxctl/table/rename/)
  to rename a table in your {{< product-name omit=" Cluster" >}} cluster.
menu:
  influxdb3_clustered:
    parent: Manage tables
weight: 202
list_code_example: |
  ##### CLI
  ```sh
  influxctl table rename <DATABASE_NAME> <CURRENT_TABLE_NAME> <NEW_TABLE_NAME>
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/table/rename/
---

Use the [`influxctl table rename` command](/influxdb3/clustered/reference/cli/influxctl/table/rename/)
to rename a table in your {{< product-name omit=" Clustered" >}} cluster.

> [!Note]
> After renaming a table, write and query requests using the old table name
> are routed to the same table.

## Rename a database using the influxctl CLI

<!-- pytest.mark.skip -->

```bash { placeholders="DATABASE_NAME|CURRENT_TABLE_NAME|NEW_TABLE_NAME" }
influxctl table rename DATABASE_NAME CURRENT_TABLE_NAME NEW_TABLE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name of the database the table is in
- {{% code-placeholder-key %}}`CURRENT_TABLE_NAME`{{% /code-placeholder-key %}}: Name of the table to change
- {{% code-placeholder-key %}}`NEW_TABLE_NAME`{{% /code-placeholder-key %}}: New name for the table

> [!Note]
> #### Renamed table retains its ID
> 
> The table ID remains the same after renaming. When you list tables,
> you'll see the new name associated with the original table ID.
