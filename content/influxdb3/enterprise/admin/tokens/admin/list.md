---
title: List admin tokens
description: >
  Use the `influxdb3` CLI or the `/api/v3` HTTP API
  to list admin tokens for your {{< product-name >}} instance.
  Use the  `influxdb3 show tokens` command to list all tokens or use SQL to query token metadata directly from the `system.tokens` table.
menu:
  influxdb3_enterprise:
    parent: Admin tokens
weight: 201
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 show tokens 
  ```

  ##### HTTP API
  ```bash
  curl -G \
  "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --data-urlencode "db=_internal" \
  --data-urlencode "q=SELECT * FROM system.tokens WHERE permissions = '*:*:*'" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN"
  ```
source: /shared/influxdb3-admin/tokens/admin/list.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb3-admin/tokens/admin/list.md
-->