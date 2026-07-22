---
title: Create a database
description: >
  Use the influxdb3 CLI or HTTP API to create a new database
  in {{< product-name >}}.
menu:
  influxdb3_cloud:
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
  curl --request POST "{{< influxdb/host-url >}}/api/v3/configure/database" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer AUTH_TOKEN" \
    --data '{
      "db": "DATABASE_NAME",
      "retention_period": "30d"
    }'
  ```
related:
  - /influxdb3/cloud/reference/cli/influxdb3/create/database/
  - /influxdb3/cloud/api/database/#operation/PostConfigureDatabase, Create database API
  - /influxdb3/cloud/reference/naming-restrictions/
  - /influxdb3/cloud/reference/internals/data-retention/
source: /shared/influxdb3-admin/databases/create.md
---

<!--
//SOURCE content/shared/influxdb3-admin/databases/create.md
-->
