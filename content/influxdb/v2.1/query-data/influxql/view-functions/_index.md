---
title: View InfluxQL functions
description: >
  Aggregate, select, transform, and predict data with InfluxQL functions.
menu:
  influxdb_2_1:
    name: View InfluxQL functions
    parent: Query with InfluxQL
weight: 205
---

Use InfluxQL functions to aggregate, select, transform, analyze, and predict data.

The following InfluxQL functions are available (grouped by type of function):

- [Aggregates](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/)
  - [COUNT()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#count)
  - [DISTINCT()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#distinct)
  - [INTEGRAL()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#integral)
  - [MEAN()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#mean)
  - [MEDIAN()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#median)
  - [MODE()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#mode)
  - [SPREAD()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#spread)
  - [STDDEV()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#stddev)
  - [SUM()](/influxdb/v2.1/query-data/influxql/view-functions/aggregates/#sum)
- [Selectors](/influxdb/v2.1/query-data/influxql/view-functions/selectors/)
  - [BOTTOM()](#bottom)
  - [FIRST()](#first)
  - [LAST()](#last)
  - [MAX()](#max)
  - [MIN()](#min)
  - [PERCENTILE()](#percentile)
  - [SAMPLE()](#sample)
  - [TOP()](#top)
- [Transformations](/influxdb/v2.1/query-data/influxql/view-functions/transformations/)
  - [ABS()](#abs)
  - [ACOS()](#acos)
  - [ASIN()](#asin)
  - [ATAN()](#atan)
  - [ATAN2()](#atan2)
  - [CEIL()](#ceil)
  - [COS()](#cos)
  - [CUMULATIVE_SUM()](#cumulative-sum)
  - [DERIVATIVE()](#derivative)
  - [DIFFERENCE()](#difference)
  - [ELAPSED()](#elapsed)
  - [EXP()](#exp)
  - [FLOOR()](#floor)
  - [HISTOGRAM()](#histogram)
  - [LN()](#ln)
  - [LOG()](#log)
  - [LOG2()](#log2)
  - [LOG10()](#log10)
  - [MOVING_AVERAGE()](#moving-average)
  - [NON_NEGATIVE_DERIVATIVE()](#non-negative-derivative)
  - [NON_NEGATIVE_DIFFERENCE()](#non-negative-difference)
  - [POW()](#pow)
  - [ROUND()](#round)
  - [SIN()](#sin)
  - [SQRT()](#sqrt)
  - [TAN()](#tan)
- [Technical analysis](/influxdb/v2.1/query-data/influxql/view-functions/technical-analysis/)
  - [CHANDE_MOMENTUM_OSCILLATOR()](#chande-momentum-oscillator)
  - [EXPONENTIAL_MOVING_AVERAGE()](#exponential-moving-average)
  - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](#double-exponential-moving-average)
  - [KAUFMANS_EFFICIENCY_RATIO()](#kaufmans-efficiency-ratio)
  - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](#kaufmans-adaptive-moving-average)
  - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](#triple-exponential-moving-average)
  - [TRIPLE_EXPONENTIAL_DERIVATIVE()](#triple-exponential-derivative)
  - [RELATIVE_STRENGTH_INDEX()](#relative-strength-index)
  - [HOLT_WINTERS()](#holt-winters)
