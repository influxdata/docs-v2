---
title: View InfluxQL functions
description: >
  Aggregate, select, transform, and predict data with InfluxQL functions.
menu:
  influxdb_cloud_dedicated:
    name: InfluxQL functions
    parent: influxql-reference
    identifier: influxql-functions
weight: 208
---

Use InfluxQL functions to aggregate, select, transform, analyze, and predict data.

{{% note %}}
#### Missing InfluxQL functions

Some InfluxQL functions are in the process of being rearchitected to work with
the InfluxDB 3.0 storage engine. If a function you need is not here, check the
[InfluxQL feature support page](/influxdb/cloud-dedicated/reference/influxql/feature-support/#function-support)
for more information.
{{% /note %}}

## InfluxQL functions (by type)

- [Aggregates](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/)
  - [COUNT()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#count)
  - [DISTINCT()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#distinct)
  - [MEAN()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#mean)
  - [MEDIAN()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#median)
  - [STDDEV()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#stddev)
  - [SUM()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#sum)
  <!-- - [INTEGRAL()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#integral) -->
  <!-- - [MODE()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#mode) -->
  <!-- - [SPREAD()](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/#spread) -->
- [Selectors](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/)
  - [BOTTOM()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#bottom)
  - [FIRST()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#first)
  - [LAST()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#last)
  - [MAX()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#max)
  - [MIN()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#min)
  - [PERCENTILE()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#percentile)
  - [TOP()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#top)
  <!-- - [SAMPLE()](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#sample) -->
- [Transformations](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/)
  - [ABS()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#abs)
  - [ACOS()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#acos)
  - [ASIN()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#asin)
  - [ATAN()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#atan)
  - [ATAN2()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#atan2)
  - [CEIL()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#ceil)
  - [COS()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#cos)
  - [CUMULATIVE_SUM()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#cumulative_sum)
  - [DERIVATIVE()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#derivative)
  - [DIFFERENCE()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#difference)
  - [EXP()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#exp)
  - [FLOOR()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#floor)
  - [HISTOGRAM()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#histogram)
  - [LN()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#ln)
  - [LOG()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#log)
  - [LOG2()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#log2)
  - [LOG10()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#log10)
  - [MOVING_AVERAGE()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#moving_average)
  - [NON_NEGATIVE_DERIVATIVE()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#non_negative_derivative)
  - [NON_NEGATIVE_DIFFERENCE()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#non_negative_difference)
  - [POW()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#pow)
  - [ROUND()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#round)
  - [SIN()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#sin)
  - [SQRT()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#sqrt)
  - [TAN()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#tan)
  <!-- - [ELAPSED()](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#elapsed) -->
- [Date and time](/influxdb/cloud-dedicated/reference/influxql/functions/date-time/)
  - [now()](/influxdb/cloud-dedicated/reference/influxql/functions/date-time/#now)
  - [time()](/influxdb/cloud-dedicated/reference/influxql/functions/date-time/#time)
- [Miscellaneous](/influxdb/cloud-dedicated/reference/influxql/functions/misc/)
  - [fill()](/influxdb/cloud-dedicated/reference/influxql/functions/misc/#fill)
<!-- - [Technical analysis](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/) -->
  <!-- - (Predictive analysis) [HOLT_WINTERS()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#holt_winters) -->
  <!-- - [CHANDE_MOMENTUM_OSCILLATOR()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#chande_momentum_oscillator) -->
  <!-- - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#double_exponential_moving_average) -->
  <!-- - [EXPONENTIAL_MOVING_AVERAGE()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#exponential_moving_average) -->
  <!-- - [KAUFMANS_EFFICIENCY_RATIO()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average) -->
  <!-- - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average) -->
  <!-- - [RELATIVE_STRENGTH_INDEX()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#relative_strength_index) -->
  <!-- - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#triple_exponential_moving_average) -->
  <!-- - [TRIPLE_EXPONENTIAL_DERIVATIVE()](/influxdb/cloud-dedicated/reference/influxql/functions/technical-analysis/#triple_exponential_derivative) -->
