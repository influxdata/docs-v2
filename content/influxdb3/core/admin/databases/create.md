---
title: Create a database
description: >
  Use the influxdb3 CLI, HTTP API, or InfluxDB 3 Explorer to create a new database
  in {{< product-name >}}.
menu:
  influxdb3_core:
    parent: Manage databases
weight: 201
list_code_example: |
  <!--pytest.mark.skip-->

  ```sh{placeholders="DATABASE_NAME|AUTH_TOKEN"}
  # influxdb3 CLI
  influxdb3 create database \
    --retention-period 30d \
    DATABASE_NAME

  # HTTP API
  curl --request POST "http://localhost:8181/api/v3/configure/database" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer AUTH_TOKEN" \
    --data '{
      "db": "DATABASE_NAME",
      "retention_period": "30d"
    }'
  ```
related:
  - /influxdb3/core/reference/cli/influxdb3/create/database/
  - /influxdb3/core/api/v3/#operation/PostConfigureDatabase, Create database API
  - /influxdb3/core/reference/naming-restrictions/
  - /influxdb3/core/reference/internals/data-retention/
  - /influxdb3/explorer/manage-databases/
source: /shared/influxdb3-admin/databases/create.md
---

<!--
//SOURCE content/shared/influxdb3-admin/databases/create.md
-->
