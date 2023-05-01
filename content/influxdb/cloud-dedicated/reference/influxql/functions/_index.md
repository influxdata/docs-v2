---
title: View InfluxQL functions
description: >
  Aggregate, select, transform, and predict data with InfluxQL functions.
menu:
  influxdb_cloud_dedicated:
    name: InfluxQL functions
    parent: influxql-reference
    identifier: influxql-functions
weight: 203
---

Use InfluxQL functions to aggregate, select, transform, analyze, and predict data.

{{% note %}}
To query with InfluxQL, the bucket you query must be mapped to a database and retention policy (DBRP). For more information, see how to [Query data with InfluxQL](/influxdb/v2.7/query-data/influxql/).
{{%/ note %}}

## InfluxQL functions (by type)

- [Aggregates](aggregates/)
  - [COUNT()](aggregates/#count)
  - [DISTINCT()](aggregates/#distinct)
  - [INTEGRAL()](aggregates/#integral)
  - [MEAN()](aggregates/#mean)
  - [MEDIAN()](aggregates/#median)
  - [MODE()](aggregates/#mode)
  - [SPREAD()](aggregates/#spread)
  - [STDDEV()](aggregates/#stddev)
  - [SUM()](aggregates/#sum)
- [Selectors](selectors/)
  - [BOTTOM()](selectors/#bottom)
  - [FIRST()](selectors/#first)
  - [LAST()](selectors/#last)
  - [MAX()](selectors/#max)
  - [MIN()](selectors/#min)
  - [PERCENTILE()](selectors/#percentile)
  - [SAMPLE()](selectors/#sample)
  - [TOP()](selectors/#top)
- [Transformations](transformations/)
  - [ABS()](transformations/#abs)
  - [ACOS()](transformations/#acos)
  - [ASIN()](transformations/#asin)
  - [ATAN()](transformations/#atan)
  - [ATAN2()](transformations/#atan2)
  - [CEIL()](transformations/#ceil)
  - [COS()](transformations/#cos)
  - [CUMULATIVE_SUM()](transformations/#cumulative_sum)
  - [DERIVATIVE()](transformations/#derivative)
  - [DIFFERENCE()](transformations/#difference)
  - [ELAPSED()](transformations/#elapsed)
  - [EXP()](transformations/#exp)
  - [FLOOR()](transformations/#floor)
  - [HISTOGRAM()](transformations/#histogram)
  - [LN()](transformations/#ln)
  - [LOG()](transformations/#log)
  - [LOG2()](transformations/#log2)
  - [LOG10()](transformations/#log10)
  - [MOVING_AVERAGE()](transformations/#moving_average)
  - [NON_NEGATIVE_DERIVATIVE()](transformations/#non_negative_derivative)
  - [NON_NEGATIVE_DIFFERENCE()](transformations/#non_negative_difference)
  - [POW()](transformations/#pow)
  - [ROUND()](transformations/#round)
  - [SIN()](transformations/#sin)
  - [SQRT()](transformations/#sqrt)
  - [TAN()](transformations/#tan)
- [Technical analysis](technical-analysis/)
  - (Predictive analysis) [HOLT_WINTERS()](technical-analysis/#holt_winters)
  - [CHANDE_MOMENTUM_OSCILLATOR()](technical-analysis/#chande_momentum_oscillator)
  - [EXPONENTIAL_MOVING_AVERAGE()](technical-analysis/#exponential_moving_average)
  - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](technical-analysis/#double_exponential_moving_average)
  - [KAUFMANS_EFFICIENCY_RATIO()](technical-analysis/#kaufmans_adaptive_moving_average)
  - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](technical-analysis/#kaufmans_adaptive_moving_average)
  - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](technical-analysis/#triple_exponential_moving_average)
  - [TRIPLE_EXPONENTIAL_DERIVATIVE()](technical-analysis/#triple_exponential_derivative)
  - [RELATIVE_STRENGTH_INDEX()](technical-analysis/#relative_strength_index)
