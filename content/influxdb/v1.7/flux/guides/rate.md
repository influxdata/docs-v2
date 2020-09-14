---
title: Calculate the rate of change
seotitle: Calculate the rate of change in Flux
list_title: Rate
description: >
  Use the `derivative()` function to calculate the rate of change between subsequent values or the
  `aggregate.rate()` function to calculate the average rate of change per window of time.
  If time between points varies, these functions normalize points to a common time interval
  making values easily comparable.
weight: 10
menu:
  influxdb_1_7:
    parent: Query with Flux
    name: Rate
list_query_example: rate_of_change
canonical: /{{< latest "influxdb" "v2" >}}/query-data/flux/rate/
v2: /influxdb/v2.0/query-data/flux/rate/
---


Use the [`derivative()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/derivative/)
to calculate the rate of change between subsequent values or the
[`aggregate.rate()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/experimental/aggregate/rate/)
to calculate the average rate of change per window of time.
If time between points varies, these functions normalize points to a common time interval
making values easily comparable.

## Rate of change between subsequent values
Use the [`derivative()` function](/{{< latest "influxdb" "v2" >}}/reference/flux/stdlib/built-in/transformations/aggregates/derivative/)
to calculate the rate of change per unit of time between subsequent _non-null_ values.

```js
data
  |> derivative(unit: 1s)
```

By default, `derivative()` returns only positive derivative values and replaces negative values with _null_.
Cacluated values are returned as [floats](/{{< latest "influxdb" "v2" >}}/reference/flux/language/types/#numeric-types).


{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 250    |
| 2020-01-01T00:04:00Z | 160    |
| 2020-01-01T00:12:00Z | 150    |
| 2020-01-01T00:19:00Z | 220    |
| 2020-01-01T00:32:00Z | 200    |
| 2020-01-01T00:51:00Z | 290    |
| 2020-01-01T01:00:00Z | 340    |
{{% /flex-content %}}
{{% flex-content %}}
**`derivative(unit: 1m)` returns:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:04:00Z |        |
| 2020-01-01T00:12:00Z |        |
| 2020-01-01T00:19:00Z | 10.0   |
| 2020-01-01T00:32:00Z |        |
| 2020-01-01T00:51:00Z | 4.74   |
| 2020-01-01T01:00:00Z | 5.56   |
{{% /flex-content %}}
{{< /flex >}}

Results represent the rate of change **per minute** between subsequent values with
negative values set to _null_.

### Return negative derivative values
To return negative derivative values, set the `nonNegative` parameter to `false`,

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 250    |
| 2020-01-01T00:04:00Z | 160    |
| 2020-01-01T00:12:00Z | 150    |
| 2020-01-01T00:19:00Z | 220    |
| 2020-01-01T00:32:00Z | 200    |
| 2020-01-01T00:51:00Z | 290    |
| 2020-01-01T01:00:00Z | 340    |
{{% /flex-content %}}
{{% flex-content %}}
**The following returns:**

```js
|> derivative(
  unit: 1m,
  nonNegative: false
)
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:04:00Z | -22.5  |
| 2020-01-01T00:12:00Z | -1.25  |
| 2020-01-01T00:19:00Z | 10.0   |
| 2020-01-01T00:32:00Z | -1.54  |
| 2020-01-01T00:51:00Z | 4.74   |
| 2020-01-01T01:00:00Z | 5.56   |
{{% /flex-content %}}
{{< /flex >}}

Results represent the rate of change **per minute** between subsequent values and
include negative values.
