---
title: Show information about Distinct Value Caches
description: |
  Use the `influxdb3 show system table` command to query and output Distinct Value
  Cache information from the `distinct_caches` system table.
menu:
  influxdb3_enterprise:
    parent: Manage the Distinct Value Cache
    name: Show Distinct Value Caches
weight: 203
influxdb3/enterprise/tags: [cache]
list_code_example: |
  <!-- pytest.mark.skip -->

  ```bash
  influxdb3 show system \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    table distinct_caches
  ```
related:
  - /influxdb3/explorer/manage-caches/distinct-value-caches/
source: /shared/influxdb3-admin/distinct-value-cache/show.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/distinct-value-cache/show.md -->
