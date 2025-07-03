---
title: Create a custom file index
seotitle: Create a custom file index in {{< product-name >}}
description: >
  Use the [`influxdb3 create file_index` command](/influxdb3/enterprise/reference/cli/influxdb3/create/file_index/)
  to create a custom file indexing strategy for a database or a table.
menu:
  influxdb3_enterprise:
    parent: Manage file indexes
weight: 106
influxdb3/enterprise/tags: [indexing]
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/create/file_index/
list_code_example: |
  <!--pytest.mark.skip-->
  ```bash
  influxdb3 create file_index \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table wind_data \
    country,city
  ```
---

Use the [`influxdb3 create file_index` command](/influxdb3/enterprise/reference/cli/influxdb3/create/file_index/)
to create a custom file indexing strategy for a database or table.

Provide the following:

- **Token** (`--token`): _({{< req >}})_ Your {{% token-link "admin" %}}.
  You can also use the `INFLUXDB3_AUTH_TOKEN` environment variable to specify
  the token.
- **Database** (`-d`, `--database`): _({{< req >}})_ The name of the database to
  apply the index to. You can also use the `INFLUXDB3_DATABASE_NAME`
  environment variable to specify the database.
- **Table** (`-t`, `--table`): The name of the table to apply the index to.
  If no table is specified, the indexing strategy applies to all tables in the
  specified database.
- **Columns**: _({{< req >}})_ A comma-separated list of string columns to
  index on. These are typically tag columns but can also be string fields.

{{% code-placeholders "AUTH_TOKEN|DATABASE|TABLE|COLUMNS" %}}
<!--pytest.mark.skip-->
```bash
influxdb3 create file_index \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  COLUMNS
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to create the file index in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table to create the file index in
- {{% code-placeholder-key %}}`COLUMNS`{{% /code-placeholder-key %}}:
  a comma-separated list of columns to index on--for example: `host,application`
