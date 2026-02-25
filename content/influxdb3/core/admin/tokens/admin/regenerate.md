---
title: Regenerate an admin token
description: >
  Use the [`influxdb3 create token --admin` command](/influxdb3/core/reference/cli/influxdb3/create/token/)
  or the HTTP API [`/api/v3/configure/token/admin/regenerate`](/influxdb3/core/reference/api/#operation/PostRegenerateAdminToken) endpoint
  to regenerate an [operator token](/influxdb3/core/admin/tokens/admin/) for your {{< product-name omit="Clustered" >}} instance.
  Regenerating an operator token deactivates the previous token.
menu:
  influxdb3_core:
    parent: Admin tokens
weight: 201
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 create token --admin \
    --regenerate
    OPERATOR_TOKEN
  ```
  #### HTTP API
  ```bash
  curl -X POST "http://{{< influxdb/host >}}/api/v3/configure/token/admin/regenerate" \
    --header 'Authorization Bearer OPERATOR_TOKEN' \
    --header 'Accept: application/json'
    --header 'Content-Type: application/json'
  ```
source: /shared/influxdb3-admin/tokens/admin/regenerate.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb3-admin/tokens/admin/create.md
-->