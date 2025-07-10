---
title: List tables
description: >
  Use the [`influxdb3 query` command](/influxdb3/version/reference/cli/influxdb3/query/)
  or the [HTTP API](/influxdb3/version/api/v3/) to list tables in a specified database in {{% product-name %}}.
  Use SQL SHOW TABLES or InfluxQL SHOW MEASUREMENTS statements.
menu:
  influxdb3_enterprise:
    parent: Manage tables
weight: 202
list_code_example: |
  ```sh
  # CLI
  influxdb3 query \
    --database <DATABASE_NAME> \
    --token <AUTH_TOKEN> \
    "SHOW TABLES"

  # HTTP API
  curl --get "http://localhost:8181/api/v3/query_sql" \
    --header "Authorization: Bearer <AUTH_TOKEN>" \
    --data-urlencode "db=<DATABASE_NAME>" \
    --data-urlencode "q=SHOW TABLES"
  ```
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/query/
  - /influxdb3/enterprise/api/v3/
source: /shared/influxdb3-admin/tables/list.md
---

<!--
//SOURCE content/shared/influxdb3-admin/tables/list.md
-->