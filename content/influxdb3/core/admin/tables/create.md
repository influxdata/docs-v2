---
title: Create a table
description: >
  Use the [`influxdb3 create table` command](/influxdb3/core/reference/cli/influxdb3/create/table/)
  to create a new table in a specified database in InfluxDB 3 Core.
  Provide the database name, table name, and tag columns.
menu:
  influxdb3_core:
    parent: Manage tables
weight: 201
list_code_example: |
  ```sh
  influxdb3 create table \
    --tags tag1,tag2,tag3 \
    --database <DATABASE_NAME> \
    --token <AUTH_TOKEN> \
    <TABLE_NAME>
  ```
related:
  - /influxdb3/core/reference/cli/influxdb3/create/table/
  - /influxdb3/core/reference/naming-restrictions/
source: /shared/influxdb3-admin/tables/create.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/create.md
-->