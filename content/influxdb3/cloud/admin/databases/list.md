---
title: List databases
description: >
  Use the influxdb3 CLI or HTTP API to list databases in {{< product-name >}}.
menu:
  influxdb3_cloud:
    parent: Manage databases
weight: 202
list_code_example: |
  ```sh{placeholders="AUTH_TOKEN"}
  # influxdb3 CLI
  influxdb3 show databases

  # HTTP API
  curl --request GET "{{< influxdb/host-url >}}/api/v3/configure/database" \
    --header "Authorization: Bearer AUTH_TOKEN"
  ```
related:
  - /influxdb3/cloud/reference/cli/influxdb3/show/databases/
  - /influxdb3/cloud/api/database/#operation/GetConfigureDatabase, List databases API
source: /shared/influxdb3-admin/databases/list.md
---

<!--
//SOURCE - content/shared/influxdb3-admin/databases/list.md
-->
