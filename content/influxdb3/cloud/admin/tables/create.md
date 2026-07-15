---
title: Create a table
description: >
  Use the influxdb3 CLI or HTTP API to create a table in a specified database
  in {{< product-name >}}.
menu:
  influxdb3_cloud:
    parent: Manage tables
weight: 201
list_code_example: |
  ```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
  # influxdb3 CLI
  influxdb3 create table \
    --tags tag1,tag2,tag3 \
    --retention-period 7d \
    --database DATABASE_NAME \
    --token AUTH_TOKEN \
    TABLE_NAME

  # HTTP API
  curl --request POST "https://{{< influxdb/host >}}/api/v3/configure/table" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer AUTH_TOKEN" \
    --data '{
      "db": "DATABASE_NAME",
      "table": "TABLE_NAME",
      "tags": ["tag1", "tag2", "tag3"],
      "retention_period": "7d"
    }'
  ```
related:
  - /influxdb3/cloud/reference/cli/influxdb3/create/table/
  - /influxdb3/cloud/api/table/#operation/PostConfigureTable, Create table API
  - /influxdb3/cloud/reference/naming-restrictions/
  - /influxdb3/cloud/reference/internals/data-retention/
source: /shared/influxdb3-admin/tables/create.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/create.md
-->
