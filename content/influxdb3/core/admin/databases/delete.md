---
title: Delete a database
description: >
  Use the influxdb3 CLI, HTTP API, or InfluxDB 3 Explorer to delete a database
  from {{< product-name >}}.
menu:
  influxdb3_core:
    parent: Manage databases
weight: 203
list_code_example: |
  ```sh{placeholders="DATABASE_NAME"}
  # influxdb3 CLI
  influxdb3 delete database DATABASE_NAME

  # HTTP API
  curl --request DELETE "http://localhost:8181/api/v3/configure/database?db=DATABASE_NAME" \
    --header "Authorization: Bearer AUTH_TOKEN"
  ```
related:
  - /influxdb3/core/reference/cli/influxdb3/delete/database/
  - /influxdb3/core/api/v3/#operation/DeleteConfigureDatabase, Delete database API
  - /influxdb3/explorer/manage-databases/
source: /shared/influxdb3-admin/databases/delete.md
---

<!--
//SOURCE - content/shared/influxdb3-admin/databases/delete.md
-->
