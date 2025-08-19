---
title: Use the InfluxDB v1 HTTP query API and InfluxQL to query data
seotitle: Use InfluxQL and InfluxDB v1 HTTP query API
list_title: Use the v1 query API and InfluxQL
description: >
  Use the InfluxDB v1 HTTP query API to query data in {{< product-name >}}
  with InfluxQL.
weight: 303
menu:
  influxdb3_enterprise:
    parent: Execute queries
    name: Use the v1 query API
influxdb3/enterprise/tags: [query, influxql, python]
metadata: [InfluxQL]
related:
  - /influxdb3/enterprise/write-data/http-api/compatibility-apis/
aliases:
  - /influxdb3/enterprise/query-data/influxql/execute-queries/influxdb-v1-api/
list_code_example: |
  ```sh
  curl --get http://{{< influxdb/host >}}/query \
    --header "Authorization: Token DATABASE_TOKEN" \
    --data-urlencode "db=DATABASE_NAME" \
    --data-urlencode "q=SELECT * FROM home"
  ```
source: /shared/influxdb3-query-guides/execute-queries/influxdb-v1-api.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/execute-queries/influxdb-v1-api.md
-->
