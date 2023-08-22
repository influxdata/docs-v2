---
title: Delete a database
description: >
  Use the [`influxctl database delete` command](/influxdb/clustered/reference/cli/influxctl/database/delete/)
  to delete a database from your InfluxDB cluster.
  Provide the name of the database you want to delete.
menu:
  influxdb_clustered:
    parent: Manage databases
weight: 203
list_code_example: |
  ```sh
  influxctl database delete <DATABASE_NAME>
  ```
related:
  - /influxdb/clustered/reference/cli/influxctl/database/delete/
---

Use the [`influxctl database delete` command](/influxdb/clustered/reference/cli/influxctl/database/delete/)
to delete a database from your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl database delete` command and provide the following:

    - Name of the database to delete

3. Confirm that you want to delete the database.

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxctl database delete DATABASE_NAME
```
{{% /code-placeholders %}}

{{% warn %}}
#### Deleting a database cannot be undone

Once a database is deleted, data stored in that database cannot be recovered.

#### Cannot reuse database names

After a database is deleted, you cannot reuse the same name for a new database.
{{% /warn %}}