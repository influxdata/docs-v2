---
title: InfluxQL analysis functions
description: >
  Analyze and predict data with InfluxQL technical analysis functions.
menu:
  influxdb_2_4:
    name: Technical analysis
    parent: View InfluxQL functions
weight: 205
---

Use analysis functions to apply algorithms to your data--often used to analyze financial and investment data.

Each analysis function below covers **syntax**, including parameters to pass to the function, and **examples** of how to use the function. Examples use [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data).

- [Predictive analysis function: HOLT_WINTERS()](#predictive-analysis-holt_winters)
- [Technical analysis functions](#technical-analysis-functions):
  - [CHANDE_MOMENTUM_OSCILLATOR()](#chande_momentum_oscillator)
  - [DOUBLE_EXPONENTIAL_MOVING_AVERAGE()](#double_exponential_moving_average)
  - [KAUFMANS_EFFICIENCY_RATIO()](#kaufmans_efficiency_ratio)
  - [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](#kaufmans_adaptive_moving_average)
  - [TRIPLE_EXPONENTIAL_MOVING_AVERAGE()](#triple_exponential_moving_average)
  - [TRIPLE_EXPONENTIAL_DERIVATIVE()](#triple_exponential_derivative)
  - [RELATIVE_STRENGTH_INDEX()](#relative_strength_index)

## Predictive analysis: HOLT_WINTERS()

Returns N number of predicted [field values](/influxdb/v2.4/reference/glossary/#field-value) using the
[Holt-Winters](https://www.otexts.org/fpp/7/5) seasonal method. Supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types). Works with data that occurs at consistent time intervals. Requires an InfluxQL function and the
`GROUP BY time()` clause to ensure that the Holt-Winters function operates on regular data.

Use `HOLT_WINTERS()` to:

- Predict when data values will cross a given threshold
- Compare predicted values with actual values to detect anomalies in your data

### Syntax

```
SELECT HOLT_WINTERS[_WITH-FIT](<function>(<field_key>),<N>,<S>) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`HOLT_WINTERS(function(field_key),N,S)` returns `N` seasonally adjusted
predicted field values for the specified [field key](/influxdb/v2.4/reference/glossary/#field-key).

The `N` predicted values occur at the same interval as the [`GROUP BY time()` interval](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
If your `GROUP BY time()` interval is `6m` and `N` is `3` you'll
receive three predicted values that are each six minutes apart.

`S` is the seasonal pattern parameter and delimits the length of a seasonal
pattern according to the `GROUP BY time()` interval.
If your `GROUP BY time()` interval is `2m` and `S` is `3`, then the
seasonal pattern occurs every six minutes, that is, every three data points.
If you do not want to seasonally adjust your predicted values, set `S` to `0`
or `1.`

`HOLT_WINTERS_WITH_FIT(function(field_key),N,S)` returns the fitted values in
addition to `N` seasonally adjusted predicted field values for the specified field key.

#### Examples

{{< expand-wrapper >}}

{{% expand "Predict field values associated with a field key" %}}

##### Sample data

The examples use the following subset of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "noaa"."autogen"."h2o_feet" WHERE "location"='santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

![Raw Data](/img/influxdb/1-3-hw-raw-data-1-2.png)

##### Step 1: Match the trends of the raw data

Write a `GROUP BY time()` query that matches the general trends of the raw `water_level` data.
Here, we use the [`FIRST()`](#first) function:

```sql
SELECT FIRST("water_level") FROM "noaa"."autogen"."h2o_feet" WHERE "location"='santa_monica' and time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(379m,348m)
```

In the `GROUP BY time()` clause, the first argument (`379m`) matches
the length of time that occurs between each peak and trough in the `water_level` data.
The second argument (`348m`) is the
[offset interval](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#advanced-group-by-time-syntax).
The offset interval alters the default `GROUP BY time()` boundaries to
match the time range of the raw data.

The blue line shows the results of the query:

![First step](/img/influxdb/1-3-hw-first-step-1-2.png)

###### Step 2: Determine the seasonal pattern

Identify the seasonal pattern in the data using the information from the
query in step 1.

Focusing on the blue line in the graph below, the pattern in the `water_level` data repeats about every 25 hours and 15 minutes.
There are four data points per season, so `4` is the seasonal pattern argument.

![Second step](/img/influxdb/1-3-hw-second-step-1-2.png)

###### Step 3: Apply the HOLT_WINTERS() function

Add the Holt-Winters function to the query.
Here, we use `HOLT_WINTERS_WITH_FIT()` to view both the fitted values and the predicted values:

```sql
SELECT HOLT_WINTERS_WITH_FIT(FIRST("water_level"),10,4) FROM "NOAA_water_database"."autogen"."h2o_feet" WHERE "location"='santa_monica' AND time >= '2015-08-22 22:12:00' AND time <= '2015-08-28 03:00:00' GROUP BY time(379m,348m)
```

In the `HOLT_WINTERS_WITH_FIT()` function, the first argument (`10`) requests 10 predicted field values.
Each predicted point is `379m` apart, the same interval as the first argument in the `GROUP BY time()` clause.
The second argument in the `HOLT_WINTERS_WITH_FIT()` function (`4`) is the seasonal pattern that we determined in the previous step.

The blue line shows the results of the query:

![Third step](/img/influxdb/1-3-hw-third-step-1-2.png)

{{% /expand %}}

{{< /expand-wrapper >}}

#### Common issues with `HOLT_WINTERS()`

##### Receiving fewer than `N` points

In some cases, you may receive fewer predicted points than requested by the `N` parameter.
That behavior typically occurs when the math becomes unstable and cannot forecast more
points. In this case, `HOLT_WINTERS()` may not be suited for the dataset or the seasonal adjustment parameter is invalid.

## Technical analysis functions

Technical analysis functions apply widely used algorithms to your data.
While they are primarily used in finance and investing, they have
application in other industries.

For technical analysis functions, consider whether to include the `PERIOD`, `HOLD_PERIOD`, and `WARMUP_TYPE` arguments:

#### `PERIOD`

**Required, integer, min=1**  

The sample size for the algorithm, which is the number of historical samples that have significant
effect on the output of the algorithm.
For example, `2` means the current point and the point before it.
The algorithm uses an exponential decay rate to determine the weight of a historical point,
generally known as the alpha (α). The `PERIOD` controls the decay rate.

{{% note %}}
**Note:** Older points can still have an impact.
{{% /note %}}

#### `HOLD_PERIOD`

**integer, min=-1**

How many samples the algorithm needs before emitting results.
The default of `-1` means the value is based on the algorithm, the `PERIOD`,
and the `WARMUP_TYPE`. Verify this value is enough for the algorithm to emit meaningful results.

_**Default hold periods:**_  

For most technical analysis functions, the default `HOLD_PERIOD` is
determined by the function and the [`WARMUP_TYPE`](#warmup_type) shown in the following table:

| Algorithm \ Warmup Type                                                 | simple                 | exponential | none                                 |
| ---------------------------------                                       | ---------------------- | ----------- |:----------:                          |
| [EXPONENTIAL_MOVING_AVERAGE](#exponential_moving_average)               | PERIOD - 1             | PERIOD - 1  | <span style="opacity:.35">n/a</span> |
| [DOUBLE_EXPONENTIAL_MOVING_AVERAGE](#double_exponential_moving_average) | ( PERIOD - 1 ) * 2     | PERIOD - 1  | <span style="opacity:.35">n/a</span> |
| [TRIPLE_EXPONENTIAL_MOVING_AVERAGE](#triple_exponential_moving_average) | ( PERIOD - 1 ) * 3     | PERIOD - 1  | <span style="opacity:.35">n/a</span> |
| [TRIPLE_EXPONENTIAL_DERIVATIVE](#triple_exponential_derivative)         | ( PERIOD - 1 ) * 3 + 1 | PERIOD      | <span style="opacity:.35">n/a</span> |
| [RELATIVE_STRENGTH_INDEX](#relative_strength_index)                     | PERIOD                 | PERIOD      | <span style="opacity:.35">n/a</span> |
| [CHANDE_MOMENTUM_OSCILLATOR](#chande_momentum_oscillator)               | PERIOD                 | PERIOD      | PERIOD - 1                           |

_**Kaufman algorithm default hold periods:**_

| Algorithm                                                               | Default Hold Period |
| ---------                                                               | ------------------- |
| [KAUFMANS_EFFICIENCY_RATIO()](#kaufmans_efficiency_ratio)               | PERIOD              |
| [KAUFMANS_ADAPTIVE_MOVING_AVERAGE()](#kaufmans_adaptive_moving_average) | PERIOD              |

#### `WARMUP_TYPE`

**default='exponential'**

Controls how the algorithm initializes for the first `PERIOD` samples.
It is essentially the duration for which it has an incomplete sample set.

`simple`  
Simple moving average (SMA) of the first `PERIOD` samples.
This is the method used by [ta-lib](https://www.ta-lib.org/).

`exponential`  
Exponential moving average (EMA) with scaling alpha (α).
Uses an EMA with `PERIOD=1` for the first point, `PERIOD=2`
for the second point, and so on, until the algorithm has consumed `PERIOD` number of points.
As the algorithm immediately starts using an EMA, when this method is used and
`HOLD_PERIOD` is unspecified or `-1`, the algorithm may start emitting points
after a much smaller sample size than with `simple`.

`none`  
The algorithm does not perform any smoothing at all.
Method used by [ta-lib](https://www.ta-lib.org/).
When this method is used and `HOLD_PERIOD` is unspecified, `HOLD_PERIOD`
defaults to `PERIOD - 1`.

{{% note %}}
**Note:** The `none` warmup type is only available with the [`CHANDE_MOMENTUM_OSCILLATOR()`](#chande-momentum-oscillator) function.
{{% /note %}}

## CHANDE_MOMENTUM_OSCILLATOR()

The Chande Momentum Oscillator (CMO) is a technical momentum indicator developed by Tushar Chande.
The CMO indicator is created by calculating the difference between the sum of all
recent higher data points and the sum of all recent lower data points,
then dividing the result by the sum of all data movement over a given time period.
The result is multiplied by 100 to give the -100 to +100 range.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/cmo" target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals). To use `CHANDE_MOMENTUM_OSCILLATOR()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
CHANDE_MOMENTUM_OSCILLATOR([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period>, [warmup_type]])
```

### Arguments

- [period](#period)  
- (Optional) [hold_period](#hold_period)  
- (Optional) [warmup_type](#warmup_type)
 
`CHANDE_MOMENTUM_OSCILLATOR(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Chande Momentum Oscillator algorithm with a 2-value period
and the default hold period and warmup type.

`CHANDE_MOMENTUM_OSCILLATOR(field_key, 10, 9, 'none')`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Chande Momentum Oscillator algorithm with a 10-value period
a 9-value hold period, and the `none` warmup type.

`CHANDE_MOMENTUM_OSCILLATOR(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Chande Momentum Oscillator algorithm with a 2-value period
and the default hold period and warmup type.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](#aggregations) in your call to the `CHANDE_MOMENTUM_OSCILLATOR()` function.
{{% /note %}}

`CHANDE_MOMENTUM_OSCILLATOR(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Chande Momentum Oscillator algorithm with a 2-value period
and the default hold period and warmup type.

`CHANDE_MOMENTUM_OSCILLATOR(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Chande Momentum Oscillator algorithm with a 2-value period
and the default hold period and warmup type.

`CHANDE_MOMENTUM_OSCILLATOR()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

## EXPONENTIAL_MOVING_AVERAGE()

An exponential moving average (EMA) (or exponentially weighted moving average) is a type of moving average similar to a [simple moving average](#moving-average), except more weight is given to the latest data.

This type of moving average reacts faster to recent data changes than a simple moving average.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="https://www.investopedia.com/terms/e/ema.asp" target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `EXPONENTIAL_MOVING_AVERAGE()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
EXPONENTIAL_MOVING_AVERAGE([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period)[, <warmup_type]])
```

`EXPONENTIAL_MOVING_AVERAGE(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`EXPONENTIAL_MOVING_AVERAGE(field_key, 10, 9, 'exponential')`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Exponential Moving Average algorithm with a 10-value period
a 9-value hold period, and the `exponential` warmup type.

`EXPONENTIAL_MOVING_AVERAGE(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](#aggregations) in your call to the `EXPONENTIAL_MOVING_AVERAGE()` function.
{{% /note %}}

`EXPONENTIAL_MOVING_AVERAGE(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`EXPONENTIAL_MOVING_AVERAGE(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`EXPONENTIAL_MOVING_AVERAGE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

### Arguments

- [period](#period)  
- (Optional) [hold_period](#hold_period)  
- (Optional) [warmup_type](#warmup_type)

## DOUBLE_EXPONENTIAL_MOVING_AVERAGE()

The Double Exponential Moving Average (DEMA) attempts to remove the inherent lag
associated with moving averages by placing more weight on recent values.
The name suggests this is achieved by applying a double exponential smoothing which is not the case.
The value of an [EMA](#exponential-moving-average) is doubled.
To keep the value in line with the actual data and to remove the lag, the value "EMA of EMA"
is subtracted from the previously doubled EMA.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="https://en.wikipedia.org/wiki/Double_exponential_moving_average" target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `DOUBLE_EXPONENTIAL_MOVING_AVERAGE()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
DOUBLE_EXPONENTIAL_MOVING_AVERAGE([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period)[, <warmup_type]])
``` 

`DOUBLE_EXPONENTIAL_MOVING_AVERAGE(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Double Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`DOUBLE_EXPONENTIAL_MOVING_AVERAGE(field_key, 10, 9, 'exponential')`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Double Exponential Moving Average algorithm with a 10-value period
a 9-value hold period, and the `exponential` warmup type.

`DOUBLE_EXPONENTIAL_MOVING_AVERAGE(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Double Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](#aggregations) in your call to the `DOUBLE_EXPONENTIAL_MOVING_AVERAGE()` function.
{{% /note %}}

`DOUBLE_EXPONENTIAL_MOVING_AVERAGE(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Double Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`DOUBLE_EXPONENTIAL_MOVING_AVERAGE(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Double Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`DOUBLE_EXPONENTIAL_MOVING_AVERAGE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

### Arguments

- [period](#period)  
- (Optional) [hold_period](#hold_period)  
- (Optional) [warmup_type](#warmup_type)

## KAUFMANS_EFFICIENCY_RATIO()

Kaufman's Efficiency Ration, or simply "Efficiency Ratio" (ER), is calculated by
dividing the data change over a period by the absolute sum of the data movements
that occurred to achieve that change.
The resulting ratio ranges between 0 and 1 with higher values representing a
more efficient or trending market.

The ER is very similar to the [Chande Momentum Oscillator](#chande-momentum-oscillator) (CMO).
The difference is that the CMO takes market direction into account, but if you take the absolute CMO and divide by 100, you you get the Efficiency Ratio.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="http://etfhq.com/blog/2011/02/07/kaufmans-efficiency-ratio/" target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `KAUFMANS_EFFICIENCY_RATIO()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
KAUFMANS_EFFICIENCY_RATIO([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period>])
``` 

`KAUFMANS_EFFICIENCY_RATIO(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Efficiency Index algorithm with a 2-value period
and the default hold period and warmup type.

`KAUFMANS_EFFICIENCY_RATIO(field_key, 10, 10)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Efficiency Index algorithm with a 10-value period and
a 10-value hold period.

`KAUFMANS_EFFICIENCY_RATIO(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Efficiency Index algorithm with a 2-value period
and the default hold period.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](/influxdb/v2.4/query-data/influxql/view-functions/aggregates/) in your call to the `KAUFMANS_EFFICIENCY_RATIO()` function.
{{% /note %}}

`KAUFMANS_EFFICIENCY_RATIO(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Efficiency Index algorithm with a 2-value period
and the default hold period and warmup type.

`KAUFMANS_EFFICIENCY_RATIO(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Efficiency Index algorithm with a 2-value period
and the default hold period and warmup type.

`KAUFMANS_EFFICIENCY_RATIO()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

**Arguments:**  

- [period](#period)  
- (Optional) [hold_period](#hold_period)

## KAUFMANS_ADAPTIVE_MOVING_AVERAGE()

Kaufman's Adaptive Moving Average (KAMA) is a moving average designed to
account for sample noise or volatility.
KAMA will closely follow data points when the data swings are relatively small and noise is low.
KAMA will adjust when the data swings widen and follow data from a greater distance.
This trend-following indicator can be used to identify the overall trend,
time turning points and filter data movements.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:kaufman_s_adaptive_moving_average" target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `KAUFMANS_ADAPTIVE_MOVING_AVERAGE()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
KAUFMANS_ADAPTIVE_MOVING_AVERAGE([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period>])
```

`KAUFMANS_ADAPTIVE_MOVING_AVERAGE(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Kaufman Adaptive Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`KAUFMANS_ADAPTIVE_MOVING_AVERAGE(field_key, 10, 10)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Kaufman Adaptive Moving Average algorithm with a 10-value period
and a 10-value hold period.

`KAUFMANS_ADAPTIVE_MOVING_AVERAGE(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Kaufman Adaptive Moving Average algorithm with a 2-value period
and the default hold period.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](#aggregations) in your call to the `KAUFMANS_ADAPTIVE_MOVING_AVERAGE()` function.
{{% /note %}}

`KAUFMANS_ADAPTIVE_MOVING_AVERAGE(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Kaufman Adaptive Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`KAUFMANS_ADAPTIVE_MOVING_AVERAGE(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Kaufman Adaptive Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`KAUFMANS_ADAPTIVE_MOVING_AVERAGE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

**Arguments:**
- [period](#period)  
- (Optional) [hold_period](#hold_period)

## TRIPLE_EXPONENTIAL_MOVING_AVERAGE()

The triple exponential moving average (TEMA) filters out
volatility from conventional moving averages.
While the name implies that it's a triple exponential smoothing, it's actually a
composite of a [single exponential moving average](#exponential-moving-average),
a [double exponential moving average](#double-exponential-moving-average),
and a triple exponential moving average.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="https://www.investopedia.com/terms/t/triple-exponential-moving-average.asp " target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `TRIPLE_EXPONENTIAL_MOVING_AVERAGE()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
TRIPLE_EXPONENTIAL_MOVING_AVERAGE([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period)[, <warmup_type]])
```

`TRIPLE_EXPONENTIAL_MOVING_AVERAGE(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Triple Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`TRIPLE_EXPONENTIAL_MOVING_AVERAGE(field_key, 10, 9, 'exponential')`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Triple Exponential Moving Average algorithm with a 10-value period
a 9-value hold period, and the `exponential` warmup type.

`TRIPLE_EXPONENTIAL_MOVING_AVERAGE(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Triple Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](#aggregations) in your call to the `TRIPLE_EXPONENTIAL_MOVING_AVERAGE()` function.
{{% /note %}}

`TRIPLE_EXPONENTIAL_MOVING_AVERAGE(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Triple Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`TRIPLE_EXPONENTIAL_MOVING_AVERAGE(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Triple Exponential Moving Average algorithm with a 2-value period
and the default hold period and warmup type.

`TRIPLE_EXPONENTIAL_MOVING_AVERAGE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

**Arguments:**
- [period](#period)  
- (Optional) [hold_period](#hold_period)
- (Optional) [warmup_type](#warmup_type)

## TRIPLE_EXPONENTIAL_DERIVATIVE()

The triple exponential derivative indicator, commonly referred to as "TRIX," is
an oscillator used to identify oversold and overbought markets, and can also be
used as a momentum indicator.
TRIX calculates a [triple exponential moving average](#triple-exponential-moving-average)
of the [log](#log) of the data input over the period of time.
The previous value is subtracted from the previous value.
This prevents cycles that are shorter than the defined period from being considered by the indicator.

Like many oscillators, TRIX oscillates around a zero line. When used as an oscillator,
a positive value indicates an overbought market while a negative value indicates an oversold market.
When used as a momentum indicator, a positive value suggests momentum is increasing
while a negative value suggests momentum is decreasing.
Many analysts believe that when the TRIX crosses above the zero line it gives a
buy signal, and when it closes below the zero line, it gives a sell signal.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="https://www.investopedia.com/articles/technical/02/092402.asp " target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `TRIPLE_EXPONENTIAL_DERIVATIVE()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
TRIPLE_EXPONENTIAL_DERIVATIVE([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period)[, <warmup_type]])
```

`TRIPLE_EXPONENTIAL_DERIVATIVE(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Triple Exponential Derivative algorithm with a 2-value period
and the default hold period and warmup type.

`TRIPLE_EXPONENTIAL_DERIVATIVE(field_key, 10, 10, 'exponential')`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Triple Exponential Derivative algorithm with a 10-value period,
a 10-value hold period, and the `exponential` warmup type.

`TRIPLE_EXPONENTIAL_DERIVATIVE(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Triple Exponential Derivative algorithm with a 2-value period
and the default hold period and warmup type.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an [aggregate function](#aggregations) in your call to the `TRIPLE_EXPONENTIAL_DERIVATIVE()` function.
{{% /note %}}

`TRIPLE_EXPONENTIAL_DERIVATIVE(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Triple Exponential Derivative algorithm with a 2-value period
and the default hold period and warmup type.

`TRIPLE_EXPONENTIAL_DERIVATIVE(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Triple Exponential Derivative algorithm with a 2-value period
and the default hold period and warmup type.

`TRIPLE_EXPONENTIAL_DERIVATIVE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

## RELATIVE_STRENGTH_INDEX()

The relative strength index (RSI) is a momentum indicator that compares the magnitude of recent increases and decreases over a specified time period to measure speed and change of data movements.

<sup style="line-height:0; font-size:.7rem; font-style:italic; font-weight:normal;"><a href="https://www.investopedia.com/terms/r/rsi.asp" target="\_blank">Source</a>

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).

To use `RELATIVE_STRENGTH_INDEX()` with a `GROUP BY time()` clause, see [Advanced syntax](/influxdb/v2.4/query-data/influxql/view-functions/transformations/#advanced-syntax).

### Basic syntax

```
RELATIVE_STRENGTH_INDEX([ * | <field_key> | /regular_expression/ ], <period>[, <hold_period)[, <warmup_type]])
```

`RELATIVE_STRENGTH_INDEX(field_key, 2)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Relative Strength Index algorithm with a 2-value period
and the default hold period and warmup type.

`RELATIVE_STRENGTH_INDEX(field_key, 10, 10, 'exponential')`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Relative Strength Index algorithm with a 10-value period,
a 10-value hold period, and the `exponential` warmup type.

`RELATIVE_STRENGTH_INDEX(MEAN(<field_key>), 2) ... GROUP BY time(1d)`  
Returns the mean of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key)
processed using the Relative Strength Index algorithm with a 2-value period
and the default hold period and warmup type.

{{% note %}}
**Note:** When aggregating data with a `GROUP BY` clause, you must include an  [aggregate function](#aggregations) in your call to the `RELATIVE_STRENGTH_INDEX()` function.
{{% /note %}}

`RELATIVE_STRENGTH_INDEX(/regular_expression/, 2)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
processed using the Relative Strength Index algorithm with a 2-value period
and the default hold period and warmup type.

`RELATIVE_STRENGTH_INDEX(*, 2)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
processed using the Relative Strength Index algorithm with a 2-value period
and the default hold period and warmup type.

`RELATIVE_STRENGTH_INDEX()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/select/#data-types).

**Arguments:**
- [period](#period)  
- (Optional) [hold_period](#hold_period)
- (Optional) [warmup_type](#warmup_type)
