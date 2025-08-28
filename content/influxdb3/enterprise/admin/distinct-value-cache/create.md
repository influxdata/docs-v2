---
title: Create a Distinct Value Cache
description: |
  Use the [`influxdb3 create distinct_cache` command](/influxdb3/enterprise/reference/cli/influxdb3/create/distinct_cache/)
  to create a Distinct Value Cache.
menu:
  influxdb3_enterprise:
    parent: Manage the Distinct Value Cache
weight: 201
influxdb3/enterprise/tags: [cache]
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/create/distinct_cache/
  - /influxdb3/explorer/manage-caches/distinct-value-caches/
list_code_example: |
  {{% show-in "core" %}}
  <!--pytest.mark.skip-->

  ```bash
  influxdb3 create distinct_cache \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table wind_data \
    --columns country,county,city \
    --max-cardinality 10000 \
    --max-age 24h \
    windDistinctCache
  ```
  {{% /show-in %}}

  {{% show-in "enterprise" %}}
  <!--pytest.mark.skip-->

  ```bash
  influxdb3 create distinct_cache \
    --database example-db \
    --token 00xoXX0xXXx0000XxxxXx0Xx0xx0 \
    --table home \
    --node-spec "nodes:node-01,node-02" \
    --columns country,county,city \
    --max-cardinality 10000 \
    --max-age 24h \
    windDistinctCache
  ```
  {{% /show-in %}}
source: /shared/influxdb3-admin/distinct-value-cache/create.md
---

<!-- The content for this page is located at
// SOURCE content/shared/influxdb3-admin/distinct-value-cache/create.md -->
