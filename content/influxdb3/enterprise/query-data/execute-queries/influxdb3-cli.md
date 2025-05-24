---
title: Use the influxdb3 CLI to query data
list_title: Use the influxdb3 CLI
description: >
  Use the `influxdb3 query` command to query data in {{< product-name >}} with SQL.
weight: 301
menu:
  influxdb3_enterprise:
    parent: Execute queries
    name: Use the influxdb3 CLI
influxdb3/enterprise/tags: [query, sql, influxql, influxdb3, CLI]
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/query/
  - /influxdb3/enterprise/reference/sql/
  - /influxdb3/enterprise/reference/influxql/
  # - /influxdb3/enterprise/query-data/execute-queries/, Get started querying data
list_code_example: |
  ```sh
  influxdb3 query \
    --database DATABASE_NAME \
    "SELECT * FROM home"
  ```
source: /shared/influxdb3-query-guides/execute-queries/influxdb3-cli.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/execute-queries/influxdb3-cli.md
-->
