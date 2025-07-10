---
title: Create a table
description: >
  Use the [`influxdb3 create table` command](/influxdb3/enterprise/reference/cli/influxdb3/create/table/)
  or the [HTTP API](/influxdb3/enterprise/api/v3/) to create a new table in a specified database 
  in InfluxDB 3 Enterprise. Provide the database name, table name, and tag columns.
menu:
  influxdb3_enterprise:
    parent: Manage tables
weight: 201
list_code_example: |
  ```sh
  # CLI
  influxdb3 create table \
    --tags tag1,tag2,tag3 \
    --database <DATABASE_NAME> \
    --token <AUTH_TOKEN> \
    <TABLE_NAME>

  # HTTP API
  curl -X POST "http://localhost:8181/api/v3/configure/table" \
    --header "Authorization: Bearer <AUTH_TOKEN>" \
    --header "Content-Type: application/json" \
    --data '{"db": "<DATABASE_NAME>", "table": "<TABLE_NAME>", "tags": ["tag1", "tag2", "tag3"]}'
  ```
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/create/table/
  - /influxdb3/enterprise/reference/naming-restrictions/
  - /influxdb3/enterprise/api/v3/
source: /shared/influxdb3-admin/tables/create.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/create.md
-->