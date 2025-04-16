---
title: List resource tokens
description: >
  Use the `influxdb3 show tokens` command
  to list resource tokens in your InfluxDB 3 Enterprise instance.
menu:
  influxdb3_enterprise:
    parent: Resource tokens
weight: 202
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 show tokens \
    --token ADMIN_TOKEN
    --host http://{{< influxdb/host >}}
  ```
aliases:
  - /influxdb3/enterprise/admin/tokens/list/
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/token/list/
  - /influxdb3/enterprise/reference/api/
source: /shared/influxdb3-admin/tokens/admin/list.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb3-admin/tokens/admin/list.md
-->