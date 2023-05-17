---
title: InfluxQL feature support
description: >
  InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
  This process is ongoing and some InfluxQL features are still being implemented.
  This page provides information about the current implementation status of
  InfluxQL features.
menu:
  influxdb_cloud_dedicated:
    parent: influxql-reference
weight: 220
---

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
This page provides information about the current implementation status of
InfluxQL features.

- [Function support](#function-support)
  - [Aggregate functions](#aggregate-functions)
  - [Selector functions](#selector-functions)
  - [Transformations](#transformations)
  - [Technical and predictive analysis](#technical-and-predictive-analysis)

## Function support

### Aggregate functions

| Function                                     |        Supported         | Tracking Issue                                                              |
| :------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| [COUNT()](functions/aggregates/#count)       | **{{< icon "check" >}}** |                                                                             |
| [DISTINCT()](functions/aggregates/#distinct) | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">INTEGRAL()</span> |                          | [influxdb_iox#6937](https://github.com/influxdata/influxdb_iox/issues/6937) |
| [MEAN()](functions/aggregates/#mean)         | **{{< icon "check" >}}** |                                                                             |
| [MEDIAN()](functions/aggregates/#median)     | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">MODE()</span>     |                          | [influxdb_iox#7334](https://github.com/influxdata/influxdb_iox/issues/7334) |
| <span style="opacity: .5;">SPREAD()</span>   |                          | [influxdb_iox#6937](https://github.com/influxdata/influxdb_iox/issues/6937) |
| [STDDEV()](functions/aggregates/#stddev)     | **{{< icon "check" >}}** |                                                                             |
| [SUM()](functions/aggregates/#sum)           | **{{< icon "check" >}}** |                                                                             |

### Selector functions

| Function                                       |        Supported         | Tracking Issue                                                              |
| :--------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| <span style="opacity: .5;">BOTTOM()</span>     |                          | [influxdb_iox#6935](https://github.com/influxdata/influxdb_iox/issues/6935) |
| [FIRST()](functions/selectors/#first)          | **{{< icon "check" >}}** |                                                                             |
| [LAST()](functions/selectors/#last)            | **{{< icon "check" >}}** |                                                                             |
| [MAX()](functions/selectors/#max)              | **{{< icon "check" >}}** |                                                                             |
| [MIN()](functions/selectors/#min)              | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">PERCENTILE()</span> |                          | [influxdb_iox#7664](https://github.com/influxdata/influxdb_iox/issues/7664) |
| <span style="opacity: .5;">SAMPLE()</span>     |                          | [influxdb_iox#6935](https://github.com/influxdata/influxdb_iox/issues/6935) |
| <span style="opacity: .5;">TOP()</span>        |                          | [influxdb_iox#7650](https://github.com/influxdata/influxdb_iox/issues/7650) |

### Transformations

| Function                                                   |        Supported         | Tracking Issue                                                              |
| :--------------------------------------------------------- | :----------------------: | :-------------------------------------------------------------------------- |
| [ABS()](functions/transformations/#abs)                    | **{{< icon "check" >}}** |                                                                             |
| [ACOS()](functions/transformations/#acos)                  | **{{< icon "check" >}}** |                                                                             |
| [ASIN()](functions/transformations/#asin)                  | **{{< icon "check" >}}** |                                                                             |
| [ATAN()](functions/transformations/#atan)                  | **{{< icon "check" >}}** |                                                                             |
| [ATAN2()](functions/transformations/#atan2)                | **{{< icon "check" >}}** |                                                                             |
| [CEIL()](functions/transformations/#ceil)                  | **{{< icon "check" >}}** |                                                                             |
| [COS()](functions/transformations/#cos)                    | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">CUMULATIVE_SUM()<span>          |                          | [influxdb_iox#7467](https://github.com/influxdata/influxdb_iox/issues/7467) |
| <span style="opacity: .5;">DERIVATIVE()<span>              |                          | [influxdb_iox#7647](https://github.com/influxdata/influxdb_iox/issues/7647) |
| <span style="opacity: .5;">DIFFERENCE()<span>              |                          | [influxdb_iox#7468](https://github.com/influxdata/influxdb_iox/issues/7468) |
| <span style="opacity: .5;">ELAPSED()<span>                 |                          | [influxdb_iox#6934](https://github.com/influxdata/influxdb_iox/issues/6934) |
| [EXP()](functions/transformations/#exp)                    | **{{< icon "check" >}}** |                                                                             |
| [FLOOR()](functions/transformations/#floor)                | **{{< icon "check" >}}** |                                                                             |
| [LN()](functions/transformations/#ln)                      | **{{< icon "check" >}}** |                                                                             |
| [LOG()](functions/transformations/#log)                    | **{{< icon "check" >}}** |                                                                             |
| [LOG2()](functions/transformations/#log2)                  | **{{< icon "check" >}}** |                                                                             |
| [LOG10()](functions/transformations/#log10)                | **{{< icon "check" >}}** |                                                                             |
| <span style="opacity: .5;">MOVING_AVERAGE()<span>          |                          | [influxdb_iox#7600](https://github.com/influxdata/influxdb_iox/issues/7600) |
| <span style="opacity: .5;">NON_NEGATIVE_DERIVATIVE()<span> |                          | [influxdb_iox#7649](https://github.com/influxdata/influxdb_iox/issues/7649) |
| <span style="opacity: .5;">NON_NEGATIVE_DIFFERENCE()<span> |                          | [influxdb_iox#7628](https://github.com/influxdata/influxdb_iox/issues/7628) |
| [POW()](functions/transformations/#pow)                    | **{{< icon "check" >}}** |                                                                             |
| [ROUND()](functions/transformations/#round)                | **{{< icon "check" >}}** |                                                                             |
| [SIN()](functions/transformations/#sin)                    | **{{< icon "check" >}}** |                                                                             |
| [SQRT()](functions/transformations/#sqrt)                  | **{{< icon "check" >}}** |                                                                             |
| [TAN()](functions/transformations/#tan)                    | **{{< icon "check" >}}** |                                                                             |

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
