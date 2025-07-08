---
title: Use the InfluxDB v3 HTTP query API
seotitle: Use SQL or InfluxQL and InfluxDB v3 HTTP query API
list_title: Use the v3 query API
description: >
  Use SQL or InfluxQL and the InfluxDB v3 HTTP query API to query data in {{< product-name >}}.
weight: 301
menu:
  influxdb3_core:
    parent: Execute queries
    name: Use the v3 query API
influxdb3/core/tags: [query, influxql, sql, python]
metadata: [InfluxQL, SQL]
related:
  - /influxdb3/core/api-compatibility/v1/
list_code_example: |
  ```sh
  curl --get http://{{< influxdb/host >}}/api/v3/query_sql \
    --header "Authorization: Token AUTH_TOKEN" \
    --data-urlencode "db=DATABASE_NAME" \
    --data-urlencode "q=SELECT * FROM home"
  ```
source: /shared/influxdb3-query-guides/execute-queries/influxdb3-api.md
---

<!--
The content for this page is at
// SOURCE content/shared/influxdb3-query-guides/execute-queries/influxdb3-api.md
-->
