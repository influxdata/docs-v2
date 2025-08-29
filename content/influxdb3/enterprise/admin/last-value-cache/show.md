---
title: Show information about Last Value Caches
description: |
  Use the `influxdb3 show system table` command to query and output Last Value
  Cache information from the `last_caches` system table.
menu:
  influxdb3_enterprise:
    parent: Manage the Last Value Cache
    name: Show Last Value Caches
weight: 203
influxdb3/enterprise/tags: [cache]
list_code_example: |
  <!-- pytest.mark.skip -->

  ```bash
  influxdb3 show system \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    table last_caches
  ```
related:
  - /influxdb3/explorer/manage-caches/last-value-caches/
source: /shared/influxdb3-admin/last-value-cache/show.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/last-value-cache/show.md -->
