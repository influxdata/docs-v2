---
title: Create a Last Value Cache
description: |
  Use the [`influxdb3 create last_cache` command](/influxdb3/core/reference/cli/influxdb3/create/last_cache/)
  to create a Last Value Cache.
menu:
  influxdb3_core:
    parent: Manage the Last Value Cache
weight: 201
influxdb3/core/tags: [cache]
related:
  - /influxdb3/core/reference/cli/influxdb3/create/last_cache/
list_code_example: |
  {{% show-in "core" %}}
  <!--pytest.mark.skip-->

  ```bash
  influxdb3 create last_cache \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table home \
    --key-columns room,wall \
    --value-columns temp,hum,co \
    --count 5 \
    --ttl 30mins \
    homeLastCache
  ```
  {{% /show-in %}}

  {{% show-in "enterprise" %}}
  <!--pytest.mark.skip-->

  ```bash
  influxdb3 create last_cache \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table home \
    --node-spec "nodes:node-01,node-02" \
    --key-columns room,wall \
    --value-columns temp,hum,co \
    --count 5 \
    --ttl 30mins \
    homeLastCache
  ```
  {{% /show-in %}}
source: /shared/influxdb3-admin/last-value-cache/create.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/last-value-cache/create.md -->
