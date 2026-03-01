---
title: List databases
description: >
  Use the influxdb3 CLI, HTTP API, or InfluxDB 3 Explorer to list databases in {{< product-name >}}.
menu:
  influxdb3_enterprise:
    parent: Manage databases
weight: 202
list_code_example: |
  ```sh{placeholders="AUTH_TOKEN"}
  # influxdb3 CLI
  influxdb3 show databases

  # HTTP API
  curl --request GET "http://localhost:8181/api/v3/configure/database" \
    --header "Authorization: Bearer AUTH_TOKEN"
  ```
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/show/databases/
  - /influxdb3/enterprise/reference/api/#operation/GetConfigureDatabase, List databases API
  - /influxdb3/explorer/manage-databases/
source: /shared/influxdb3-admin/databases/list.md
---

<!--
//SOURCE - content/shared/influxdb3-admin/databases/list.md
-->
