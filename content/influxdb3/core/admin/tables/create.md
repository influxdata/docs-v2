---
title: Create a table
description: >
  Use the influxdb3 CLI or HTTP API to create a table in a specified database
  in {{< product-name >}}.
menu:
  influxdb3_core:
    parent: Manage tables
weight: 201
list_code_example: |
  ```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
  # influxdb3 CLI
  influxdb3 create table \
    --tags tag1,tag2,tag3 \
    --database DATABASE_NAME \
    --token AUTH_TOKEN \
    TABLE_NAME

  # HTTP API
  curl -X POST "http://localhost:8181/api/v3/configure/table" \
    --header "Authorization: Bearer AUTH_TOKEN" \
    --header "Content-Type: application/json" \
    --data '{"db": "DATABASE_NAME", "table": "TABLE_NAME", "tags": ["tag1", "tag2", "tag3"]}'
  ```
related:
  - /influxdb3/core/reference/cli/influxdb3/create/table/
  - /influxdb3/core/reference/naming-restrictions/
  - /influxdb3/core/reference/api/
source: /shared/influxdb3-admin/tables/create.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/create.md
-->