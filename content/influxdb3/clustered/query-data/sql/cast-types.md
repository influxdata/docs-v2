---
title: Cast values to different types
seotitle: Cast values to different data types in SQL
description: >
  Use the `CAST` function or double-colon `::` casting shorthand syntax to cast
  a value to a specific type.
menu:
  influxdb3_clustered:
    name: Cast types
    parent: Query with SQL
    identifier: query-sql-cast-types
weight: 205
influxdb3/clustered/tags: [query, sql]
related:
  - /influxdb3/clustered/reference/sql/data-types/
list_code_example: |
  ```sql
  -- CAST clause
  SELECT CAST(1234.5 AS BIGINT)

  -- Double-colon casting shorthand
  SELECT 1234.5::BIGINT
  ```
---

Use the `CAST` function or double-colon `::` casting shorthand syntax to cast a
value to a specific type.

```sql
-- CAST function
SELECT CAST(1234.5 AS BIGINT)

-- Double-colon casting shorthand
SELECT 1234.5::BIGINT
```

- [Cast to a string type](#cast-to-a-string-type)
- [Cast to numeric types](#cast-to-numeric-types)
  - [Float](#cast-to-a-float)
  - [Integer](#cast-to-an-integer)
  - [Unsigned integer](#cast-to-an-unsigned-integer)
- [Cast to a boolean type](#cast-to-a-boolean-type)
- [Cast to a timestamp type](#cast-to-a-timestamp-type)

Casting operations can be performed on a column expression or a literal value.
For example, the following query uses the
[get started sample data](/influxdb3/clustered/get-started/write/#construct-line-protocol)
and: 

- Casts all values in the `time` column to integers (Unix nanosecond timestamps).
- Casts the literal string value `'1234'` to a 64-bit float for each row.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  time::BIGINT AS unix_time,
  '1234'::DOUBLE AS string_to_float
FROM home
LIMIT 5
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  CAST(time AS BIGINT) AS unix_time,
  CAST('1234' AS DOUBLE) AS string_to_float
FROM home
LIMIT 5
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% influxdb/custom-timestamps %}}

| unix_time           | string_to_float |
| :------------------ | --------------: |
| 1641024000000000000 |            1234 |
| 1641027600000000000 |            1234 |
| 1641031200000000000 |            1234 |
| 1641034800000000000 |            1234 |
| 1641038400000000000 |            1234 |

{{% /influxdb/custom-timestamps %}}

---

## Cast to a string type

Use the `STRING`, `CHAR`, `VARCHAR`, or `TEXT` type in a casting operation to
cast a value to a string.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
value::STRING
value::CHAR
value::VARCHAR
value::TEXT
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(value AS STRING)
CAST(value AS CHAR)
CAST(value AS VARCHAR)
CAST(value AS TEXT)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL supports casting the following to a string value:

- **Floats**
- **Integers**
- **Unsigned integers**
- **Booleans**
- **Timestamps**

---

## Cast to numeric types

The InfluxDB SQL implementation supports 64-bit floats (`DOUBLE`),
integers (`BIGINT`), and unsigned integers (`BIGINT UNSIGNED`).

### Cast to a float

Use the `DOUBLE` type in a casting operation to cast a value to a 64-bit float.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
value::DOUBLE
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(value AS DOUBLE)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL supports casting the following to a float value:

- **Strings**: Returns the float equivalent of the numeric string (`[0-9]`).
  The following string patterns are also supported:

  - Scientific notation (`'123.4E+10'`)
  - Infinity (`'±Inf'`)
  - NaN (`'NaN'`)

- **Integers**
- **Unsigned integers**

### Cast to an integer

Use the `BIGINT` type in a casting operation to cast a value to a 64-bit signed integer.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
value::BIGINT
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(value AS BIGINT)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL supports casting the following to an integer:

- **Strings**: Returns the integer equivalent of the numeric string (`[0-9]`).
- **Floats**: Truncates the float value at the decimal.
- **Unsigned integers**: Returns the signed integer equivalent of the unsigned integer.
- **Booleans**: Returns `1` for `true` and `0` for `false`.
- **Timestamps**: Returns the equivalent
  [nanosecond epoch timestamp](/influxdb3/clustered/reference/glossary/#unix-timestamp).

### Cast to an unsigned integer

Use the `BIGINT UNSIGNED` type in a casting operation to cast a value to a
64-bit unsigned integer.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
value::BIGINT UNSIGNED
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(value AS BIGINT UNSIGNED)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL supports casting the following to an unsigned integer:

- **Strings**: Returns the unsigned integer equivalent of the numeric string (`[0-9]`).
- **Floats**: Truncates the float value at the decimal.
- **Integers**: Returns the unsigned integer equivalent of the signed integer.
- **Booleans**: Returns `1` for `true` and `0` for `false`.
- **Timestamps**: Returns the equivalent
  [nanosecond epoch timestamp](/influxdb3/clustered/reference/glossary/#unix-timestamp).

---

## Cast to a boolean type

Use the `BOOLEAN` type in a casting operation to cast a value to a boolean.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
value::BOOLEAN
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(value AS BOOLEAN)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL supports casting the following to a boolean:

- **Strings**
  - Return `true`:
    - `'true'` _(case-insensitive)_
    - `'t'`, _(case-insensitive)_
    - `'1'`
  - Return `false`:
    - `'false'` _(case-insensitive)_
    - `'f'` _(case-insensitive)_
    - `'0'`
- **Integers**
  - Returns `true`: positive non-zero integer
  - Returns `false`: `0`
- **Unsigned integers**
  - Returns `true`: non-zero unsigned integer
  - Returns `false`: `0`

---

## Cast to a timestamp type

Use the `TIMESTAMP` type in a casting operation to cast a value to a timestamp.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
value::TIMESTAMP
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(value AS TIMESTAMP)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

SQL supports casting the following to a timestamp:

- **Strings**: Returns the timestamp equivalent of the string value.
  The following RFC3339 and RFC339-like string patterns are supported:

    - `YYYY-MM-DDT00:00:00.000Z`
    - `YYYY-MM-DDT00:00:00.000-00:00`
    - `YYYY-MM-DD 00:00:00.000-00:00`
    - `YYYY-MM-DDT00:00:00Z`
    - `YYYY-MM-DD 00:00:00.000`
    - `YYYY-MM-DD 00:00:00`
    - `YYYY-MM-DD`

- **Integers**: Parses the integer as a Unix _second_ timestamp and returns
  the equivalent timestamp.
- **Unsigned integers**: Parses the unsigned integer as a Unix nanosecond timestamp
  and returns the equivalent timestamp.

> [!Note]
> #### Cast Unix nanosecond timestamps to a timestamp type
> 
> To cast a Unix nanosecond timestamp to a timestamp type, first cast the numeric
> value to an unsigned integer (`BIGINT UNSIGNED`) and then a timestamp.
> Use the [`to_timestamp_nanos`](/influxdb3/clustered/reference/sql/functions/time-and-date/#to_timestamp_nanos)
> function.
> 
> {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[:: shorthand](#)
[CAST()](#)
[to_timestamp_nanos](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
1704067200000000000::BIGINT UNSIGNED::TIMESTAMP
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
CAST(CAST(1704067200000000000 AS BIGINT UNSIGNED) AS TIMESTAMP)
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
to_timestamp_nanos(1704067200000000000)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Timestamp functions

You can also use the following SQL functions to cast a value to a timestamp type:

- [`to_timestamp`](/influxdb3/clustered/reference/sql/functions/time-and-date/#to_timestamp)
- [`to_timestamp_millis`](/influxdb3/clustered/reference/sql/functions/time-and-date/#to_timestamp_millis)
- [`to_timestamp_micros`](/influxdb3/clustered/reference/sql/functions/time-and-date/#to_timestamp_micros)
- [`to_timestamp_nanos`](/influxdb3/clustered/reference/sql/functions/time-and-date/#to_timestamp_nanos)
- [`to_timestamp_seconds`](/influxdb3/clustered/reference/sql/functions/time-and-date/#to_timestamp_seconds)
