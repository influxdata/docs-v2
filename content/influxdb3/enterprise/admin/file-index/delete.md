---
title: Delete a custom file index
seotitle: Delete a custom file index in {{< product-name >}}
description: >
  Use the [`influxdb3 delete file_index` command](/influxdb3/enterprise/reference/cli/influxdb3/delete/file_index/)
  to delete a custom file indexing strategy from a database or a table and revert
  to the default indexing strategy.
menu:
  influxdb3_enterprise:
    parent: Manage file indexes
weight: 106
influxdb3/enterprise/tags: [indexing]
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/delete/file_index/
list_code_example: |
  <!--pytest.mark.skip-->
  ```bash
  influxdb3 delete file_index \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table wind_data
  ```
---

Use the [`influxdb3 delete file_index` command](/influxdb3/enterprise/reference/cli/influxdb3/delete/file_index/)
to delete a custom file indexing strategy from a database or a table and revert
to the default indexing strategy.

Provide the following:

- **Token** (`--token`): _({{< req >}})_ Your {{% token-link "admin" %}}.
  You can also use the `INFLUXDB3_AUTH_TOKEN` environment variable to specify
  the token.
- **Database** (`-d`, `--database`): _({{< req >}})_ The name of the database to
  apply remove the custom index from. You can also use the `INFLUXDB3_DATABASE_NAME`
  environment variable to specify the database.
- **Table** (`-t`, `--table`): The name of the table to remove the custom index from.
  If no table is specified, the custom indexing strategy is removed from all
  tables in the specified database.

{{% code-placeholders "AUTH_TOKEN|DATABASE|TABLE|COLUMNS" %}}

```bash
influxdb3 delete file_index \
  --host http://localhost:8585 \
  --database DATABASE_NAME \
  --table TABLE_NAME \
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to remove the custom file index from
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table to remove the custom file index from
