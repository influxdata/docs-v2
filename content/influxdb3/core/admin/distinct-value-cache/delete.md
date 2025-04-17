---
title: Delete a Distinct Value Cache
description: |
  Use the [`influxdb3 delete distinct_cache` command](/influxdb3/core/reference/cli/influxdb3/delete/distinct_cache/)
  to delete a Distinct Value Cache.
menu:
  influxdb3_core:
    parent: Manage the Distinct Value Cache
weight: 204
influxdb3/core/tags: [cache]
list_code_example: |
  <!--pytest.mark.skip-->

  ```bash
  influxdb3 delete distinct_cache \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table wind_data \
    windDistinctCache
  ```
related:
  - /influxdb3/core/reference/cli/influxdb3/delete/distinct_cache/
source: /shared/influxdb3-admin/distinct-value-cache/delete.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/distinct-value-cache/delete.md -->
