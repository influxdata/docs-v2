Use InfluxQL miscellaneous functions to perform different operations in
InfluxQL queries.

- [fill()](#fill)

## fill()

Fills _null_ field values returned from empty time windows in `GROUP BY time()`
queries with a specified fill value.

_Supported only in the [`GROUP BY` clause](/influxdb/version/reference/influxql/group-by/)._

```sql
fill(behavior)
```

#### Arguments

- **behavior**: Defines the behavior of the fill operation.
  If no `FILL` clause is included, the default behavior is `fill(null)`.

  The following options are available:

  - **numeric literal**: Replaces null values with the specified numeric literal.
  - **linear**: Uses linear interpolation between existing values to replace null values.
  - **none**: Removes rows with null field values.
  - **null**: Keeps null values and associated timestamps.
  - **previous**: Replaces null values with the most recent non-null value.

#### Examples {#fill-examples}

The following example uses the
[Bitcoin price sample dataset](/influxdb/version/reference/sample-data/#bitcoin-price-data).

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[fill(numeric_literal)](#)
[fill(linear)](#)
[fill(none)](#)
[fill(null)](#)
[fill(previous)](#)
{{% /tabs %}}
{{% tab-content %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(0)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |       mean |
| :------------------- | ---------: |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z |          0 |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /tab-content %}}
{{% tab-content %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(linear)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |       mean |
| :------------------- | ---------: |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z | 29285.3651 |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /tab-content %}}
{{% tab-content %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(none)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |       mean |
| :------------------- | ---------: |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /tab-content %}}
{{% tab-content %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(null)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |       mean |
| :------------------- | ---------: |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z |            |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /tab-content %}}
{{% tab-content %}}

```sql
SELECT
  MEAN(price)
FROM bitcoin
WHERE
  code = 'USD'
  AND time >= '2023-05-01T00:00:00Z'
  AND time < '2023-05-01T02:00:00Z'
GROUP BY
  time(30m)
  fill(previous)
```

{{% influxql/table-meta %}} 
name: bitcoin
{{% /influxql/table-meta %}} 

| time                 |       mean |
| :------------------- | ---------: |
| 2023-05-01T00:00:00Z | 29319.9092 |
| 2023-05-01T00:30:00Z | 29307.4416 |
| 2023-05-01T01:00:00Z | 29307.4416 |
| 2023-05-01T01:30:00Z | 29263.2886 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}


<!-- ## tz()

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
[Home sensor sample dataset](/influxdb/version/reference/sample-data/#home-sensor-data).

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
{{< /expand-wrapper >}} -->
