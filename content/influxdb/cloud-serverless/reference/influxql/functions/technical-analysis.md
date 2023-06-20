---
title: InfluxQL analysis functions
list_title: Technical analysis functions
description: >
  Use technical analysis functions to apply algorithms to your time series data.
menu:
  influxdb_cloud_serverless:
    name: Technical analysis
    parent: influxql-functions
weight: 205
# None of these functions work yet so listing as draft
draft: true
---

Use technical analysis functions to apply algorithms to your time series data.
Many of these algorithms are often used to analyze financial and investment data,
but have application in other use cases as well.

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

Returns N number of predicted [field values](/influxdb/cloud-serverless/reference/glossary/#field-value)
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
  The operation can use any [aggregate function](/influxdb/cloud-serverless/reference/influxql/functions/aggregate/).
  The expression can operate on a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

The following examples use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

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

- [Notable behaviors of technical analysis functions](#notable-behaviors-of-technical-analysis-functions)
- [CHANDE_MOMENTUM_OSCILLATOR()](#chande_momentum_oscillator)
- [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](#double_exponential_moving_average)
- [EXPONENTIAL_MOVING_AVERAGE()](#exponential_moving_average)
- [KAUFMANS_EFFICIENCY_RATIO()](#kaufmans_efficiency_ratio)
- [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](#kaufmans_adaptive_moving_average)
- [RELATIVE_STRENGTH_INDEX()](#relative_strength_index)
- [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](#triple_exponential_moving_average)
- [TRIPLE_EXPONENTIAL_DERIVATIVE()](#triple_exponential_derivative)

### Notable behaviors of technical analysis functions

#### Must use aggregate or selector functions when grouping by time

All technical analysis functions support `GROUP BY` clauses that group by tags,
but do not directly support `GROUP BY` clauses that group by time.
To use technical analysis functions with with a `GROUP BY time()` clause, apply
an [aggregate](/influxdb/cloud-serverless/reference/influxql/functions/aggregates/)
or [selector](/influxdb/cloud-serverless/reference/influxql/functions/selectors/)
function to the **field_expression** argument.
The technical analysis function operates on the result of the aggregate or
selector operation.

---

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `CHANDE_MOMENTUM_OSCILLATOR` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  CHANDE_MOMENTUM_OSCILLATOR(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | chande_momentum_oscillator |
| :------------------- | -------------------------: |
| 2022-01-01T11:00:00Z |          53.84615384615377 |
| 2022-01-01T12:00:00Z |           55.5555555555555 |
| 2022-01-01T13:00:00Z |        -19.999999999999858 |
| 2022-01-01T14:00:00Z |         14.285714285714432 |
| 2022-01-01T15:00:00Z |          59.99999999999972 |
| 2022-01-01T16:00:00Z |        -14.285714285714432 |
| 2022-01-01T17:00:00Z |        -14.285714285714432 |
| 2022-01-01T18:00:00Z |          38.46153846153834 |
| 2022-01-01T19:00:00Z |          28.57142857142868 |
| 2022-01-01T20:00:00Z |                         20 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `CHANDE_MOMENTUM_OSCILLATOR` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  CHANDE_MOMENTUM_OSCILLATOR(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | chande_momentum_oscillator_co | chande_momentum_oscillator_hum | chande_momentum_oscillator_temp |
| :------------------- | ----------------------------: | -----------------------------: | ------------------------------: |
| 2022-01-01T11:00:00Z |                             0 |                             20 |               53.84615384615377 |
| 2022-01-01T12:00:00Z |                             0 |                             20 |                55.5555555555555 |
| 2022-01-01T13:00:00Z |                           100 |              42.85714285714228 |             -19.999999999999858 |
| 2022-01-01T14:00:00Z |                           100 |             24.999999999999332 |              14.285714285714432 |
| 2022-01-01T15:00:00Z |                           100 |             25.000000000000444 |               59.99999999999972 |
| 2022-01-01T16:00:00Z |                           100 |                              0 |             -14.285714285714432 |
| 2022-01-01T17:00:00Z |                           100 |                           -100 |             -14.285714285714432 |
| 2022-01-01T18:00:00Z |                           100 |               50.0000000000003 |               38.46153846153834 |
| 2022-01-01T19:00:00Z |                           100 |               28.5714285714285 |               28.57142857142868 |
| 2022-01-01T20:00:00Z |                           100 |             38.461538461538545 |                              20 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `CHANDE_MOMENTUM_OSCILLATOR` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  CHANDE_MOMENTUM_OSCILLATOR(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | chande_momentum_oscillator |
| :------------------- | -------------------------: |
| 2022-01-01T14:00:00Z |         14.285714285714432 |
| 2022-01-01T15:00:00Z |          59.99999999999972 |
| 2022-01-01T16:00:00Z |        -14.285714285714432 |
| 2022-01-01T17:00:00Z |        -14.285714285714432 |
| 2022-01-01T18:00:00Z |          38.46153846153834 |
| 2022-01-01T19:00:00Z |          28.57142857142868 |
| 2022-01-01T20:00:00Z |                         20 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `CHANDE_MOMENTUM_OSCILLATOR` with a default non-default warmup type" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  CHANDE_MOMENTUM_OSCILLATOR(temp, 4, -1, 'simple')
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | chande_momentum_oscillator |
| :------------------- | -------------------------: |
| 2022-01-01T12:00:00Z |           94.9367088607595 |
| 2022-01-01T13:00:00Z |          95.04132231404957 |
| 2022-01-01T14:00:00Z |          95.04132231404955 |
| 2022-01-01T15:00:00Z |          92.68218929543389 |
| 2022-01-01T16:00:00Z |          83.79002019036625 |
| 2022-01-01T17:00:00Z |          84.72964405398058 |
| 2022-01-01T18:00:00Z |          86.77405015296912 |
| 2022-01-01T19:00:00Z |          76.28466518769179 |
| 2022-01-01T20:00:00Z |         53.322717259176535 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `CHANDE_MOMENTUM_OSCILLATOR` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  CHANDE_MOMENTUM_OSCILLATOR(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | chande_momentum_oscillator |
| :------------------- | -------------------------: |
| 2020-07-07T00:00:00Z |                        100 |
| 2020-10-05T00:00:00Z |         21.498959056210964 |
| 2021-01-03T00:00:00Z |         2.0072053525475924 |
| 2021-04-03T00:00:00Z |         -6.190741773563866 |
| 2021-07-02T00:00:00Z |         -8.924485125858132 |
| 2021-09-30T00:00:00Z |         1.2078830260648301 |
| 2021-12-29T00:00:00Z |         -5.181655747468743 |
| 2022-03-29T00:00:00Z |           -2.3768115942029 |
| 2022-06-27T00:00:00Z |          6.511381683430422 |
| 2022-09-25T00:00:00Z |        -7.7487391104997485 |
| 2022-12-24T00:00:00Z |          2.928763268960232 |

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `DOUBLE_EXPONENTIAL_MOVING_AVERAGE` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  DOUBLE_EXPONENTIAL_MOVING_AVERAGE(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | double_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2022-01-01T11:00:00Z |                22.630333333333333 |
| 2022-01-01T12:00:00Z |                           22.5854 |
| 2022-01-01T13:00:00Z |                22.747560000000004 |
| 2022-01-01T14:00:00Z |                         22.814328 |
| 2022-01-01T15:00:00Z |                22.772071999999998 |
| 2022-01-01T16:00:00Z |                       22.55332832 |
| 2022-01-01T17:00:00Z |                22.642048063999997 |
| 2022-01-01T18:00:00Z |                     23.0672594816 |
| 2022-01-01T19:00:00Z |                    23.12957407488 |
| 2022-01-01T20:00:00Z |                    22.89127547648 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `DOUBLE_EXPONENTIAL_MOVING_AVERAGE` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  DOUBLE_EXPONENTIAL_MOVING_AVERAGE(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | double_exponential_moving_average_co | double_exponential_moving_average_hum | double_exponential_moving_average_temp |
| :------------------- | -----------------------------------: | ------------------------------------: | -------------------------------------: |
| 2022-01-01T11:00:00Z |                                    0 |                    36.056000000000004 |                     22.630333333333333 |
| 2022-01-01T12:00:00Z |                                    0 |                    36.019200000000005 |                                22.5854 |
| 2022-01-01T13:00:00Z |                                 0.64 |                    36.322880000000005 |                     22.747560000000004 |
| 2022-01-01T14:00:00Z |                   0.9279999999999999 |                    36.332544000000006 |                              22.814328 |
| 2022-01-01T15:00:00Z |                               2.3232 |                    36.266816000000006 |                     22.772071999999998 |
| 2022-01-01T16:00:00Z |                              5.49376 |                    36.104463360000004 |                            22.55332832 |
| 2022-01-01T17:00:00Z |                              8.15616 |                          36.029302272 |                     22.642048063999997 |
| 2022-01-01T18:00:00Z |                           15.0096384 |                    36.573555916800004 |                          23.0672594816 |
| 2022-01-01T19:00:00Z |                          20.51534848 |                        36.62971828224 |                         23.12957407488 |
| 2022-01-01T20:00:00Z |                         25.294948352 |                    36.581181808640004 |                         22.89127547648 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `DOUBLE_EXPONENTIAL_MOVING_AVERAGE` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  DOUBLE_EXPONENTIAL_MOVING_AVERAGE(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | double_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2022-01-01T14:00:00Z |                         22.814328 |
| 2022-01-01T15:00:00Z |                22.772071999999998 |
| 2022-01-01T16:00:00Z |                       22.55332832 |
| 2022-01-01T17:00:00Z |                22.642048063999997 |
| 2022-01-01T18:00:00Z |                     23.0672594816 |
| 2022-01-01T19:00:00Z |                    23.12957407488 |
| 2022-01-01T20:00:00Z |                    22.89127547648 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `DOUBLE_EXPONENTIAL_MOVING_AVERAGE` with a default non-default warmup type" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  DOUBLE_EXPONENTIAL_MOVING_AVERAGE(temp, 4, -1, 'simple')
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | double_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2022-01-01T14:00:00Z |                           22.8312 |
| 2022-01-01T15:00:00Z |                22.792303999999998 |
| 2022-01-01T16:00:00Z |                        22.5715328 |
| 2022-01-01T17:00:00Z |                       22.65660992 |
| 2022-01-01T18:00:00Z |                      23.078180096 |
| 2022-01-01T19:00:00Z |                      23.137436544 |
| 2022-01-01T20:00:00Z |                    22.89677901824 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `DOUBLE_EXPONENTIAL_MOVING_AVERAGE` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  DOUBLE_EXPONENTIAL_MOVING_AVERAGE(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | double_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2020-07-07T00:00:00Z |                 63.01034259259259 |
| 2020-10-05T00:00:00Z |                 59.68671666666667 |
| 2021-01-03T00:00:00Z |                56.266558888888895 |
| 2021-04-03T00:00:00Z |                 58.20687488888889 |
| 2021-07-02T00:00:00Z |                61.229622000000006 |
| 2021-09-30T00:00:00Z |                 58.78596032888889 |
| 2021-12-29T00:00:00Z |                  55.1067106968889 |
| 2022-03-29T00:00:00Z |                57.311773784533344 |
| 2022-06-27T00:00:00Z |                 61.66637935722668 |
| 2022-09-25T00:00:00Z |                 57.77452777735112 |
| 2022-12-24T00:00:00Z |                55.044203430886405 |

{{% /expand %}}
{{< /expand-wrapper >}}

### EXPONENTIAL_MOVING_AVERAGE()

An exponential moving average (EMA) (or exponentially weighted moving average)
is a type of moving average similar to a
[simple moving average](/influxdb/cloud-serverless/reference/influxql/functions/transformations/#moving_average),
except more weight is given to the latest data.

This type of moving average reacts faster to recent data changes than a simple moving average.
{{% cite %}}[Source](https://www.investopedia.com/terms/e/ema.asp){{% /cite %}}

```sql
EXPONENTIAL_MOVING_AVERAGE(field_expression, period[, hold_period[, warmup_type]])
```

#### Arguments {#arguments-ema}

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `EXPONENTIAL_MOVING_AVERAGE` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  EXPONENTIAL_MOVING_AVERAGE(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | exponential_moving_average |
| :------------------- | -------------------------: |
| 2022-01-01T11:00:00Z |                      22.47 |
| 2022-01-01T12:00:00Z |                     22.482 |
| 2022-01-01T13:00:00Z |                    22.6092 |
| 2022-01-01T14:00:00Z |                   22.68552 |
| 2022-01-01T15:00:00Z |                  22.691312 |
| 2022-01-01T16:00:00Z |                 22.5747872 |
| 2022-01-01T17:00:00Z |         22.624872319999998 |
| 2022-01-01T18:00:00Z |               22.894923392 |
| 2022-01-01T19:00:00Z |              22.9769540352 |
| 2022-01-01T20:00:00Z |         22.866172421119998 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `EXPONENTIAL_MOVING_AVERAGE` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  EXPONENTIAL_MOVING_AVERAGE(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | exponential_moving_average_co | exponential_moving_average_hum | exponential_moving_average_temp |
| :------------------- | ----------------------------: | -----------------------------: | ------------------------------: |
| 2022-01-01T11:00:00Z |                             0 |                          36.06 |                           22.47 |
| 2022-01-01T12:00:00Z |                             0 |                         36.036 |                          22.482 |
| 2022-01-01T13:00:00Z |                           0.4 |                        36.2216 |                         22.6092 |
| 2022-01-01T14:00:00Z |                          0.64 |                       36.25296 |                        22.68552 |
| 2022-01-01T15:00:00Z |                         1.584 |                      36.231776 |                       22.691312 |
| 2022-01-01T16:00:00Z |            3.7504000000000004 |                     36.1390656 |                      22.5747872 |
| 2022-01-01T17:00:00Z |                       5.85024 |                    36.08343936 |              22.624872319999998 |
| 2022-01-01T18:00:00Z |                     10.710144 |                   36.410063616 |                    22.894923392 |
| 2022-01-01T19:00:00Z |                    15.2260864 |                  36.4860381696 |                   22.9769540352 |
| 2022-01-01T20:00:00Z |                   19.53565184 |                 36.49162290176 |              22.866172421119998 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `EXPONENTIAL_MOVING_AVERAGE` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  EXPONENTIAL_MOVING_AVERAGE(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | exponential_moving_average |
| :------------------- | -------------------------: |
| 2022-01-01T14:00:00Z |                   22.68552 |
| 2022-01-01T15:00:00Z |                  22.691312 |
| 2022-01-01T16:00:00Z |                 22.5747872 |
| 2022-01-01T17:00:00Z |         22.624872319999998 |
| 2022-01-01T18:00:00Z |               22.894923392 |
| 2022-01-01T19:00:00Z |              22.9769540352 |
| 2022-01-01T20:00:00Z |         22.866172421119998 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `EXPONENTIAL_MOVING_AVERAGE` with a default non-default warmup type" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  EXPONENTIAL_MOVING_AVERAGE(temp, 4, -1, 'simple')
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | exponential_moving_average |
| :------------------- | -------------------------: |
| 2022-01-01T11:00:00Z |                     22.275 |
| 2022-01-01T12:00:00Z |                     22.365 |
| 2022-01-01T13:00:00Z |         22.538999999999998 |
| 2022-01-01T14:00:00Z |                    22.6434 |
| 2022-01-01T15:00:00Z |                   22.66604 |
| 2022-01-01T16:00:00Z |                  22.559624 |
| 2022-01-01T17:00:00Z |                 22.6157744 |
| 2022-01-01T18:00:00Z |                22.88946464 |
| 2022-01-01T19:00:00Z |               22.973678784 |
| 2022-01-01T20:00:00Z |              22.8642072704 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `EXPONENTIAL_MOVING_AVERAGE` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  EXPONENTIAL_MOVING_AVERAGE(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | exponential_moving_average |
| :------------------- | -------------------------: |
| 2020-07-07T00:00:00Z |         59.971944444444446 |
| 2020-10-05T00:00:00Z |          58.65427777777778 |
| 2021-01-03T00:00:00Z |          56.77478888888889 |
| 2021-04-03T00:00:00Z |          57.86042888888889 |
| 2021-07-02T00:00:00Z |         59.836257333333336 |
| 2021-09-30T00:00:00Z |         58.657309955555554 |
| 2021-12-29T00:00:00Z |          56.38994152888889 |
| 2022-03-29T00:00:00Z |          57.44729825066667 |
| 2022-06-27T00:00:00Z |          60.13504561706667 |
| 2022-09-25T00:00:00Z |         58.085471814684446 |
| 2022-12-24T00:00:00Z |          56.30128308881067 |

{{% /expand %}}
{{< /expand-wrapper >}}

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `KAUFMANS_EFFICIENCY_RATIO` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  KAUFMANS_EFFICIENCY_RATIO(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | kaufmans_efficiency_ratio |
| :------------------- | ------------------------: |
| 2022-01-01T12:00:00Z |         0.555555555555555 |
| 2022-01-01T13:00:00Z |       0.19999999999999857 |
| 2022-01-01T14:00:00Z |       0.14285714285714432 |
| 2022-01-01T15:00:00Z |        0.5999999999999972 |
| 2022-01-01T16:00:00Z |       0.14285714285714432 |
| 2022-01-01T17:00:00Z |       0.14285714285714432 |
| 2022-01-01T18:00:00Z |       0.38461538461538336 |
| 2022-01-01T19:00:00Z |        0.2857142857142868 |
| 2022-01-01T20:00:00Z |                       0.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `KAUFMANS_EFFICIENCY_RATIO` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  KAUFMANS_EFFICIENCY_RATIO(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | kaufmans_efficiency_ratio_co | kaufmans_efficiency_ratio_hum | kaufmans_efficiency_ratio_temp |
| :------------------- | ---------------------------: | ----------------------------: | -----------------------------: |
| 2022-01-01T12:00:00Z |                            0 |                           0.2 |              0.555555555555555 |
| 2022-01-01T13:00:00Z |                            1 |            0.4285714285714228 |            0.19999999999999857 |
| 2022-01-01T14:00:00Z |                            1 |           0.24999999999999334 |            0.14285714285714432 |
| 2022-01-01T15:00:00Z |                            1 |           0.25000000000000444 |             0.5999999999999972 |
| 2022-01-01T16:00:00Z |                            1 |                             0 |            0.14285714285714432 |
| 2022-01-01T17:00:00Z |                            1 |                             1 |            0.14285714285714432 |
| 2022-01-01T18:00:00Z |                            1 |             0.500000000000003 |            0.38461538461538336 |
| 2022-01-01T19:00:00Z |                            1 |             0.285714285714285 |             0.2857142857142868 |
| 2022-01-01T20:00:00Z |                            1 |           0.38461538461538547 |                            0.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `KAUFMANS_EFFICIENCY_RATIO` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  KAUFMANS_EFFICIENCY_RATIO(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | kaufmans_efficiency_ratio |
| :------------------- | ------------------------: |
| 2022-01-01T14:00:00Z |       0.14285714285714432 |
| 2022-01-01T15:00:00Z |        0.5999999999999972 |
| 2022-01-01T16:00:00Z |       0.14285714285714432 |
| 2022-01-01T17:00:00Z |       0.14285714285714432 |
| 2022-01-01T18:00:00Z |       0.38461538461538336 |
| 2022-01-01T19:00:00Z |        0.2857142857142868 |
| 2022-01-01T20:00:00Z |                       0.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `KAUFMANS_EFFICIENCY_RATIO` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  KAUFMANS_EFFICIENCY_RATIO(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | kaufmans_efficiency_ratio |
| :------------------- | ------------------------: |
| 2020-10-05T00:00:00Z |       0.21498959056210964 |
| 2021-01-03T00:00:00Z |      0.020072053525475923 |
| 2021-04-03T00:00:00Z |       0.06190741773563866 |
| 2021-07-02T00:00:00Z |       0.08924485125858131 |
| 2021-09-30T00:00:00Z |        0.0120788302606483 |
| 2021-12-29T00:00:00Z |       0.05181655747468743 |
| 2022-03-29T00:00:00Z |      0.023768115942028996 |
| 2022-06-27T00:00:00Z |       0.06511381683430421 |
| 2022-09-25T00:00:00Z |       0.07748739110499749 |
| 2022-12-24T00:00:00Z |      0.029287632689602317 |

{{% /expand %}}
{{< /expand-wrapper >}}

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `KAUFMANS_ADAPTIVE_MOVING_AVERAGE` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  KAUFMANS_ADAPTIVE_MOVING_AVERAGE(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | kaufmans_adaptive_moving_average |
| :------------------- | -------------------------------: |
| 2022-01-01T12:00:00Z |               22.415923627793976 |
| 2022-01-01T13:00:00Z |               22.429061002513993 |
| 2022-01-01T14:00:00Z |                22.43746706604819 |
| 2022-01-01T15:00:00Z |                22.48506721007708 |
| 2022-01-01T16:00:00Z |                22.48313945274385 |
| 2022-01-01T17:00:00Z |               22.488053855248438 |
| 2022-01-01T18:00:00Z |               22.559247409584806 |
| 2022-01-01T19:00:00Z |               22.589508047087516 |
| 2022-01-01T20:00:00Z |                22.59328743653712 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `KAUFMANS_ADAPTIVE_MOVING_AVERAGE` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  KAUFMANS_ADAPTIVE_MOVING_AVERAGE(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | kaufmans_adaptive_moving_average_co | kaufmans_adaptive_moving_average_hum | kaufmans_adaptive_moving_average_temp |
| :------------------- | ----------------------------------: | -----------------------------------: | ------------------------------------: |
| 2022-01-01T12:00:00Z |                                   0 |                                   36 |                    22.415923627793976 |
| 2022-01-01T13:00:00Z |                 0.44444444444444453 |                   36.052029136316335 |                    22.429061002513993 |
| 2022-01-01T14:00:00Z |                  0.6913580246913581 |                   36.063497322866624 |                     22.43746706604819 |
| 2022-01-01T15:00:00Z |                  1.7174211248285327 |                    36.06981031521873 |                     22.48506721007708 |
| 2022-01-01T16:00:00Z |                   4.065233958238074 |                   36.069519741586184 |                     22.48313945274385 |
| 2022-01-01T17:00:00Z |                   6.258463310132264 |                    36.03862207865899 |                    22.488053855248438 |
| 2022-01-01T18:00:00Z |                  11.476924061184592 |                   36.153751327944484 |                    22.559247409584806 |
| 2022-01-01T19:00:00Z |                  16.153846700658107 |                    36.17872350475971 |                    22.589508047087516 |
| 2022-01-01T20:00:00Z |                   20.52991483369895 |                   36.206893865280215 |                     22.59328743653712 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `KAUFMANS_ADAPTIVE_MOVING_AVERAGE` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  KAUFMANS_ADAPTIVE_MOVING_AVERAGE(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | kaufmans_adaptive_moving_average |
| :------------------- | -------------------------------: |
| 2022-01-01T14:00:00Z |                22.43746706604819 |
| 2022-01-01T15:00:00Z |                22.48506721007708 |
| 2022-01-01T16:00:00Z |                22.48313945274385 |
| 2022-01-01T17:00:00Z |               22.488053855248438 |
| 2022-01-01T18:00:00Z |               22.559247409584806 |
| 2022-01-01T19:00:00Z |               22.589508047087516 |
| 2022-01-01T20:00:00Z |                22.59328743653712 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `KAUFMANS_ADAPTIVE_MOVING_AVERAGE` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  KAUFMANS_ADAPTIVE_MOVING_AVERAGE(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | kaufmans_adaptive_moving_average |
| :------------------- | -------------------------------: |
| 2020-10-05T00:00:00Z |                64.23776629054989 |
| 2021-01-03T00:00:00Z |                64.17743082167587 |
| 2021-04-03T00:00:00Z |                64.12884833681618 |
| 2021-07-02T00:00:00Z |                64.11026540732492 |
| 2021-09-30T00:00:00Z |                64.07304846623671 |
| 2021-12-29T00:00:00Z |                63.97149717822299 |
| 2022-03-29T00:00:00Z |                63.94081206327896 |
| 2022-06-27T00:00:00Z |                63.94324197904272 |
| 2022-09-25T00:00:00Z |                63.83284150412919 |
| 2022-12-24T00:00:00Z |                63.76394979616807 |

{{% /expand %}}
{{< /expand-wrapper >}}

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `RELATIVE_STRENGTH_INDEX` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  RELATIVE_STRENGTH_INDEX(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | relative_strength_index |
| :------------------- | ----------------------: |
| 2022-01-01T12:00:00Z |       92.39130434782608 |
| 2022-01-01T13:00:00Z |       92.78350515463916 |
| 2022-01-01T14:00:00Z |       92.78350515463916 |
| 2022-01-01T15:00:00Z |       90.03334568358646 |
| 2022-01-01T16:00:00Z |       80.49022855250077 |
| 2022-01-01T17:00:00Z |       82.90606558962943 |
| 2022-01-01T18:00:00Z |       87.14940243872873 |
| 2022-01-01T19:00:00Z |       78.48983186121941 |
| 2022-01-01T20:00:00Z |       62.04865064241268 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `RELATIVE_STRENGTH_INDEX` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  RELATIVE_STRENGTH_INDEX(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | relative_strength_index_co | relative_strength_index_hum | relative_strength_index_temp |
| :------------------- | -------------------------: | --------------------------: | ---------------------------: |
| 2022-01-01T12:00:00Z |                            |           98.11827956989245 |            92.39130434782608 |
| 2022-01-01T13:00:00Z |                        100 |           98.23677581863977 |            92.78350515463916 |
| 2022-01-01T14:00:00Z |                        100 |           95.04467912266443 |            92.78350515463916 |
| 2022-01-01T15:00:00Z |                        100 |           93.02941956003185 |            90.03334568358646 |
| 2022-01-01T16:00:00Z |                        100 |           88.05084037126848 |            80.49022855250077 |
| 2022-01-01T17:00:00Z |                        100 |           88.05084037126848 |            82.90606558962943 |
| 2022-01-01T18:00:00Z |                        100 |           91.63299959013992 |            87.14940243872873 |
| 2022-01-01T19:00:00Z |                        100 |           80.85951627810859 |            78.48983186121941 |
| 2022-01-01T20:00:00Z |                        100 |            76.8440852816889 |            62.04865064241268 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `RELATIVE_STRENGTH_INDEX` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  RELATIVE_STRENGTH_INDEX(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | relative_strength_index |
| :------------------- | ----------------------: |
| 2022-01-01T14:00:00Z |       92.78350515463916 |
| 2022-01-01T15:00:00Z |       90.03334568358646 |
| 2022-01-01T16:00:00Z |       80.49022855250077 |
| 2022-01-01T17:00:00Z |       82.90606558962943 |
| 2022-01-01T18:00:00Z |       87.14940243872873 |
| 2022-01-01T19:00:00Z |       78.48983186121941 |
| 2022-01-01T20:00:00Z |       62.04865064241268 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `RELATIVE_STRENGTH_INDEX` with a default non-default warmup type" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  RELATIVE_STRENGTH_INDEX(temp, 4, -1, 'simple')
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | relative_strength_index |
| :------------------- | ----------------------: |
| 2022-01-01T12:00:00Z |       97.46835443037975 |
| 2022-01-01T13:00:00Z |       97.52066115702479 |
| 2022-01-01T14:00:00Z |       97.52066115702479 |
| 2022-01-01T15:00:00Z |       96.34109464771694 |
| 2022-01-01T16:00:00Z |       91.89501009518312 |
| 2022-01-01T17:00:00Z |       92.36482202699028 |
| 2022-01-01T18:00:00Z |       93.38702507648456 |
| 2022-01-01T19:00:00Z |        88.1423325938459 |
| 2022-01-01T20:00:00Z |       76.66135862958828 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `RELATIVE_STRENGTH_INDEX` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  RELATIVE_STRENGTH_INDEX(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | relative_strength_index |
| :------------------- | ----------------------: |
| 2020-10-05T00:00:00Z |        69.9692046299246 |
| 2021-01-03T00:00:00Z |       63.37405020679043 |
| 2021-04-03T00:00:00Z |       70.82662989351107 |
| 2021-07-02T00:00:00Z |       74.90131747577793 |
| 2021-09-30T00:00:00Z |      56.212729394565066 |
| 2021-12-29T00:00:00Z |      46.095152535803514 |
| 2022-03-29T00:00:00Z |      60.709021374375894 |
| 2022-06-27T00:00:00Z |       69.93773053391476 |
| 2022-09-25T00:00:00Z |       44.87321655968338 |
| 2022-12-24T00:00:00Z |      41.845933101386215 |

{{% /expand %}}
{{< /expand-wrapper >}}

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `TRIPLE_EXPONENTIAL_MOVING_AVERAGE` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_MOVING_AVERAGE(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2022-01-01T11:00:00Z |                 22.54347777777777 |
| 2022-01-01T12:00:00Z |                22.499126666666672 |
| 2022-01-01T13:00:00Z |                22.716772000000002 |
| 2022-01-01T14:00:00Z |                22.790124000000006 |
| 2022-01-01T15:00:00Z |                22.728720799999994 |
| 2022-01-01T16:00:00Z |                22.465986271999995 |
| 2022-01-01T17:00:00Z |                     22.6128236096 |
| 2022-01-01T18:00:00Z |                23.142821016320013 |
| 2022-01-01T19:00:00Z |                23.163081365760007 |
| 2022-01-01T20:00:00Z |                22.834869660416004 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_MOVING_AVERAGE` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_MOVING_AVERAGE(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_moving_average_co | triple_exponential_moving_average_hum | triple_exponential_moving_average_temp |
| :------------------- | -----------------------------------: | ------------------------------------: | -------------------------------------: |
| 2022-01-01T11:00:00Z |                                    0 |                     36.03026666666666 |                      22.54347777777777 |
| 2022-01-01T12:00:00Z |                                    0 |                              35.99608 |                     22.499126666666672 |
| 2022-01-01T13:00:00Z |                   0.7840000000000001 |                    36.379856000000004 |                     22.716772000000002 |
| 2022-01-01T14:00:00Z |                               1.0432 |                             36.353712 |                     22.790124000000006 |
| 2022-01-01T15:00:00Z |                    2.663040000000001 |                     36.25279040000001 |                     22.728720799999994 |
| 2022-01-01T16:00:00Z |                    6.300159999999999 |                    36.054262656000006 |                     22.465986271999995 |
| 2022-01-01T17:00:00Z |                             8.977536 |                     35.98746094080001 |                          22.6128236096 |
| 2022-01-01T18:00:00Z |                   16.698608639999996 |                        36.67902875136 |                     23.142821016320013 |
| 2022-01-01T19:00:00Z |                         22.122591232 |                     36.68111467007999 |                     23.163081365760007 |
| 2022-01-01T20:00:00Z |                   26.541314662400005 |                       36.579546917888 |                     22.834869660416004 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_MOVING_AVERAGE` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_MOVING_AVERAGE(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2022-01-01T14:00:00Z |                22.790124000000006 |
| 2022-01-01T15:00:00Z |                22.728720799999994 |
| 2022-01-01T16:00:00Z |                22.465986271999995 |
| 2022-01-01T17:00:00Z |                     22.6128236096 |
| 2022-01-01T18:00:00Z |                23.142821016320013 |
| 2022-01-01T19:00:00Z |                23.163081365760007 |
| 2022-01-01T20:00:00Z |                22.834869660416004 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_MOVING_AVERAGE` with a default non-default warmup type" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_MOVING_AVERAGE(temp, 4, -1, 'simple')
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2022-01-01T17:00:00Z |                       22.65201408 |
| 2022-01-01T18:00:00Z |                23.164150553600003 |
| 2022-01-01T19:00:00Z |                    23.17404420096 |
| 2022-01-01T20:00:00Z |                    22.84003200512 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_MOVING_AVERAGE` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  TRIPLE_EXPONENTIAL_MOVING_AVERAGE(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | triple_exponential_moving_average |
| :------------------- | --------------------------------: |
| 2020-07-07T00:00:00Z |                 64.17547253086421 |
| 2020-10-05T00:00:00Z |                59.182219074074055 |
| 2021-01-03T00:00:00Z |                 55.03945899999998 |
| 2021-04-03T00:00:00Z |                 57.98342055555557 |
| 2021-07-02T00:00:00Z |                 61.72370060000002 |
| 2021-09-30T00:00:00Z |                  58.3235789128889 |
| 2021-12-29T00:00:00Z |                53.982153124088896 |
| 2022-03-29T00:00:00Z |                57.325663060373344 |
| 2022-06-27T00:00:00Z |                 62.67482784650667 |
| 2022-09-25T00:00:00Z |                57.274230204423134 |
| 2022-12-24T00:00:00Z |                 54.17634351477504 |

{{% /expand %}}
{{< /expand-wrapper >}}

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
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
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

- [Must use aggregate or selector functions when grouping by time](#must-use-aggregate-or-selector-functions-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}
{{% expand "Apply `TRIPLE_EXPONENTIAL_DERIVATIVE` to a field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_DERIVATIVE(temp, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_derivative |
| :------------------- | ----------------------------: |
| 2022-01-01T12:00:00Z |            0.5731400170122969 |
| 2022-01-01T13:00:00Z |            0.5082054442170802 |
| 2022-01-01T14:00:00Z |           0.45740027258918126 |
| 2022-01-01T15:00:00Z |           0.36931756808027405 |
| 2022-01-01T16:00:00Z |            0.1953270968520826 |
| 2022-01-01T17:00:00Z |           0.13729679242548976 |
| 2022-01-01T18:00:00Z |           0.28596038472352703 |
| 2022-01-01T19:00:00Z |            0.3509641845184319 |
| 2022-01-01T20:00:00Z |           0.23932489811719915 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_DERIVATIVE` to each field" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_DERIVATIVE(*, 4)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_derivative_co | triple_exponential_derivative_hum | triple_exponential_derivative_temp |
| :------------------- | -------------------------------: | --------------------------------: | ---------------------------------: |
| 2022-01-01T12:00:00Z |                                  |              0.011689978802653656 |                 0.5731400170122969 |
| 2022-01-01T13:00:00Z |                                  |               0.08193865253971477 |                 0.5082054442170802 |
| 2022-01-01T14:00:00Z |               179.99999999999997 |               0.10794983570248107 |                0.45740027258918126 |
| 2022-01-01T15:00:00Z |               148.57142857142853 |                0.0905729924662868 |                0.36931756808027405 |
| 2022-01-01T16:00:00Z |               140.22988505747128 |               0.02876803922613469 |                 0.1953270968520826 |
| 2022-01-01T17:00:00Z |                92.48803827751195 |             -0.022670378539191294 |                0.13729679242548976 |
| 2022-01-01T18:00:00Z |                84.49217002237135 |               0.10699801078373206 |                0.28596038472352703 |
| 2022-01-01T19:00:00Z |                64.59469801081093 |               0.17000537478475408 |                 0.3509641845184319 |
| 2022-01-01T20:00:00Z |                48.10094220759999 |               0.16771238737589567 |                0.23932489811719915 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_DERIVATIVE` with a custom hold period" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_DERIVATIVE(temp, 4, 6)
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_derivative |
| :------------------- | ----------------------------: |
| 2022-01-01T14:00:00Z |           0.45740027258918126 |
| 2022-01-01T15:00:00Z |           0.36931756808027405 |
| 2022-01-01T16:00:00Z |            0.1953270968520826 |
| 2022-01-01T17:00:00Z |           0.13729679242548976 |
| 2022-01-01T18:00:00Z |           0.28596038472352703 |
| 2022-01-01T19:00:00Z |            0.3509641845184319 |
| 2022-01-01T20:00:00Z |           0.23932489811719915 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_DERIVATIVE` with a default non-default warmup type" %}}

The following example uses the
[Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

```sql
SELECT
  TRIPLE_EXPONENTIAL_DERIVATIVE(temp, 4, -1, 'simple')
FROM home
WHERE
  room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | triple_exponential_derivative |
| :------------------- | ----------------------------: |
| 2022-01-01T18:00:00Z |            0.3040309049773704 |
| 2022-01-01T19:00:00Z |           0.37510717611963784 |
| 2022-01-01T20:00:00Z |            0.2625157254706467 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Apply `TRIPLE_EXPONENTIAL_DERIVATIVE` to time windows (grouped by time)" %}}

The following example use the
[NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather).

```sql
SELECT
  TRIPLE_EXPONENTIAL_DERIVATIVE(MEAN(temp_avg), 4)
FROM weather
WHERE
  location = 'San Francisco'
  AND time >= '2020-01-01T00:00:00Z'
  AND time <= '2022-12-31T23:59:59Z'
GROUP BY time(90d)
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | triple_exponential_derivative |
| :------------------- | ----------------------------: |
| 2020-10-05T00:00:00Z |            1.8609138140919912 |
| 2021-01-03T00:00:00Z |            0.8545019640246121 |
| 2021-04-03T00:00:00Z |            0.6716861515154271 |
| 2021-07-02T00:00:00Z |            1.0528294030543783 |
| 2021-09-30T00:00:00Z |            0.6847349621789123 |
| 2021-12-29T00:00:00Z |          -0.18257939931221046 |
| 2022-03-29T00:00:00Z |           -0.1722392917734461 |
| 2022-06-27T00:00:00Z |            0.6038050639217252 |
| 2022-09-25T00:00:00Z |           0.21734485841473639 |
| 2022-12-24T00:00:00Z |          -0.44578753427667595 |

{{% /expand %}}
{{< /expand-wrapper >}}
