---
title: View InfluxQL functions
description: >
  Aggregate, select, transform, and predict data with InfluxQL functions.
menu:
  influxdb_v2:
    name: InfluxQL functions
    parent: Query with InfluxQL
weight: 203
---

Use InfluxQL functions to aggregate, select, transform, analyze, and predict data.

{{% note %}}
To query with InfluxQL, the bucket you query must be mapped to a database and retention policy (DBRP). For more information, see how to [Query data with InfluxQL](/influxdb/v2/query-data/influxql/).
{{%/ note %}}

## InfluxQL functions (by type)

- [Aggregates](/influxdb/v2/query-data/influxql/functions/aggregates/)
  - [COUNT()](/influxdb/v2/query-data/influxql/functions/aggregates/#count)
  - [DISTINCT()](/influxdb/v2/query-data/influxql/functions/aggregates/#distinct)
  - [INTEGRAL()](/influxdb/v2/query-data/influxql/functions/aggregates/#integral)
  - [MEAN()](/influxdb/v2/query-data/influxql/functions/aggregates/#mean)
  - [MEDIAN()](/influxdb/v2/query-data/influxql/functions/aggregates/#median)
  - [MODE()](/influxdb/v2/query-data/influxql/functions/aggregates/#mode)
  - [SPREAD()](/influxdb/v2/query-data/influxql/functions/aggregates/#spread)
  - [STDDEV()](/influxdb/v2/query-data/influxql/functions/aggregates/#stddev)
  - [SUM()](/influxdb/v2/query-data/influxql/functions/aggregates/#sum)
- [Selectors](/influxdb/v2/query-data/influxql/functions/selectors/)
  - [BOTTOM()](/influxdb/v2/query-data/influxql/functions/selectors/#bottom)
  - [FIRST()](/influxdb/v2/query-data/influxql/functions/selectors/#first)
  - [LAST()](/influxdb/v2/query-data/influxql/functions/selectors/#last)
  - [MAX()](/influxdb/v2/query-data/influxql/functions/selectors/#max)
  - [MIN()](/influxdb/v2/query-data/influxql/functions/selectors/#min)
  - [PERCENTILE()](/influxdb/v2/query-data/influxql/functions/selectors/#percentile)
  - [SAMPLE()](/influxdb/v2/query-data/influxql/functions/selectors/#sample)
  - [TOP()](/influxdb/v2/query-data/influxql/functions/selectors/#top)
- [Transformations](/influxdb/v2/query-data/influxql/functions/transformations/)
  - [ABS()](/influxdb/v2/query-data/influxql/functions/transformations/#abs)
  - [ACOS()](/influxdb/v2/query-data/influxql/functions/transformations/#acos)
  - [ASIN()](/influxdb/v2/query-data/influxql/functions/transformations/#asin)
  - [ATAN()](/influxdb/v2/query-data/influxql/functions/transformations/#atan)
  - [ATAN2()](/influxdb/v2/query-data/influxql/functions/transformations/#atan2)
  - [CEIL()](/influxdb/v2/query-data/influxql/functions/transformations/#ceil)
  - [COS()](/influxdb/v2/query-data/influxql/functions/transformations/#cos)
  - [CUMULATIVE_SUM()](/influxdb/v2/query-data/influxql/functions/transformations/#cumulative_sum)
  - [DERIVATIVE()](/influxdb/v2/query-data/influxql/functions/transformations/#derivative)
  - [DIFFERENCE()](/influxdb/v2/query-data/influxql/functions/transformations/#difference)
  - [ELAPSED()](/influxdb/v2/query-data/influxql/functions/transformations/#elapsed)
  - [EXP()](/influxdb/v2/query-data/influxql/functions/transformations/#exp)
  - [FLOOR()](/influxdb/v2/query-data/influxql/functions/transformations/#floor)
  - [HISTOGRAM()](/influxdb/v2/query-data/influxql/functions/transformations/#histogram)
  - [LN()](/influxdb/v2/query-data/influxql/functions/transformations/#ln)
  - [LOG()](/influxdb/v2/query-data/influxql/functions/transformations/#log)
  - [LOG2()](/influxdb/v2/query-data/influxql/functions/transformations/#log2)
  - [LOG10()](/influxdb/v2/query-data/influxql/functions/transformations/#log10)
  - [MOVING_AVERAGE()](/influxdb/v2/query-data/influxql/functions/transformations/#moving_average)
  - [NON_NEGATIVE_DERIVATIVE()](/influxdb/v2/query-data/influxql/functions/transformations/#non_negative_derivative)
  - [NON_NEGATIVE_DIFFERENCE()](/influxdb/v2/query-data/influxql/functions/transformations/#non_negative_difference)
  - [POW()](/influxdb/v2/query-data/influxql/functions/transformations/#pow)
  - [ROUND()](/influxdb/v2/query-data/influxql/functions/transformations/#round)
  - [SIN()](/influxdb/v2/query-data/influxql/functions/transformations/#sin)
  - [SQRT()](/influxdb/v2/query-data/influxql/functions/transformations/#sqrt)
  - [TAN()](/influxdb/v2/query-data/influxql/functions/transformations/#tan)
- [Technical analysis](/influxdb/v2/query-data/influxql/functions/technical-analysis/)
  - (Predictive analysis) [HOLT_WINTERS()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#holt_winters)
  - [CHANDE_MOMENTUM_OSCILLATOR()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#chande_momentum_oscillator)
  - [EXPONENTIAL_MOVING_AVERAGE()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#exponential_moving_average)
  - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#double_exponential_moving_average)
  - [KAUFMANS_EFFICIENCY_RATIO()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average)
  - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average)
  - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#triple_exponential_moving_average)
  - [TRIPLE_EXPONENTIAL_DERIVATIVE()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#triple_exponential_derivative)
  - [RELATIVE_STRENGTH_INDEX()](/influxdb/v2/query-data/influxql/functions/technical-analysis/#relative_strength_index)
