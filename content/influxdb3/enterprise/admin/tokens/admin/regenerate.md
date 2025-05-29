---
title: Regenerate an operator admin token
description: >
  Use the [`influxdb3 create token --admin` command](/influxdb3/enterprise/reference/cli/influxdb3/create/token/)
  or the [HTTP API](/influxdb3/enterprise/api/v3/)
  to regenerate an [operator token](/influxdb3/enterprise/admin/tokens/admin/) for your {{< product-name omit="Clustered" >}} instance.
  Regenerating an admin token deactivates the previous token.
menu:
  influxdb3_enterprise:
    parent: Admin tokens
weight: 201
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 create token --admin \
    --token OPERATOR_TOKEN \
    --regenerate
  ```

  #### HTTP API
  ```bash
  curl -X POST "http://{{< influxdb/host >}}/api/v3/configure/token/admin/regenerate" \
    --header 'Authorization Bearer OPERATOR_TOKEN'
  ```
source: /shared/influxdb3-admin/tokens/admin/regenerate.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb3-admin/tokens/admin/create.md
-->