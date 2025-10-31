---
title: Delete a table
description: >
  Use the [`influxdb3 delete table` command](/influxdb3/enterprise/reference/cli/influxdb3/delete/table/)
  or the [HTTP API](/influxdb3/enterprise/api/v3/) to delete a table from a specified database in {{< product-name >}}.
  Supports both soft delete and hard delete operations.
menu:
  influxdb3_enterprise:
    parent: Manage tables
weight: 203
list_code_example: |
  ```sh
  # CLI
  influxdb3 delete table \
    --database <DATABASE_NAME> \
    --token <AUTH_TOKEN> \
    <TABLE_NAME>

  # HTTP API
  curl -X DELETE "http://localhost:8181/api/v3/configure/table?db=<DATABASE_NAME>&table=<TABLE_NAME>" \
    --header "Authorization: Bearer <AUTH_TOKEN>"
  ```
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/delete/table/
  - /influxdb3/enterprise/api/v3/#operation/DeleteConfigureTable, Delete table API
source: /shared/influxdb3-admin/tables/delete.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/delete.md
-->