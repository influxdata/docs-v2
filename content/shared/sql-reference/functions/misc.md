The {{< product-name >}} SQL implementation supports the following miscellaneous functions
for performing a variety of operations:

- [arrow_cast](#arrow_cast)
- [arrow_typeof](#arrow_typeof)
- [get_field](#get_field)
- [interpolate](#interpolate)
- [locf](#locf)
- [version](#version)

## arrow_cast

Casts a value to a specific Arrow data type.

```sql
arrow_cast(expression, datatype)
```

### Arguments

- **expression**: Expression to cast.
  Can be a constant, column, or function, and any combination of arithmetic or
  string operators.
- **datatype**: [Arrow data type](/influxdb/version/reference/sql/data-types/#sql-and-arrow-data-types)
  to cast to.

{{< expand-wrapper >}}
{{% expand "View `arrow_cast` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

```sql
SELECT
  arrow_cast(time, 'Int64') AS time,
  arrow_cast(temp, 'Utf8') AS temp,
  arrow_cast(co, 'Float64')AS co
FROM home
LIMIT 1
```

| time                | temp |  co |
| :------------------ | ---: | --: |
| 1641024000000000000 | 21.0 |   0 |

{{% /expand %}}
{{< /expand-wrapper >}}

## arrow_typeof

Returns the underlying [Arrow data type](https://arrow.apache.org/datafusion/user-guide/sql/data_types.html)
of the expression:

```sql
arrow_typeof(expression)
```

### Arguments

- **expression**: Expression to evaluate.
  Can be a constant, column, or function, and any combination of arithmetic or
  string operators.

{{< expand-wrapper >}}
{{% expand "View `arrow_typeof` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

```sql
SELECT
  arrow_typeof(time) AS time,
  arrow_typeof(room) AS room,
  arrow_typeof(temp) AS temp,
  arrow_typeof(co) AS co
FROM home
LIMIT 1
```

| time                        | room                    | temp    | co    |
| :-------------------------- | :---------------------- | :------ | :---- |
| Timestamp(Nanosecond, None) | Dictionary(Int32, Utf8) | Float64 | Int64 |

{{% /expand %}}
{{< /expand-wrapper >}}

## get_field

Returns a field from a map or a struct with the specified key.

> [!Note]
> Typically, `get_field` is indirectly invoked via field access syntax such as
> `my_struct['field_name']` which results in the call:
> `get_field(my_struct, 'field_name')`.

```sql
get_field(collection, field)
```

### Arguments

- **collection**: The map or struct to retrieve a field from.
- **field**: The name of field the field to retrieve from the map or struct.
  Must evaluate to a string.

{{< expand-wrapper >}}
{{% expand "View `get_field` example with a struct column" %}}

```sql
SELECT
  get_field(influxdb_struct, 'version') AS influxdb_version
FROM
  (VALUES (struct('influxdb' AS product, 'v1' AS version)),
          (struct('influxdb' AS product, 'v2' AS version)),
          (struct('influxdb' AS product, 'v3' AS version))
  ) AS data(influxdb_struct)
```

| influxdb_version |
| :--------------- |
| v1               |
| v2               |
| v3               |

{{% /expand %}}
{{% expand "View `get_field` example with a map column" %}}

```sql
SELECT
  get_field(influxdb_map, 'version') AS influxdb_version
FROM
  (VALUES (map {'product': 'influxdb', 'version': 'v1'}),
          (map {'product': 'influxdb', 'version': 'v2'}),
          (map {'product': 'influxdb', 'version': 'v3'})
  ) AS data(influxdb_map)
```

| influxdb_version |
| :--------------- |
| v1               |
| v2               |
| v3               |

{{% /expand %}}
{{< /expand-wrapper >}}

## interpolate

Fills null values in a specified aggregated column by interpolating values
from existing values.
Must be used with [`date_bin_gapfill`](/influxdb/version/reference/sql/functions/time-and-date/#date_bin_gapfill).

```sql
interpolate(aggregate_expression)
```

### Arguments

- **aggregate_expression**: Aggregate operation on a specified expression.
  The operation can use any [aggregate function](/influxdb/version/reference/sql/functions/aggregate/).
  The expression can be a constant, column, or function, and any combination of
  arithmetic operators supported by the aggregate function.

##### Related functions

[date_bin_gapfill](/influxdb/version/reference/sql/functions/time-and-date/#date_bin_gapfill),
[locf](#locf)

{{< expand-wrapper >}}
{{% expand "View `interpolate` query example" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

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

{{% /expand %}}
{{< /expand-wrapper >}}

## locf

Fills null values in a specified aggregated column by carrying the last observed
value forward.
Must be used with [`date_bin_gapfill`](/influxdb/version/reference/sql/functions/time-and-date/#date_bin_gapfill).

_LOCF is an initialism of "last observation carried forward."_

```sql
locf(aggregate_expression)
```

### Arguments

- **aggregate_expression**: Aggregate operation on a specified expression.
  The operation can use any [aggregate function](/influxdb/version/reference/sql/functions/aggregate/).
  The expression can be a constant, column, or function, and any combination of
  arithmetic operators supported by the aggregate function.

##### Related functions

[date_bin_gapfill](/influxdb/version/reference/sql/functions/time-and-date/#date_bin_gapfill),
[interpolate](#interpolate)

{{< expand-wrapper >}}
{{% expand "View `locf` query example" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/version/get-started/write/#construct-line-protocol)._

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

{{% /expand %}}
{{< /expand-wrapper >}}

## version

Returns the version of DataFusion.

```sql
version()
```
