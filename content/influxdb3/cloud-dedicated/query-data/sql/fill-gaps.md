---
title: Fill gaps in data
seotitle: Fill gaps in data with SQL
description: >
  Use [`date_bin_gapfill`](/influxdb3/cloud-dedicated/reference/sql/functions/time-and-date/#date_bin_gapfill)
  with [`interpolate`](/influxdb3/cloud-dedicated/reference/sql/functions/misc/#interpolate)
  or [`locf`](/influxdb3/cloud-dedicated/reference/sql/functions/misc/#locf) to
  fill gaps of time where no data is returned.
menu:
  influxdb3_cloud_dedicated:
    parent: Query with SQL
weight: 206
list_code_example: |
  ```sql
  SELECT
    date_bin_gapfill(INTERVAL '30 minutes', time) as _time,
    room,
    interpolate(avg(temp))
  FROM home
  WHERE
      time >= '2022-01-01T08:00:00Z'
      AND time <= '2022-01-01T10:00:00Z'
  GROUP BY _time, room
  ```
---

Use [`date_bin_gapfill`](/influxdb3/cloud-dedicated/reference/sql/functions/time-and-date/#date_bin_gapfill)
with [`interpolate`](/influxdb3/cloud-dedicated/reference/sql/functions/misc/#interpolate)
or [`locf`](/influxdb3/cloud-dedicated/reference/sql/functions/misc/#locf) to
fill gaps of time where no data is returned.
Gap-filling SQL queries handle missing data in time series data by filling in
gaps with interpolated values or by carrying forward the last available observation.

**To fill gaps in data:**

1.  Use the `date_bin_gapfill` function to window your data into time-based groups
    and apply an [aggregate function](/influxdb3/cloud-dedicated/reference/sql/functions/aggregate/)
    to each window. If no data exists in a window, `date_bin_gapfill` inserts
    a new row with the starting timestamp of the window, all columns in the
    `GROUP BY` clause populated, and null values for the queried fields.

2.  Use either `interpolate` or `locf` to fill the inserted null values in the specified column.

    - **interpolate**: fills null values by interpolating values between non-null values.
    - **locf**: fills null values by carrying the last observed value forward.
    
    > [!Note]
    > The expression passed to `interpolate` or `locf` must use an
    > [aggregate function](/influxdb3/cloud-dedicated/reference/sql/functions/aggregate/).

3.  Include a `WHERE` clause that sets upper and lower time bounds.
    For example:

{{% influxdb/custom-timestamps %}}
```sql
WHERE time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T10:00:00Z'
```
{{% /influxdb/custom-timestamps %}}


## Example of filling gaps in data

The following examples use the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb3/cloud-dedicated/get-started/write/#construct-line-protocol)
to show how to use `date_bin_gapfill` and the different results of `interplate`
and `locf`.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[interpolate](#)
[locf](#)
{{% /tabs %}}
{{% tab-content %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_gapfill(INTERVAL '30 minutes', time) as _time,
  room,
  interpolate(avg(temp))
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY _time, room
```

| _time                | room        | AVG(home.temp) |
| :------------------- | :---------- | -------------: |
| 2022-01-01T08:00:00Z | Kitchen     |             21 |
| 2022-01-01T08:30:00Z | Kitchen     |             22 |
| 2022-01-01T09:00:00Z | Kitchen     |             23 |
| 2022-01-01T09:30:00Z | Kitchen     |          22.85 |
| 2022-01-01T10:00:00Z | Kitchen     |           22.7 |
| 2022-01-01T08:00:00Z | Living Room |           21.1 |
| 2022-01-01T08:30:00Z | Living Room |          21.25 |
| 2022-01-01T09:00:00Z | Living Room |           21.4 |
| 2022-01-01T09:30:00Z | Living Room |           21.6 |
| 2022-01-01T10:00:00Z | Living Room |           21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{% tab-content %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  date_bin_gapfill(INTERVAL '30 minutes', time) as _time,
  room,
  locf(avg(temp))
FROM home
WHERE
    time >= '2022-01-01T08:00:00Z'
    AND time <= '2022-01-01T10:00:00Z'
GROUP BY _time, room
```

| _time                | room        | AVG(home.temp) |
| :------------------- | :---------- | -------------: |
| 2022-01-01T08:00:00Z | Kitchen     |             21 |
| 2022-01-01T08:30:00Z | Kitchen     |             21 |
| 2022-01-01T09:00:00Z | Kitchen     |             23 |
| 2022-01-01T09:30:00Z | Kitchen     |             23 |
| 2022-01-01T10:00:00Z | Kitchen     |           22.7 |
| 2022-01-01T08:00:00Z | Living Room |           21.1 |
| 2022-01-01T08:30:00Z | Living Room |           21.1 |
| 2022-01-01T09:00:00Z | Living Room |           21.4 |
| 2022-01-01T09:30:00Z | Living Room |           21.4 |
| 2022-01-01T10:00:00Z | Living Room |           21.8 |

{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}
