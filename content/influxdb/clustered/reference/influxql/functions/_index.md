---
title: View InfluxQL functions
description: >
  Aggregate, select, transform, and predict data with InfluxQL functions.
menu:
  influxdb_clustered:
    name: InfluxQL functions
    parent: influxql-reference
    identifier: influxql-functions
weight: 208
---

Use InfluxQL functions to aggregate, select, transform, analyze, and predict data.

{{% note %}}
#### Missing InfluxQL functions

Some InfluxQL functions are in the process of being rearchitected to work with
the InfluxDB v3 storage engine. If a function you need is not here, check the
[InfluxQL feature support page](/influxdb/clustered/reference/influxql/feature-support/#function-support)
for more information.
{{% /note %}}

## InfluxQL functions (by type)

- [Aggregates](/influxdb/clustered/reference/influxql/functions/aggregates/)
  - [COUNT()](/influxdb/clustered/reference/influxql/functions/aggregates/#count)
  - [DISTINCT()](/influxdb/clustered/reference/influxql/functions/aggregates/#distinct)
  - [MEAN()](/influxdb/clustered/reference/influxql/functions/aggregates/#mean)
  - [MEDIAN()](/influxdb/clustered/reference/influxql/functions/aggregates/#median)
  - [STDDEV()](/influxdb/clustered/reference/influxql/functions/aggregates/#stddev)
  - [SUM()](/influxdb/clustered/reference/influxql/functions/aggregates/#sum)
  <!-- - [INTEGRAL()](/influxdb/clustered/reference/influxql/functions/aggregates/#integral) -->
  <!-- - [MODE()](/influxdb/clustered/reference/influxql/functions/aggregates/#mode) -->
  <!-- - [SPREAD()](/influxdb/clustered/reference/influxql/functions/aggregates/#spread) -->
- [Selectors](/influxdb/clustered/reference/influxql/functions/selectors/)
  - [BOTTOM()](/influxdb/clustered/reference/influxql/functions/selectors/#bottom)
  - [FIRST()](/influxdb/clustered/reference/influxql/functions/selectors/#first)
  - [LAST()](/influxdb/clustered/reference/influxql/functions/selectors/#last)
  - [MAX()](/influxdb/clustered/reference/influxql/functions/selectors/#max)
  - [MIN()](/influxdb/clustered/reference/influxql/functions/selectors/#min)
  - [PERCENTILE()](/influxdb/clustered/reference/influxql/functions/selectors/#percentile)
  - [TOP()](/influxdb/clustered/reference/influxql/functions/selectors/#top)
  <!-- - [SAMPLE()](/influxdb/clustered/reference/influxql/functions/selectors/#sample) -->
- [Transformations](/influxdb/clustered/reference/influxql/functions/transformations/)
  - [ABS()](/influxdb/clustered/reference/influxql/functions/transformations/#abs)
  - [ACOS()](/influxdb/clustered/reference/influxql/functions/transformations/#acos)
  - [ASIN()](/influxdb/clustered/reference/influxql/functions/transformations/#asin)
  - [ATAN()](/influxdb/clustered/reference/influxql/functions/transformations/#atan)
  - [ATAN2()](/influxdb/clustered/reference/influxql/functions/transformations/#atan2)
  - [CEIL()](/influxdb/clustered/reference/influxql/functions/transformations/#ceil)
  - [COS()](/influxdb/clustered/reference/influxql/functions/transformations/#cos)
  - [CUMULATIVE_SUM()](/influxdb/clustered/reference/influxql/functions/transformations/#cumulative_sum)
  - [DERIVATIVE()](/influxdb/clustered/reference/influxql/functions/transformations/#derivative)
  - [DIFFERENCE()](/influxdb/clustered/reference/influxql/functions/transformations/#difference)
  - [EXP()](/influxdb/clustered/reference/influxql/functions/transformations/#exp)
  - [FLOOR()](/influxdb/clustered/reference/influxql/functions/transformations/#floor)
  - [HISTOGRAM()](/influxdb/clustered/reference/influxql/functions/transformations/#histogram)
  - [LN()](/influxdb/clustered/reference/influxql/functions/transformations/#ln)
  - [LOG()](/influxdb/clustered/reference/influxql/functions/transformations/#log)
  - [LOG2()](/influxdb/clustered/reference/influxql/functions/transformations/#log2)
  - [LOG10()](/influxdb/clustered/reference/influxql/functions/transformations/#log10)
  - [MOVING_AVERAGE()](/influxdb/clustered/reference/influxql/functions/transformations/#moving_average)
  - [NON_NEGATIVE_DERIVATIVE()](/influxdb/clustered/reference/influxql/functions/transformations/#non_negative_derivative)
  - [NON_NEGATIVE_DIFFERENCE()](/influxdb/clustered/reference/influxql/functions/transformations/#non_negative_difference)
  - [POW()](/influxdb/clustered/reference/influxql/functions/transformations/#pow)
  - [ROUND()](/influxdb/clustered/reference/influxql/functions/transformations/#round)
  - [SIN()](/influxdb/clustered/reference/influxql/functions/transformations/#sin)
  - [SQRT()](/influxdb/clustered/reference/influxql/functions/transformations/#sqrt)
  - [TAN()](/influxdb/clustered/reference/influxql/functions/transformations/#tan)
  <!-- - [ELAPSED()](/influxdb/clustered/reference/influxql/functions/transformations/#elapsed) -->
- [Date and time](/influxdb/clustered/reference/influxql/functions/date-time/)
  - [now()](/influxdb/clustered/reference/influxql/functions/date-time/#now)
  - [time()](/influxdb/clustered/reference/influxql/functions/date-time/#time)
- [Miscellaneous](/influxdb/clustered/reference/influxql/functions/misc/)
  - [fill()](/influxdb/clustered/reference/influxql/functions/misc/#fill)
<!-- - [Technical analysis](/influxdb/clustered/reference/influxql/functions/technical-analysis/) -->
  <!-- - (Predictive analysis) [HOLT_WINTERS()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#holt_winters) -->
  <!-- - [CHANDE_MOMENTUM_OSCILLATOR()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#chande_momentum_oscillator) -->
  <!-- - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#double_exponential_moving_average) -->
  <!-- - [EXPONENTIAL_MOVING_AVERAGE()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#exponential_moving_average) -->
  <!-- - [KAUFMANS_EFFICIENCY_RATIO()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average) -->
  <!-- - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average) -->
  <!-- - [RELATIVE_STRENGTH_INDEX()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#relative_strength_index) -->
  <!-- - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#triple_exponential_moving_average) -->
  <!-- - [TRIPLE_EXPONENTIAL_DERIVATIVE()](/influxdb/clustered/reference/influxql/functions/technical-analysis/#triple_exponential_derivative) -->
