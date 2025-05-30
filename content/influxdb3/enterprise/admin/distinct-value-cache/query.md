---
title: Query a Distinct Value Cache
description: |
  Use the [`distinct_cache()` SQL function](/influxdb3/enterprise/reference/sql/functions/cache/#distinct_cache)
  in the `FROM` clause of an SQL `SELECT` statement to query data from the
  Distinct Value Cache.
menu:
  influxdb3_enterprise:
    parent: Manage the Distinct Value Cache
weight: 202
influxdb3/enterprise/tags: [cache]
list_code_example: |
  ```sql
  SELECT * FROM distinct_cache('table-name', 'cache-name')
  ```

  > [!Important]
  > You must use SQL to query the DVC.
  > InfluxQL does not support the `distinct_cache()` function.
related:
  - /influxdb3/enterprise/reference/sql/functions/cache/#distinct_cache, distinct_cache SQL function
source: /shared/influxdb3-admin/distinct-value-cache/query.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/distinct-value-cache/query.md -->
