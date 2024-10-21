---
title: Optimize querying
seotitle: Optimize querying in your InfluxDB cluster
description: >
  Define your typical query patterns and employ optimizations to ensure query
  performance.
menu:
  influxdb_clustered:
    name: Optimize querying
    parent: Optimize your cluster
weight: 204
related:
  - /influxdb/clustered/query-data/troubleshoot-and-optimize/optimize-queries/
  - /influxdb/clustered/admin/custom-partitions/
  - /influxdb/clustered/query-data/troubleshoot-and-optimize/troubleshoot/
  - /influxdb/clustered/query-data/troubleshoot-and-optimize/analyze-query-plan/
  - /influxdb/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/
---

With data written to your cluster, you can now begin to define and test your
typical query patterns and employ optimizations to ensure query performance.

## Define your query patterns

Understanding your typical query patterns helps prioritize optimizations to meet your query performance requirements.

For example, consider the following questions:

- **Do you typically query data by a specific tag values?**  
  [Apply custom partitioning](/influxdb/clustered/admin/custom-partitions/) to
  your target database or table to partition by those tags. Partitioning by
  commonly queried tags helps InfluxDB to quickly identify where the relevant
  data is in storage and improves query performance.
- **Do you query tables with [wide schemas](/influxdb/clustered/write-data/best-practices/schema-design/#avoid-wide-schemas)?**  
  Avoid using wildcards (`*`) in your `SELECT` statement. Select specific
  columns you want returned in your query results. The more columns queried, the
  less performant the query.
- **Do you query large, historical time ranges?**
  Use [time-based aggregation methods to downsample your data](/influxdb/clustered/query-data/sql/aggregate-select/#downsample-data-by-applying-interval-based-aggregates) and return aggregate
  values per interval of time instead of all the data. 

## Decide on your query language

InfluxDB Clustered supports both [SQL](/influxdb/clustered/reference/sql/) and
[InfluxQL](/influxdb/clustered/reference/influxql/)--a SQL-like query language
designed for InfluxDB v1 and specifically querying time series data.

### SQL 

The InfluxDB SQL implementation is a full-featured SQL query engine powered by
[Apache DataFusion](https://datafusion.apache.org/). It benefits from a robust
upstream community that is constantly improving the features and performance
of the engine. Some time series-specific queries (such as time-based aggregates)
are more verbose in SQL than in InfluxQL, but they are still possible.

### InfluxQL

InfluxQL is designed specifically for time series data and simplifies many 
time series-related operations like aggregating based on time, technical
analysis, and forecasting. It isn't as full-featured as SQL and requires some
understanding of the InfluxDB v1 data model.

## Optimize your queries

View the [query optimization and troubleshooting documentation](/influxdb/clustered/query-data/troubleshoot-and-optimize/optimize-queries/)
for guidance and information on how to troubleshoot and optimize queries that do
not perform as expected.

### Analyze queries

Both SQL and InfluxQL support the `EXPLAIN` and `EXPLAIN ANALYZE` statements
that return detailed information about your query's planning and execution.
This can provide insight into possible optimizations you can make for a specific
query. For more information, see
[Analyze a query plan](/influxdb/clustered/query-data/troubleshoot-and-optimize/analyze-query-plan/).

## Custom-partition data

InfluxDB Clustered lets you define how data is stored to ensure queries are
performant. [Custom partitioning](/influxdb/clustered/admin/custom-partitions/)
lets you define how InfluxDB partitions data and can be used to structure your
data so it's easier for InfluxDB to identify where the data you typically query
is in storage. For more information, see
[Manage data partitioning](/influxdb/clustered/admin/custom-partitions/).

## Report query performance issues

If you have a query that isn't meeting your performance requirements despite
implementing query optimizations, please following the process described in
[Report query performance issues](/influxdb/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/)
to gather information for InfluxData engineers so they can help identify any
potential solutions.

{{< page-nav prev="/influxdb/clustered/install/optimize-cluster/simulate-load/" prevText="Simulate load" next="/influxdb/clustered/install/secure-cluster/" nextText="Phase 4: Secure your cluster" >}}
