Use InfluxQL functions to aggregate, select, transform, analyze, and predict data.

> [!Note]
>
> #### Missing InfluxQL functions
> 
> Some InfluxQL functions are in the process of being rearchitected to work with
> the InfluxDB 3 storage engine. If a function you need is not here, check the
> [InfluxQL feature support page](/influxdb/version/reference/influxql/feature-support/#function-support)
> for more information.

## InfluxQL functions (by type)

- [Aggregates](/influxdb/version/reference/influxql/functions/aggregates/)
  - [COUNT()](/influxdb/version/reference/influxql/functions/aggregates/#count)
  - [DISTINCT()](/influxdb/version/reference/influxql/functions/aggregates/#distinct)
  - [MEAN()](/influxdb/version/reference/influxql/functions/aggregates/#mean)
  - [MEDIAN()](/influxdb/version/reference/influxql/functions/aggregates/#median)
  - [MODE()](/influxdb/version/reference/influxql/functions/aggregates/#mode)
  - [SPREAD()](/influxdb/version/reference/influxql/functions/aggregates/#spread)
  - [STDDEV()](/influxdb/version/reference/influxql/functions/aggregates/#stddev)
  - [SUM()](/influxdb/version/reference/influxql/functions/aggregates/#sum)
  <!-- - [INTEGRAL()](/influxdb/version/reference/influxql/functions/aggregates/#integral) -->
- [Selectors](/influxdb/version/reference/influxql/functions/selectors/)
  - [BOTTOM()](/influxdb/version/reference/influxql/functions/selectors/#bottom)
  - [FIRST()](/influxdb/version/reference/influxql/functions/selectors/#first)
  - [LAST()](/influxdb/version/reference/influxql/functions/selectors/#last)
  - [MAX()](/influxdb/version/reference/influxql/functions/selectors/#max)
  - [MIN()](/influxdb/version/reference/influxql/functions/selectors/#min)
  - [PERCENTILE()](/influxdb/version/reference/influxql/functions/selectors/#percentile)
  - [TOP()](/influxdb/version/reference/influxql/functions/selectors/#top)
  <!-- - [SAMPLE()](/influxdb/version/reference/influxql/functions/selectors/#sample) -->
- [Transformations](/influxdb/version/reference/influxql/functions/transformations/)
  - [ABS()](/influxdb/version/reference/influxql/functions/transformations/#abs)
  - [ACOS()](/influxdb/version/reference/influxql/functions/transformations/#acos)
  - [ASIN()](/influxdb/version/reference/influxql/functions/transformations/#asin)
  - [ATAN()](/influxdb/version/reference/influxql/functions/transformations/#atan)
  - [ATAN2()](/influxdb/version/reference/influxql/functions/transformations/#atan2)
  - [CEIL()](/influxdb/version/reference/influxql/functions/transformations/#ceil)
  - [COS()](/influxdb/version/reference/influxql/functions/transformations/#cos)
  - [CUMULATIVE_SUM()](/influxdb/version/reference/influxql/functions/transformations/#cumulative_sum)
  - [DERIVATIVE()](/influxdb/version/reference/influxql/functions/transformations/#derivative)
  - [DIFFERENCE()](/influxdb/version/reference/influxql/functions/transformations/#difference)
  - [EXP()](/influxdb/version/reference/influxql/functions/transformations/#exp)
  - [FLOOR()](/influxdb/version/reference/influxql/functions/transformations/#floor)
  - [HISTOGRAM()](/influxdb/version/reference/influxql/functions/transformations/#histogram)
  - [LN()](/influxdb/version/reference/influxql/functions/transformations/#ln)
  - [LOG()](/influxdb/version/reference/influxql/functions/transformations/#log)
  - [LOG2()](/influxdb/version/reference/influxql/functions/transformations/#log2)
  - [LOG10()](/influxdb/version/reference/influxql/functions/transformations/#log10)
  - [MOVING_AVERAGE()](/influxdb/version/reference/influxql/functions/transformations/#moving_average)
  - [NON_NEGATIVE_DERIVATIVE()](/influxdb/version/reference/influxql/functions/transformations/#non_negative_derivative)
  - [NON_NEGATIVE_DIFFERENCE()](/influxdb/version/reference/influxql/functions/transformations/#non_negative_difference)
  - [POW()](/influxdb/version/reference/influxql/functions/transformations/#pow)
  - [ROUND()](/influxdb/version/reference/influxql/functions/transformations/#round)
  - [SIN()](/influxdb/version/reference/influxql/functions/transformations/#sin)
  - [SQRT()](/influxdb/version/reference/influxql/functions/transformations/#sqrt)
  - [TAN()](/influxdb/version/reference/influxql/functions/transformations/#tan)
  <!-- - [ELAPSED()](/influxdb/version/reference/influxql/functions/transformations/#elapsed) -->
- [Date and time](/influxdb/version/reference/influxql/functions/date-time/)
  - [now()](/influxdb/version/reference/influxql/functions/date-time/#now)
  - [time()](/influxdb/version/reference/influxql/functions/date-time/#time)
- [Miscellaneous](/influxdb/version/reference/influxql/functions/misc/)
  - [fill()](/influxdb/version/reference/influxql/functions/misc/#fill)
<!-- - [Technical analysis](/influxdb/version/reference/influxql/functions/technical-analysis/) -->
  <!-- - (Predictive analysis) [HOLT_WINTERS()](/influxdb/version/reference/influxql/functions/technical-analysis/#holt_winters) -->
  <!-- - [CHANDE_MOMENTUM_OSCILLATOR()](/influxdb/version/reference/influxql/functions/technical-analysis/#chande_momentum_oscillator) -->
  <!-- - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/version/reference/influxql/functions/technical-analysis/#double_exponential_moving_average) -->
  <!-- - [EXPONENTIAL_MOVING_AVERAGE()](/influxdb/version/reference/influxql/functions/technical-analysis/#exponential_moving_average) -->
  <!-- - [KAUFMANS_EFFICIENCY_RATIO()](/influxdb/version/reference/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average) -->
  <!-- - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](/influxdb/version/reference/influxql/functions/technical-analysis/#kaufmans_adaptive_moving_average) -->
  <!-- - [RELATIVE_STRENGTH_INDEX()](/influxdb/version/reference/influxql/functions/technical-analysis/#relative_strength_index) -->
  <!-- - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](/influxdb/version/reference/influxql/functions/technical-analysis/#triple_exponential_moving_average) -->
  <!-- - [TRIPLE_EXPONENTIAL_DERIVATIVE()](/influxdb/version/reference/influxql/functions/technical-analysis/#triple_exponential_derivative) -->
