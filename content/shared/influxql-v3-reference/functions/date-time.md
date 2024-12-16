Use InfluxQL date and time functions to perform time-related operations.

- [now()](#now)
- [time()](#time)
- [tz()](#tz)

## now()

Returns the current system time (UTC).
_Supported only in the [`WHERE` clause](/influxdb/version/reference/influxql/where/)._

```sql
now()
```

## time()

Used in the [`GROUP BY` clause](/influxdb/version/reference/influxql/group-by/)
to group data into time-based intervals, also known as "windows", using the specified interval.
Timestamps in the `time` column are updated to the start boundary of the window
they're in and grouped by `time`.
Windows use preset round-number boundaries based on the specified interval that
are independent of time conditions in the
[`WHERE` clause](/influxdb/version/reference/influxql/where/).

This operation can be used to do the following:

- Downsample data by aggregating multiple points in each window into a single
  point per window.
- Normalize irregular time series data to occur at regular intervals.

_Supported only in the [`GROUP BY` clause](/influxdb/version/reference/influxql/group-by/)._

```sql
time(interval[, offset])
```

#### Arguments

- **interval**: Duration literal that specifies the window interval.
- **offset**: Duration literal that shifts preset time boundaries forward or backward.
  Can be positive or negative. _Default is `0s`._

##### Examples {#time-examples}

{{< expand-wrapper >}}

{{% expand "Downsample data into time-based intervals" %}}

The following example uses the
[Bitcoin price sample dataset](/influxdb/version/reference/sample-data/#bitcoin-price-data).

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'GBP'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-15T00:00:00Z'
GROUP BY time(2d)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |               mean |
| :------------------- | -----------------: |
| 2023-05-01T00:00:00Z | 23680.120447159094 |
| 2023-05-03T00:00:00Z |  24048.71484033149 |
| 2023-05-05T00:00:00Z |   24461.9194901099 |
| 2023-05-07T00:00:00Z |  23796.43801933702 |
| 2023-05-09T00:00:00Z | 23118.709889285707 |
| 2023-05-11T00:00:00Z | 22465.008364444446 |
| 2023-05-13T00:00:00Z | 22499.464763186803 |

{{% /expand %}}
{{< /expand-wrapper >}}

## tz()

Applies a timezone offset to timestamps in query results.
Offsets include any seasonal offset such as Daylight Savings Time (DST) or
British Summer Time (BST).
_Supported only in the [time zone clause](/influxdb/version/reference/influxql/time-and-timezone/#time-zone-clause)._

```sql
tz(time_zone)
```

#### Arguments

- **time_zone**: Timezone string literal to adjust times to.
  Uses timezone names defined in the
  [Internet Assigned Numbers Authority time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).

#### Examples {#tz-examples}

{{< expand-wrapper >}}

{{% expand "Return the UTC offset for Chicago's time zone" %}}

The following example uses the
[Get started home sensor sample dataset](/influxdb/version/reference/sample-data/#get-started-home-sensor-data).

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
tz('America/Chicago')
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}} 

| time                      |  co |  hum | room    | temp |
| :------------------------ | --: | ---: | :------ | ---: |
| 2022-01-01T02:00:00-06:00 |   0 | 35.9 | Kitchen |   21 |
| 2022-01-01T03:00:00-06:00 |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T04:00:00-06:00 |   0 | 36.1 | Kitchen | 22.7 |
| 2022-01-01T05:00:00-06:00 |   0 |   36 | Kitchen | 22.4 |
| 2022-01-01T06:00:00-06:00 |   0 |   36 | Kitchen | 22.5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}
