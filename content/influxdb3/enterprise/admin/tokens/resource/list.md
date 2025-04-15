---
title: List database tokens
description: >
  Use the `influxdb3 show tokens` command
  to list database tokens in your InfluxDB 3 Enterprise instance.
menu:
  influxdb3_enterprise:
    parent: Database tokens
weight: 202
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 show tokens \
    --token ADMIN_TOKEN
    --host http://{{< influxdb/host >}}
  ```

  ##### API
  ```bash
  curl \
    --location "http://{{< influxdb/host >}}/api/v3/configure/tokens" \
    --header "Accept: application/json" \
    --header "Authorization: Bearer ADMIN_TOKEN"
  ```

aliases:
  - /influxdb3/enterprise/admin/tokens/list/
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/token/list/
  - /influxdb3/enterprise/reference/api/
source: /shared/influxdb3-admin/tokens/database/list.md
---

<!-- The content for this page is at
// file://content/shared/influxdb3-admin/tokens/database/list.md
-->