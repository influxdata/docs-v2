---
title: Manage file indexes
seotitle: Manage file indexes in {{< product-name >}}
description: >
  Customize the indexing strategy of a database or table in {{% product-name %}}
  to optimize the performance of single-series queries.
menu:
  influxdb3_enterprise:
    parent: Administer InfluxDB
weight: 107
influxdb3/enterprise/tags: [indexing]
---

{{% product-name %}} lets you customize how your data is indexed to help
optimize query performance for your specific workload, especially workloads that
include single-series queries. Indexes help the InfluxDB query engine quickly
identify the physical location of files that contain the queried data.

By default, InfluxDB indexes on the primary key—`time` and tag columns. However,
if your schema includes tags that you don't specifically use when querying, you
can define a custom indexing strategy to only index on `time` and columns
important to your query workload.

For example, if your schema includes the following columns:

- country
- state_province
- county
- city
- postal_code

And in your query workload, you only query based on country, state or province,
and city, you can create a custom file indexing strategy that only indexes on
`time` and these specific columns. This makes your index more efficient and
improves the performance of your single-series queries.

> [!Note]
> File indexes can use any string column, including both tags and fields.

- [Indexing life cycle](#indexing-life-cycle)
- [Create a custom file index](#create-a-custom-file-index)
- [Delete a custom file index](#delete-a-custom-file-index)

## Indexing life cycle

{{% product-name %}} builds indexes as it compacts data. Compaction is the
process that organizes and optimizes Parquet files in storage and occurs in
multiple phases or generations. Generation 1 (gen1) data is un-compacted and
is not indexed. Generation 2 (gen2) data and beyond is all indexed.

{{< children hlevel="h2" >}}
