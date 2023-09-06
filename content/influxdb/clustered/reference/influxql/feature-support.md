---
title: InfluxQL feature support
description: >
  InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
  This process is ongoing and some InfluxQL features are still being implemented.
  This page provides information about the current implementation status of
  InfluxQL features.
menu:
  influxdb_clustered:
    parent: influxql-reference
weight: 220
---

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
This page provides information about the current implementation status of
InfluxQL features.

- [In-progress features](#in-progress-features)
  - [Time zones](#time-zones)
  - [Subqueries](#subqueries)
  - [SLIMIT clause](#slimit-clause)
  - [SOFFSET clause](#soffset-clause)
  - [Project additional fields with selector functions](#project-additional-fields-with-selector-functions)
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

**Tracking issue**: [influxdb_iox#6933](https://github.com/influxdata/influxdb_iox/issues/6933)

### Subqueries

InfluxQL in {{< product-name >}} does not currently support subqueries, which
let you query data from the results of another InfluxQL query.

**Tracking issue**: [influxdb_iox#6897](https://github.com/influxdata/influxdb_iox/issues/6897)

### SLIMIT clause

InfluxQL in {{< product-name >}} does not currently support the `SLIMIT` clause,
which limits the number of [series](/influxdb/clustered/reference/glossary/#series)
returned in query results.

**Tracking issue**: [influxdb_iox#6940](https://github.com/influxdata/influxdb_iox/issues/6940)

### SOFFSET clause

InfluxQL in {{< product-name >}} does not currently support the `SOFFSET` clause,
which specifies the number of [series](/influxdb/clustered/reference/glossary/#series)
to skip before returning results.

**Tracking issue**: [influxdb_iox#6940](https://github.com/influxdata/influxdb_iox/issues/6940)

### Project additional fields with selector functions

InfluxQL in {{< product-name >}} does not currently let you project additional
fields when using [selector functions](/influxdb/clustered/reference/influxql/functions/selectors/).
Selector functions return specific rows with values that meets the criteria
of the function. Projecting other fields returns additional field values associated
with the selected row and timestamp. For example:

```sql
SELECT MAX(co), temp, hum FROM home
```

This query selects the row with the maximum `co` value and should return the
`temp` and `hum` value currently associated with that row.
This query currently returns an error.

**Tracking issue**: [influxdb_iox#7533](https://github.com/influxdata/influxdb_iox/issues/7533)

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

With the InfluxDB IOx storage engine, series cardinality is no longer a limiting
factor for database performance.
Cardinality-related metaqueries will likely not be supported with the IOx
storage engine.
{{% /note %}}

## Function support

### Aggregate functions

| Function                                                                                  |        Supported         | Tracking Issue                                                              |
| :---------------------------------------------------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| [COUNT()](/influxdb/clustered/reference/influxql/functions/aggregates/#count)       | **{{< icon "check" >}}** |                                                                             |
| [DISTINCT()](/influxdb/clustered/reference/influxql/functions/aggregates/#distinct) | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">INTEGRAL()</span>                                              |                          | [influxdb_iox#6937](https://github.com/influxdata/influxdb_iox/issues/6937) |
| [MEAN()](/influxdb/clustered/reference/influxql/functions/aggregates/#mean)         | **{{< icon "check" >}}** |                                                                             |
| [MEDIAN()](/influxdb/clustered/reference/influxql/functions/aggregates/#median)     | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">MODE()</span>                                                  |                          | [influxdb_iox#7334](https://github.com/influxdata/influxdb_iox/issues/7334) |
| <span style="opacity: .5;">SPREAD()</span>                                                |                          | [influxdb_iox#6937](https://github.com/influxdata/influxdb_iox/issues/6937) |
| [STDDEV()](/influxdb/clustered/reference/influxql/functions/aggregates/#stddev)     | **{{< icon "check" >}}** |                                                                             |
| [SUM()](/influxdb/clustered/reference/influxql/functions/aggregates/#sum)           | **{{< icon "check" >}}** |                                                                             |

### Selector functions

| Function                                                                           |        Supported         | Tracking Issue                                                              |
| :--------------------------------------------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| <span style="opacity: .5;">BOTTOM()</span>                                         |                          | [influxdb_iox#6935](https://github.com/influxdata/influxdb_iox/issues/6935) |
| [FIRST()](/influxdb/clustered/reference/influxql/functions/selectors/#first) | **{{< icon "check" >}}** |                                                                             |
| [LAST()](/influxdb/clustered/reference/influxql/functions/selectors/#last)   | **{{< icon "check" >}}** |                                                                             |
| [MAX()](/influxdb/clustered/reference/influxql/functions/selectors/#max)     | **{{< icon "check" >}}** |                                                                             |
| [MIN()](/influxdb/clustered/reference/influxql/functions/selectors/#min)     | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">PERCENTILE()</span>                                     |                          | [influxdb_iox#7664](https://github.com/influxdata/influxdb_iox/issues/7664) |
| <span style="opacity: .5;">SAMPLE()</span>                                         |                          | [influxdb_iox#6935](https://github.com/influxdata/influxdb_iox/issues/6935) |
| <span style="opacity: .5;">TOP()</span>                                            |                          | [influxdb_iox#7650](https://github.com/influxdata/influxdb_iox/issues/7650) |

### Transformations

| Function                                                                                 |        Supported         | Tracking Issue                                                              |
| :--------------------------------------------------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| [ABS()](/influxdb/clustered/reference/influxql/functions/transformations/#abs)     | **{{< icon "check" >}}** |                                                                             |
| [ACOS()](/influxdb/clustered/reference/influxql/functions/transformations/#acos)   | **{{< icon "check" >}}** |                                                                             |
| [ASIN()](/influxdb/clustered/reference/influxql/functions/transformations/#asin)   | **{{< icon "check" >}}** |                                                                             |
| [ATAN()](/influxdb/clustered/reference/influxql/functions/transformations/#atan)   | **{{< icon "check" >}}** |                                                                             |
| [ATAN2()](/influxdb/clustered/reference/influxql/functions/transformations/#atan2) | **{{< icon "check" >}}** |                                                                             |
| [CEIL()](/influxdb/clustered/reference/influxql/functions/transformations/#ceil)   | **{{< icon "check" >}}** |                                                                             |
| [COS()](/influxdb/clustered/reference/influxql/functions/transformations/#cos)     | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">CUMULATIVE_SUM()<span>                                        |                          | [influxdb_iox#7467](https://github.com/influxdata/influxdb_iox/issues/7467) |
| <span style="opacity: .5;">DERIVATIVE()<span>                                            |                          | [influxdb_iox#7647](https://github.com/influxdata/influxdb_iox/issues/7647) |
| <span style="opacity: .5;">DIFFERENCE()<span>                                            |                          | [influxdb_iox#7468](https://github.com/influxdata/influxdb_iox/issues/7468) |
| <span style="opacity: .5;">ELAPSED()<span>                                               |                          | [influxdb_iox#6934](https://github.com/influxdata/influxdb_iox/issues/6934) |
| [EXP()](/influxdb/clustered/reference/influxql/functions/transformations/#exp)     | **{{< icon "check" >}}** |                                                                             |
| [FLOOR()](/influxdb/clustered/reference/influxql/functions/transformations/#floor) | **{{< icon "check" >}}** |                                                                             |
| [LN()](/influxdb/clustered/reference/influxql/functions/transformations/#ln)       | **{{< icon "check" >}}** |                                                                             |
| [LOG()](/influxdb/clustered/reference/influxql/functions/transformations/#log)     | **{{< icon "check" >}}** |                                                                             |
| [LOG2()](/influxdb/clustered/reference/influxql/functions/transformations/#log2)   | **{{< icon "check" >}}** |                                                                             |
| [LOG10()](/influxdb/clustered/reference/influxql/functions/transformations/#log10) | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">MOVING_AVERAGE()<span>                                        |                          | [influxdb_iox#7600](https://github.com/influxdata/influxdb_iox/issues/7600) |
| <span style="opacity: .5;">NON_NEGATIVE_DERIVATIVE()<span>                               |                          | [influxdb_iox#7649](https://github.com/influxdata/influxdb_iox/issues/7649) |
| <span style="opacity: .5;">NON_NEGATIVE_DIFFERENCE()<span>                               |                          | [influxdb_iox#7628](https://github.com/influxdata/influxdb_iox/issues/7628) |
| [POW()](/influxdb/clustered/reference/influxql/functions/transformations/#pow)     | **{{< icon "check" >}}** |                                                                             |
| [ROUND()](/influxdb/clustered/reference/influxql/functions/transformations/#round) | **{{< icon "check" >}}** |                                                                             |
| [SIN()](/influxdb/clustered/reference/influxql/functions/transformations/#sin)     | **{{< icon "check" >}}** |                                                                             |
| [SQRT()](/influxdb/clustered/reference/influxql/functions/transformations/#sqrt)   | **{{< icon "check" >}}** |                                                                             |
| [TAN()](/influxdb/clustered/reference/influxql/functions/transformations/#tan)     | **{{< icon "check" >}}** |                                                                             |

### Technical and predictive analysis

| Function                                                              | Supported | Tracking Issue                                                              |
| :-------------------------------------------------------------------- | :-------: | :-------------------------------------------------------------------------- |
| <span style="opacity: .5;">CHANDE_MOMENTUM_OSCILLATOR()</span>        |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">DOUBLE_EXPONENTIAL_MOVING_AVERAGE()</span> |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">EXPONENTIAL_MOVING_AVERAGE()</span>        |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">HOLT_WINTERS()</span>                      |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">HOLT_WINTERS_WITH_FIT()</span>             |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">KAUFMANS_EFFICIENCY_RATIO()</span>         |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">KAUFMANS_ADAPTIVE_MOVING_AVERAGE()</span>  |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">RELATIVE_STRENGTH_INDEX()</span>           |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">TRIPLE_EXPONENTIAL_MOVING_AVERAGE()</span> |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |
| <span style="opacity: .5;">TRIPLE_EXPONENTIAL_DERIVATIVE()</span>     |           | [influxdb_iox#6939](https://github.com/influxdata/influxdb_iox/issues/6939) |

### Date and time functions

| Function                                                                         |        Supported         | Tracking Issue                                                              |
| :------------------------------------------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| [now()](/influxdb/clustered/reference/influxql/functions/date-time/#now)   | **{{< icon "check" >}}** |                                                                             |
| [time()](/influxdb/clustered/reference/influxql/functions/date-time/#time) | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">tz()</span>                                           |                          | [influxdb_iox#6933](https://github.com/influxdata/influxdb_iox/issues/6933) |

### Miscellaneous functions

| Function                                                                    |        Supported         | Tracking Issue |
| :-------------------------------------------------------------------------- | :----------------------: | :------------- |
| [fill()](/influxdb/clustered/reference/influxql/functions/misc/#fill) | **{{< icon "check" >}}** |                |
