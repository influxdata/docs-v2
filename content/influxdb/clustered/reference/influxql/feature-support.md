---
title: InfluxQL feature support
description: >
  InfluxQL is being rearchitected to work with the InfluxDB 3.0 storage engine.
  This process is ongoing and some InfluxQL features are still being implemented.
  This page provides information about the current implementation status of
  InfluxQL features.
menu:
  influxdb_clustered:
    parent: influxql-reference
weight: 220
---

InfluxQL is being rearchitected to work with the InfluxDB 3.0 storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
This page provides information about the current implementation status of
InfluxQL features.

- [In-progress features](#in-progress-features)
  - [Time zones](#time-zones)
  - [SLIMIT clause](#slimit-clause)
  - [SOFFSET clause](#soffset-clause)
  - [Metaqueries](#metaqueries)
- [Function support](#function-support)
  - [Aggregate functions](#aggregate-functions)
  - [Selector functions](#selector-functions)
  - [Transformations](#transformations)
  - [Technical and predictive analysis](#technical-and-predictive-analysis)

## In-progress features

### Time zones

InfluxQL in {{< product-name >}} does not currently support the time zone clause,
which applies a time zone offset to UTC timestamps in query results.

<!-- **Tracking issue**: [influxdb_iox#6933](https://github.com/influxdata/influxdb_iox/issues/6933) -->

### SLIMIT clause

InfluxQL in {{< product-name >}} does not currently support the `SLIMIT` clause,
which limits the number of [series](/influxdb/clustered/reference/glossary/#series)
returned in query results.

<!-- **Tracking issue**: [influxdb_iox#6940](https://github.com/influxdata/influxdb_iox/issues/6940) -->

### SOFFSET clause

InfluxQL in {{< product-name >}} does not currently support the `SOFFSET` clause,
which specifies the number of [series](/influxdb/clustered/reference/glossary/#series)
to skip before returning results.

<!-- **Tracking issue**: [influxdb_iox#6940](https://github.com/influxdata/influxdb_iox/issues/6940) -->

### Metaqueries

InfluxQL metaqueries return information about the schema of time series data
stored in InfluxDB.
The following table provides information about what metaqueries are available in
{{< product-name >}}:

| Metaquery                                                     |        Supported         |
| :------------------------------------------------------------ | :----------------------: |
| <span style="opacity: .5;">SHOW DATABASES</span>              |                          |
| **SHOW MEASUREMENTS**                                         | **{{< icon "check" >}}** |
| <span style="opacity: .5;">SHOW SERIES</span>                 |                          |
| <span style="opacity: .5;">SHOW SERIES CARDINALITY</span>     |                          |
| **SHOW TAG KEYS**                                             | **{{< icon "check" >}}** |
| <span style="opacity: .5;">SHOW TAG KEY CARDINALITY</span>    |                          |
| **SHOW TAG VALUES**                                           | **{{< icon "check" >}}** |
| <span style="opacity: .5;">SHOW TAG VALUES CARDINALITY</span> |                          |
| **SHOW FIELD KEYS**                                           | **{{< icon "check" >}}** |
| <span style="opacity: .5;">SHOW FIELD KEYS CARDINALITY</span> |                          |

{{% note %}}
#### Cardinality metaqueries

With the InfluxDB 3.0 storage engine, series cardinality is no longer a limiting
factor for database performance.
Cardinality-related metaqueries will likely not be supported with the InfluxDB 3.0
storage engine.
{{% /note %}}

## Function support

### Aggregate functions

| Function                                                                            |        Supported         |
| :---------------------------------------------------------------------------------- | :----------------------: |
| [COUNT()](/influxdb/clustered/reference/influxql/functions/aggregates/#count)       | **{{< icon "check" >}}** |
| [DISTINCT()](/influxdb/clustered/reference/influxql/functions/aggregates/#distinct) | **{{< icon "check" >}}** |
| <span style="opacity: .5;">INTEGRAL()</span>                                        |                          |
| [MEAN()](/influxdb/clustered/reference/influxql/functions/aggregates/#mean)         | **{{< icon "check" >}}** |
| [MEDIAN()](/influxdb/clustered/reference/influxql/functions/aggregates/#median)     | **{{< icon "check" >}}** |
| [MODE()](/influxdb/clustered/reference/influxql/functions/aggregates/#mode)         | **{{< icon "check" >}}** |
| [SPREAD()](/influxdb/clustered/reference/influxql/functions/aggregates/#spread)     | **{{< icon "check" >}}** |
| [STDDEV()](/influxdb/clustered/reference/influxql/functions/aggregates/#stddev)     | **{{< icon "check" >}}** |
| [SUM()](/influxdb/clustered/reference/influxql/functions/aggregates/#sum)           | **{{< icon "check" >}}** |

<!--
INTEGRAL [influxdb_iox#6937](https://github.com/influxdata/influxdb_iox/issues/6937)
-->

### Selector functions

| Function                                                                               |        Supported         |
| :------------------------------------------------------------------------------------- | :----------------------: |
| [BOTTOM()](/influxdb/clustered/reference/influxql/functions/selectors/#bottom)         | **{{< icon "check" >}}** |
| [FIRST()](/influxdb/clustered/reference/influxql/functions/selectors/#first)           | **{{< icon "check" >}}** |
| [LAST()](/influxdb/clustered/reference/influxql/functions/selectors/#last)             | **{{< icon "check" >}}** |
| [MAX()](/influxdb/clustered/reference/influxql/functions/selectors/#max)               | **{{< icon "check" >}}** |
| [MIN()](/influxdb/clustered/reference/influxql/functions/selectors/#min)               | **{{< icon "check" >}}** |
| [PERCENTILE()](/influxdb/clustered/reference/influxql/functions/selectors/#percentile) | **{{< icon "check" >}}** |
| <span style="opacity: .5;">SAMPLE()</span>                                             |                          |
| [TOP()](/influxdb/clustered/reference/influxql/functions/selectors/#top)               | **{{< icon "check" >}}** |

<!-- SAMPLE() [influxdb_iox#6935](https://github.com/influxdata/influxdb_iox/issues/6935) -->

### Transformations

| Function                                                                                                               |        Supported         |
| :--------------------------------------------------------------------------------------------------------------------- | :----------------------: |
| [ABS()](/influxdb/clustered/reference/influxql/functions/transformations/#abs)                                         | **{{< icon "check" >}}** |
| [ACOS()](/influxdb/clustered/reference/influxql/functions/transformations/#acos)                                       | **{{< icon "check" >}}** |
| [ASIN()](/influxdb/clustered/reference/influxql/functions/transformations/#asin)                                       | **{{< icon "check" >}}** |
| [ATAN()](/influxdb/clustered/reference/influxql/functions/transformations/#atan)                                       | **{{< icon "check" >}}** |
| [ATAN2()](/influxdb/clustered/reference/influxql/functions/transformations/#atan2)                                     | **{{< icon "check" >}}** |
| [CEIL()](/influxdb/clustered/reference/influxql/functions/transformations/#ceil)                                       | **{{< icon "check" >}}** |
| [COS()](/influxdb/clustered/reference/influxql/functions/transformations/#cos)                                         | **{{< icon "check" >}}** |
| [CUMULATIVE_SUM()](/influxdb/clustered/reference/influxql/functions/transformations/#cumulative_sum)                   | **{{< icon "check" >}}** |
| [DERIVATIVE()](/influxdb/clustered/reference/influxql/functions/transformations/#derivative)                           | **{{< icon "check" >}}** |
| [DIFFERENCE()](/influxdb/clustered/reference/influxql/functions/transformations/#difference)                           | **{{< icon "check" >}}** |
| [ELAPSED()](/influxdb/clustered/reference/influxql/functions/transformations/#elapsed)                                 | **{{< icon "check" >}}** |
| [EXP()](/influxdb/clustered/reference/influxql/functions/transformations/#exp)                                         | **{{< icon "check" >}}** |
| [FLOOR()](/influxdb/clustered/reference/influxql/functions/transformations/#floor)                                     | **{{< icon "check" >}}** |
| [LN()](/influxdb/clustered/reference/influxql/functions/transformations/#ln)                                           | **{{< icon "check" >}}** |
| [LOG()](/influxdb/clustered/reference/influxql/functions/transformations/#log)                                         | **{{< icon "check" >}}** |
| [LOG2()](/influxdb/clustered/reference/influxql/functions/transformations/#log2)                                       | **{{< icon "check" >}}** |
| [LOG10()](/influxdb/clustered/reference/influxql/functions/transformations/#log10)                                     | **{{< icon "check" >}}** |
| [MOVING_AVERAGE()](/influxdb/clustered/reference/influxql/functions/transformations/#moving_average)                   | **{{< icon "check" >}}** |
| [NON_NEGATIVE_DERIVATIVE()](/influxdb/clustered/reference/influxql/functions/transformations/#non_negative_derivative) | **{{< icon "check" >}}** |
| [NON_NEGATIVE_DIFFERENCE()](/influxdb/clustered/reference/influxql/functions/transformations/#non_negative_difference) | **{{< icon "check" >}}** |
| [POW()](/influxdb/clustered/reference/influxql/functions/transformations/#pow)                                         | **{{< icon "check" >}}** |
| [ROUND()](/influxdb/clustered/reference/influxql/functions/transformations/#round)                                     | **{{< icon "check" >}}** |
| [SIN()](/influxdb/clustered/reference/influxql/functions/transformations/#sin)                                         | **{{< icon "check" >}}** |
| [SQRT()](/influxdb/clustered/reference/influxql/functions/transformations/#sqrt)                                       | **{{< icon "check" >}}** |
| [TAN()](/influxdb/clustered/reference/influxql/functions/transformations/#tan)                                         | **{{< icon "check" >}}** |

### Technical and predictive analysis

| Function                                                              | Supported |
| :-------------------------------------------------------------------- | :-------: |
| <span style="opacity: .5;">CHANDE_MOMENTUM_OSCILLATOR()</span>        |           |
| <span style="opacity: .5;">DOUBLE_EXPONENTIAL_MOVING_AVERAGE()</span> |           |
| <span style="opacity: .5;">EXPONENTIAL_MOVING_AVERAGE()</span>        |           |
| <span style="opacity: .5;">HOLT_WINTERS()</span>                      |           |
| <span style="opacity: .5;">HOLT_WINTERS_WITH_FIT()</span>             |           |
| <span style="opacity: .5;">KAUFMANS_EFFICIENCY_RATIO()</span>         |           |
| <span style="opacity: .5;">KAUFMANS_ADAPTIVE_MOVING_AVERAGE()</span>  |           |
| <span style="opacity: .5;">RELATIVE_STRENGTH_INDEX()</span>           |           |
| <span style="opacity: .5;">TRIPLE_EXPONENTIAL_MOVING_AVERAGE()</span> |           |
| <span style="opacity: .5;">TRIPLE_EXPONENTIAL_DERIVATIVE()</span>     |           |

<!-- All technical analysis functions [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) -->

### Date and time functions

| Function                                                                   |        Supported         |
| :------------------------------------------------------------------------- | :----------------------: |
| [now()](/influxdb/clustered/reference/influxql/functions/date-time/#now)   | **{{< icon "check" >}}** |
| [time()](/influxdb/clustered/reference/influxql/functions/date-time/#time) | **{{< icon "check" >}}** |
| <span style="opacity: .5;">tz()</span>                                     |                          |

<!-- tz() [influxdb_iox#6933](https://github.com/influxdata/influxdb_iox/issues/6933) -->

### Miscellaneous functions

| Function                                                              |        Supported         |
| :-------------------------------------------------------------------- | :----------------------: |
| [fill()](/influxdb/clustered/reference/influxql/functions/misc/#fill) | **{{< icon "check" >}}** |
