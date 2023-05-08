---
title: InfluxQL analysis functions
list_title: Technical analysis functions
description: >
  Use technical analysis functions to apply algorithms to your data.
menu:
  influxdb_cloud_dedicated:
    name: Technical analysis
    parent: influxql-functions
weight: 205
---

Use technical analysis functions to apply algorithms to your data--often used to analyze financial and investment data.

Each analysis function below covers **syntax**, including parameters to pass to the function, and **examples** of how to use the function. Examples use [NOAA water sample data](/influxdb/v2.7/reference/sample-data/#noaa-water-sample-data).

- [Predictive analysis](#predictive-analysis):
  - [HOLT_WINTERS()](#holt_winters)
- [Technical analysis](#technical-analysis-functions):
  - [CHANDE_MOMENTUM_OSCILLATOR()](#chande_momentum_oscillator)
  - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](#double_exponential_moving_average)
  - [EXPONENTIAL_MOVING_AVERAGE()](#exponential_moving_average)
  - [KAUFMANS_EFFICIENCY_RATIO()](#kaufmans_efficiency_ratio)
  - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](#kaufmans_adaptive_moving_average)
  - [RELATIVE_STRENGTH_INDEX()](#relative_strength_index)
  - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](#triple_exponential_moving_average)
  - [TRIPLE_EXPONENTIAL_DERIVATIVE()](#triple_exponential_derivative)

## Predictive analysis

Predictive analysis functions are a type of technical analysis algorithms that
predict and forecast future values.

### HOLT_WINTERS()

Returns N number of predicted [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value)
using the [Holt-Winters](https://www.otexts.org/fpp/7/5) seasonal method.
`HOLT_WINTERS_WITH_FIT()` returns the fitted values in addition to `N` seasonally
adjusted predicted field values.

Input data points must occur at regular time intervals.
To ensure regular time intervals, `HOLT_WINTERS` requires an aggregate expression
as input and a a `GROUP BY time()` to apply the aggregate operation at regular intervals.

Use `HOLT_WINTERS()` to:

- Predict when data values will cross a given threshold
- Compare predicted values with actual values to detect anomalies in your data

```sql
HOLT_WINTERS[_WITH_FIT](aggregrate_expression, N, S)
```

#### Arguments {#arguments-holt-winters}

- **aggregate_expression**: Aggregate operation on a specified expression.
  The operation can use any [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregate/).
  The expression can operate on a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.
- **N**: Number of values to predict.
  Predicted values occur at the same interval specified in the `GROUP BY time()` clause.
- **S**: Seasonal pattern length (number of values per season) to use when
  adjusting for seasonal patterns.
  To _not_ seasonally adjust predicted values, set `S` to `0` or `1.`

#### Notable behaviors

- In some cases, you may receive fewer than `N` predicted points.
  This typically occurs when the seasonal adjustment (`S`) is invalid or when
  input data is not suited for the Holt Winters algorithm.

#### Examples

The examples below use the
[NOAA Bay Area weather sample data](/influxdb/cloud-dedicated/reference/sample-data/#noaa-bay-area-weather).

{{< expand-wrapper >}}
{{% expand "Use Holt Winters to predict field values with seasonal adjustment" %}}

```sql
SELECT
  HOLT_WINTERS(MEAN(temp_avg), 12, 12)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T00:00:00Z'
GROUP BY time(30d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 |       holt_winters |
| :------------------- | -----------------: |
| 2023-01-23T00:00:00Z | 52.141810685706844 |
| 2023-02-22T00:00:00Z |  55.41941302100692 |
| 2023-03-24T00:00:00Z |  59.74300473524414 |
| 2023-04-23T00:00:00Z |  59.91932719987093 |
| 2023-05-23T00:00:00Z |  56.03083957191051 |
| 2023-06-22T00:00:00Z |  59.98437978757551 |
| 2023-07-22T00:00:00Z | 60.903170945334175 |
| 2023-08-21T00:00:00Z |  60.75738169893358 |
| 2023-09-20T00:00:00Z | 56.619132830933445 |
| 2023-10-20T00:00:00Z |  56.10559366563841 |
| 2023-11-19T00:00:00Z | 56.248977829575935 |
| 2023-12-19T00:00:00Z | 56.075540144158985 |

{{% /expand %}}
{{% expand "Use Holt Winters to predict field values with no seasonal adjustment" %}}

```sql
SELECT
  HOLT_WINTERS(MEAN(temp_avg), 12, 0)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T00:00:00Z'
GROUP BY time(30d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 |      holt_winters |
| :------------------- | ----------------: |
| 2023-01-23T00:00:00Z | 58.55632627159769 |
| 2023-02-22T00:00:00Z | 58.55632627159944 |
| 2023-03-24T00:00:00Z | 58.55632627160024 |
| 2023-04-23T00:00:00Z | 58.55632627160061 |
| 2023-05-23T00:00:00Z | 58.55632627160079 |
| 2023-06-22T00:00:00Z | 58.55632627160087 |
| 2023-07-22T00:00:00Z |  58.5563262716009 |
| 2023-08-21T00:00:00Z | 58.55632627160092 |
| 2023-09-20T00:00:00Z | 58.55632627160093 |
| 2023-10-20T00:00:00Z | 58.55632627160094 |
| 2023-11-19T00:00:00Z | 58.55632627160094 |
| 2023-12-19T00:00:00Z | 58.55632627160094 |

{{% /expand %}}

{{% expand "Use Holt Winters to predict field values with fitted values" %}}

```sql
SELECT
  HOLT_WINTERS_WITH_FIT(MEAN(temp_avg), 12, 12)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2021-01-01T00:00:00Z'
  AND time <= '2022-12-31T00:00:00Z'
GROUP BY time(30d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | holt_winters_with_fit |
| :------------------- | --------------------: |
| 2020-12-04T00:00:00Z |                  50.5 |
| 2021-01-03T00:00:00Z |    53.280924101779426 |
| 2021-02-02T00:00:00Z |    52.099111942046704 |
| 2021-03-04T00:00:00Z |     55.84541855092053 |
| 2021-04-03T00:00:00Z |     60.06803481717513 |
| 2021-05-03T00:00:00Z |    60.414989273392976 |
| 2021-06-02T00:00:00Z |    58.265755948192606 |
| 2021-07-02T00:00:00Z |     63.12426388001118 |
| 2021-08-01T00:00:00Z |     64.34281315294628 |
| 2021-08-31T00:00:00Z |    62.701261106938865 |
| 2021-09-30T00:00:00Z |     58.39095413696881 |
| 2021-10-30T00:00:00Z |    57.571954549171174 |
| 2021-11-29T00:00:00Z |     57.72622091917164 |
| 2021-12-29T00:00:00Z |     56.21981843845102 |
| 2022-01-28T00:00:00Z |    52.592076197024845 |
| 2022-02-27T00:00:00Z |     55.20608671167453 |
| 2022-03-29T00:00:00Z |     59.01290245961656 |
| 2022-04-28T00:00:00Z |     59.10660216049941 |
| 2022-05-28T00:00:00Z |     55.87577637598558 |
| 2022-06-27T00:00:00Z |     59.10005762573857 |
| 2022-07-27T00:00:00Z |     60.04395791516323 |
| 2022-08-26T00:00:00Z |     59.76994469907478 |
| 2022-09-25T00:00:00Z |     56.21467016861341 |
| 2022-10-25T00:00:00Z |     55.76538052914458 |
| 2022-11-24T00:00:00Z |     55.95817013792435 |
| 2022-12-24T00:00:00Z |     55.78474730739332 |
| 2023-01-23T00:00:00Z |     52.33558076070284 |
| 2023-02-22T00:00:00Z |     55.15350456137378 |
| 2023-03-24T00:00:00Z |     58.95292137832944 |
| 2023-04-23T00:00:00Z |     59.15381228655361 |
| 2023-05-23T00:00:00Z |     55.77542228450764 |
| 2023-06-22T00:00:00Z |     59.05797349347727 |
| 2023-07-22T00:00:00Z |     59.87830149275526 |
| 2023-08-21T00:00:00Z |    59.718176562030116 |
| 2023-09-20T00:00:00Z |     56.13817596332756 |
| 2023-10-20T00:00:00Z |    55.626497950276445 |
| 2023-11-19T00:00:00Z |     55.81338302167719 |
| 2023-12-19T00:00:00Z |     55.75008713518608 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Technical analysis functions

Technical analysis functions apply widely used algorithms to your data.
While they are primarily used in finance and investing, they have
application in other industries.

- [CHANDE_MOMENTUM_OSCILLATOR()](#chande_momentum_oscillator)
- [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](#double_exponential_moving_average)
- [EXPONENTIAL_MOVING_AVERAGE()](#exponential_moving_average)
- [KAUFMANS_EFFICIENCY_RATIO()](#kaufmans_efficiency_ratio)
- [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](#kaufmans_adaptive_moving_average)
- [RELATIVE_STRENGTH_INDEX()](#relative_strength_index)
- [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](#triple_exponential_moving_average)
- [TRIPLE_EXPONENTIAL_DERIVATIVE()](#triple_exponential_derivative)

### CHANDE_MOMENTUM_OSCILLATOR()

The Chande Momentum Oscillator (CMO) is a technical momentum indicator developed by Tushar Chande.
The CMO indicator is created by calculating the difference between the sum of all
recent higher data points and the sum of all recent lower data points,
then dividing the result by the sum of all data movement over a given time period.
The result is multiplied by 100 to give the -100 to +100 range.
{{% cite %}}[Source](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmo){{% /cite %}}

```sql
CHANDE_MOMENTUM_OSCILLATOR(field_expression, period[, hold_period[, warmup_type]])
```

#### Arguments {#arguments-cmo}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is `-1`, which means the `hold_period` is  determined by the `warmup_type` and `period`.
  Must be an integer greater than or equal to `-1`.

  | Warmup type | Default hold_period |
  | :---------- | :------------------ |
  | exponential | `period`            |
  | simple      | `period`            |
  | none        | `period - 1`        |

- **warmup_type**: Controls how the algorithm initializes the first `period` values.
  Supports the following warmup types:

  - **exponential**: _(Default)_ Exponential moving average of the first `period`
    values with scaling alpha (α).
    When this method is used and `hold_period` is unspecified or -1, the
    algorithm may start emitting points after a much smaller sample size than with _simple_.
  - **simple**: Simple moving average of the first `period` values.
  - **none**: The algorithm does not perform any warmup at all.


#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `CHANDE_MOMENTUM_OSCILLATOR()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-cmo).

  {{< expand-wrapper >}}
{{% expand "View example" %}}

```sql
SELECT
  CHANDE_MOMENTUM_OSCILLATOR(MEAN(temp_avg), 4)
FROM weather
WHERE 
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T59:59:59Z'
GROUP BY time(7d)
```

{{% /expand %}}
  {{< /expand-wrapper >}}

### DOUBLE_EXPONENTIAL_MOVING_AVERAGE()

The Double Exponential Moving Average (DEMA) attempts to remove the inherent lag
associated with moving averages by placing more weight on recent values.
The name suggests this is achieved by applying a double exponential smoothing which is not the case.
The value of an [EMA](#exponential_moving_average) is doubled.
To keep the value in line with the actual data and to remove the lag, the value "EMA of EMA"
is subtracted from the previously doubled EMA.
{{% cite %}}[Source](https://en.wikipedia.org/wiki/Double_exponential_moving_average){{% /cite %}}

```sql
DOUBLE_EXPONENTIAL_MOVING_AVERAGE(field_expression, period[, hold_period[, warmup_type]])
``` 

#### Arguments {#arguments-dema}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is `-1`, which means the `hold_period` is  determined by the `warmup_type` and `period`.
  Must be an integer greater than or equal to `-1`.

  | Warmup type | Default hold_period |
  | :---------- | :------------------ |
  | exponential | `period - 1`        |
  | simple      | `(period - 1) × 2`  |

- **warmup_type**: Controls how the algorithm initializes the first `period` values.
  Supports the following warmup types:

  - **exponential**: _(Default)_ Exponential moving average of the first `period`
    values with scaling alpha (α).
    When this method is used and `hold_period` is unspecified or -1, the
    algorithm may start emitting points after a much smaller sample size than with _simple_.
  - **simple**: Simple moving average of the first `period` values.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `DOUBLE_EXPONENTIAL_MOVING_AVERAGE()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-dema).

### EXPONENTIAL_MOVING_AVERAGE()

An exponential moving average (EMA) (or exponentially weighted moving average)
is a type of moving average similar to a
[simple moving average](/influxdb/cloud-dedicated/reference/influxql/functions/transformations/#moving_average),
except more weight is given to the latest data.

This type of moving average reacts faster to recent data changes than a simple moving average.
{{% cite %}}[Source](https://www.investopedia.com/terms/e/ema.asp){{% /cite %}}

```sql
EXPONENTIAL_MOVING_AVERAGE(field_expression, period[, hold_period[, warmup_type]])
```

#### Arguments {#arguments-ema}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is `-1`, which means the `hold_period` is  determined by the `warmup_type` and `period`.
  Must be an integer greater than or equal to `-1`.

  | Warmup type | Default hold_period |
  | :---------- | :------------------ |
  | exponential | `period - 1`        |
  | simple      | `period - 1`        |

- **warmup_type**: Controls how the algorithm initializes the first `period` values.
  Supports the following warmup types:

  - **exponential**: _(Default)_ Exponential moving average of the first `period`
    values with scaling alpha (α).
    When this method is used and `hold_period` is unspecified or -1, the
    algorithm may start emitting points after a much smaller sample size than with _simple_.
  - **simple**: Simple moving average of the first `period` values.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `EXPONENTIAL_MOVING_AVERAGE()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-ema).

### KAUFMANS_EFFICIENCY_RATIO()

Kaufman's Efficiency Ration, or simply "Efficiency Ratio" (ER), is calculated by
dividing the data change over a period by the absolute sum of the data movements
that occurred to achieve that change.
The resulting ratio ranges between 0 and 1 with higher values representing a
more efficient or trending market.

The ER is very similar to the [Chande Momentum Oscillator](#chande_momentum_oscillator) (CMO).
The difference is that the CMO takes market direction into account, but if you
take the absolute CMO and divide by 100, you you get the Efficiency Ratio.
{{% cite %}}[Source](http://etfhq.com/blog/2011/02/07/kaufmans-efficiency-ratio/){{% /cite %}}

```sql
KAUFMANS_EFFICIENCY_RATIO(field_expression, period[, hold_period])
```

#### Arguments {#arguments-er}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is the same as `period`.
  Must be an integer greater than or equal to `1`.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `KAUFMANS_EFFICIENCY_RATIO()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-er).

### KAUFMANS_ADAPTIVE_MOVING_AVERAGE()

Kaufman's Adaptive Moving Average (KAMA) is a moving average designed to account
for sample noise or volatility.
KAMA will closely follow data points when the data swings are relatively small and noise is low.
KAMA will adjust when the data swings widen and follow data from a greater distance.
This trend-following indicator can be used to identify the overall trend,
time turning points and filter data movements.
{{% cite %}}[Source](http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:kaufman_s_adaptive_moving_average){{% /cite %}}

```sql
KAUFMANS_ADAPTIVE_MOVING_AVERAGE(field_expression, period[, hold_period])
```

#### Arguments {#arguments-kama}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is the same as `period`.
  Must be an integer greater than or equal to `1`.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `KAUFMANS_ADAPTIVE_MOVING_AVERAGE()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-kama).

### RELATIVE_STRENGTH_INDEX()

The relative strength index (RSI) is a momentum indicator that compares the
magnitude of recent increases and decreases over a specified time period to
measure speed and change of data movements.
{{% cite %}}[Source](https://www.investopedia.com/terms/r/rsi.asp){{% /cite %}}

```sql
RELATIVE_STRENGTH_INDEX(field_expression, period[, hold_period[, warmup_type]])
```

#### Arguments {#arguments-rsi}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is `-1`, which means the `hold_period` is the same as the `period`.
  Must be an integer greater than or equal to `-1`.
- **warmup_type**: Controls how the algorithm initializes the first `period` values.
  Supports the following warmup types:

  - **exponential**: _(Default)_ Exponential moving average of the first `period`
    values with scaling alpha (α).
    When this method is used and `hold_period` is unspecified or -1, the
    algorithm may start emitting points after a much smaller sample size than with _simple_.
  - **simple**: Simple moving average of the first `period` values.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `TRIPLE_EXPONENTIAL_DERIVATIVE()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-rsi).

### TRIPLE_EXPONENTIAL_MOVING_AVERAGE()

The triple exponential moving average (TEMA) filters out volatility from
conventional moving averages.
While the name implies that it's a triple exponential smoothing, it's actually a
composite of a [single exponential moving average](#exponential_moving_average),
a [double exponential moving average](#double_exponential_moving_average),
and a triple exponential moving average.
{{% cite %}}[Source](https://www.investopedia.com/terms/t/triple-exponential-moving-average.asp){{% /cite %}}

```sql
TRIPLE_EXPONENTIAL_MOVING_AVERAGE(field_expression, period[, hold_period[, warmup_type]])
```

#### Arguments {#arguments-tema}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is `-1`, which means the `hold_period` is  determined by the `warmup_type` and `period`.
  Must be an integer greater than or equal to `-1`.

  | Warmup type | Default hold_period |
  | :---------- | :------------------ |
  | exponential | `period - 1`        |
  | simple      | `(period - 1) × 3`  |

- **warmup_type**: Controls how the algorithm initializes the first `period` values.
  Supports the following warmup types:

  - **exponential**: _(Default)_ Exponential moving average of the first `period`
    values with scaling alpha (α).
    When this method is used and `hold_period` is unspecified or -1, the
    algorithm may start emitting points after a much smaller sample size than with _simple_.
  - **simple**: Simple moving average of the first `period` values.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `TRIPLE_EXPONENTIAL_MOVING_AVERAGE()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-tema).

### TRIPLE_EXPONENTIAL_DERIVATIVE()

The triple exponential derivative indicator, commonly referred to as "TRIX," is
an oscillator used to identify oversold and overbought markets, and can also be
used as a momentum indicator.
TRIX calculates a [triple exponential moving average](#triple_exponential_moving_average)
of the [log](/influxdb/v2.7/query-data/influxql/functions/transformations/#log)
of the data input over the period of time.
The previous value is subtracted from the previous value.
This prevents cycles that are shorter than the defined period from being considered by the indicator.

Like many oscillators, TRIX oscillates around a zero line. When used as an oscillator,
a positive value indicates an overbought market while a negative value indicates an oversold market.
When used as a momentum indicator, a positive value suggests momentum is increasing
while a negative value suggests momentum is decreasing.
Many analysts believe that when the TRIX crosses above the zero line it gives a
buy signal, and when it closes below the zero line, it gives a sell signal.
{{% cite %}}[Source](https://www.investopedia.com/articles/technical/02/092402.asp){{% /cite %}}

```sql
TRIPLE_EXPONENTIAL_DERIVATIVE(field_expression, period[, hold_period[, warmup_type]])
```

#### Arguments {#arguments-trix}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports numeric field types.
- **period**: Number of values to use as the sample size for the algorithm.
  Supports integers greater than or equal to 1.
  This also controls the exponential decay rate (α) used to determine the weight
  of an historical value.
  With a period of `3`, the algorithm uses the current value and the previous
  two values.  
- **hold_period**: Number of values the algorithm needs before emitting results.
  Default is `-1`, which means the `hold_period` is  determined by the `warmup_type` and `period`.
  Must be an integer greater than or equal to `-1`.

  | Warmup type | Default hold_period    |
  | :---------- | :--------------------- |
  | exponential | `period`               |
  | simple      | `(period - 1) × 3 + 1` |

- **warmup_type**: Controls how the algorithm initializes the first `period` values.
  Supports the following warmup types:

  - **exponential**: _(Default)_ Exponential moving average of the first `period`
    values with scaling alpha (α).
    When this method is used and `hold_period` is unspecified or -1, the
    algorithm may start emitting points after a much smaller sample size than with _simple_.
  - **simple**: Simple moving average of the first `period` values.

#### Notable behaviors

- Supports `GROUP BY` clauses that group by tags, but not `GROUP BY` clauses that group by time.
  To use `TRIPLE_EXPONENTIAL_DERIVATIVE()` with a `GROUP BY time()` clause, apply
  an [aggregate function](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates)
  to the [field_expression](#arguments-trix).
