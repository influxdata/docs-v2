---
title: Query a Last Value Cache
description: |
  Use the [`last_cache()` SQL function](/influxdb3/enterprise/reference/sql/functions/cache/#last_cache)
  in the `FROM` clause of an SQL `SELECT` statement to query data from the
  Last Value Cache.
menu:
  influxdb3_enterprise:
    parent: Manage the Last Value Cache
weight: 202
influxdb3/enterprise/tags: [cache]
list_code_example: |
  ```sql
  SELECT * FROM last_cache('table-name', 'cache-name')
  ```

  > [!Important]
  > You must use SQL to query the LVC.
  > InfluxQL does not support the `last_cache()` function.
related:
  - /influxdb3/enterprise/reference/sql/functions/cache/#last_cache, last_cache SQL function
  - /influxdb3/explorer/manage-caches/last-value-caches/
source: /shared/influxdb3-admin/last-value-cache/query.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/last-value-cache/query.md -->
