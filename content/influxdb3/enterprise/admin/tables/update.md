---
title: Add columns to a table
description: >
  Use the [`influxdb3 update table` command](/influxdb3/enterprise/reference/cli/influxdb3/update/table/)
  or the [HTTP API](/influxdb3/enterprise/api/v3/) to add tag and field columns to
  an existing table in {{< product-name >}}.
menu:
  influxdb3_enterprise:
    parent: Manage tables
weight: 204
list_code_example: |
  ```sh
  # CLI
  influxdb3 update table \
    --database <DATABASE_NAME> \
    --token <AUTH_TOKEN> \
    --tags rack,zone \
    --fields temp:float64 \
    <TABLE_NAME>

  # HTTP API
  curl --request PATCH "http://localhost:8181/api/v3/configure/table" \
    --header "Authorization: Bearer <AUTH_TOKEN>" \
    --header "Content-Type: application/json" \
    --data '{
      "db": "<DATABASE_NAME>",
      "table": "<TABLE_NAME>",
      "tags": ["rack", "zone"],
      "fields": [{"name": "temp", "type": "float64"}]
    }'
  ```
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/update/table/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/table/
  - /influxdb3/enterprise/api/v3/#tag/Table, Table API reference
  - /influxdb3/enterprise/admin/databases/enforce-schema/
source: /shared/influxdb3-admin/tables/update.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/update.md
-->
