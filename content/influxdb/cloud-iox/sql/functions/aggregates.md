---
title: SQL aggregate functions
list_title: Aggregate functions
description: >
  Aggregate data with SQL aggregate functions.
menu:
  influxdb_cloud_iox:
    name: Aggregates
    parent: SQL functions
weight: 210
---

min

max



avg

sum

array_agg


is ()



Statistical
 - var / var_samp / var_pop
 - stddev / stddev_samp / stddev_pop
 - covar / covar_samp / covar_pop
 - orr

Approximate Functions

approx_distinct
approx_distinct(x) -> uint64 returns the approximate number (HyperLogLog) of distinct input values

approx_median
approx_median(x) -> x returns the approximate median of input values. it is an alias of approx_percentile_cont(x, 0.5).

approx_percentile_cont
approx_percentile_cont(x, p) -> x return the approximate percentile (TDigest) of input values, where p is a float64 between 0 and 1 (inclusive).

It supports raw data as input and build Tdigest sketches during query time, and is approximately equal to approx_percentile_cont_with_weight(x, 1, p).

approx_percentile_cont(x, p, n) -> x return the approximate percentile (TDigest) of input values, where p is a float64 between 0 and 1 (inclusive),

and n (default 100) is the number of centroids in Tdigest which means that if there are n or fewer unique values in x, you can expect an exact result.

A higher value of n results in a more accurate approximation and the cost of higher memory usage.

approx_percentile_cont_with_weight
approx_percentile_cont_with_weight(x, w, p) -> x returns the approximate percentile (TDigest) of input values with weight, where w is weight column expression and p is a float64 between 0 and 1 (inclusive).

It supports raw data as input or pre-aggregated TDigest sketches, then builds or merges Tdigest sketches during query time. TDigest sketches are a list of centroid (x, w), where x stands for mean and w stands for weight.

It is suitable for low latency OLAP system where a streaming compute engine (e.g. Spark Streaming/Flink) pre-aggregates data to a data store, then queries using Datafusion.


### The COUNT() function

The COUNT() function returns the number of rows from a field or tag key.

```sql
SELECT COUNT("water_level") 
FROM "h2o_feet"
```

Results:

| COUNT(h2o_feet.water_level) |
| :-------------------------- |
| 15258                       |
