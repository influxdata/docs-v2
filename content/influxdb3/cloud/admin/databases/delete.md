---
title: Delete a database
description: >
  Use the influxdb3 CLI or HTTP API to delete a database
  from {{< product-name >}}.
menu:
  influxdb3_cloud:
    parent: Manage databases
weight: 203
list_code_example: |
  ```sh{placeholders="DATABASE_NAME|AUTH_TOKEN"}
  # influxdb3 CLI
  influxdb3 delete database DATABASE_NAME

  # HTTP API
  curl --request DELETE "{{< influxdb/host-url >}}/api/v3/configure/database?db=DATABASE_NAME" \
    --header "Authorization: Bearer AUTH_TOKEN"
  ```
related:
  - /influxdb3/cloud/reference/cli/influxdb3/delete/database/
  - /influxdb3/cloud/api/database/#operation/DeleteConfigureDatabase, Delete database API
source: /shared/influxdb3-admin/databases/delete.md
---

<!--
//SOURCE - content/shared/influxdb3-admin/databases/delete.md
-->
