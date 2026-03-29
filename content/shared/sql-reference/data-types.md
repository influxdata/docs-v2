<!-- Comment to prevent error from starting with a shortcode -->

{{< product-name >}} uses the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
implementation of SQL.
Data types define the type of values that can be stored in table columns.
In InfluxDB's SQL implementation, a **measurement** is structured as a table,
and  **tags**, **fields** and **timestamps** are exposed as columns.

## SQL and Arrow data types

In SQL, each column, expression, and parameter has a data type.
A data type is an attribute that specifies the type of data that the object can hold.
DataFusion uses the [Arrow](https://arrow.apache.org/) type system for query execution.
All SQL types are mapped to [Arrow data types](https://docs.rs/arrow/latest/arrow/datatypes/enum.DataType.html).

Both SQL and Arrow data types play an important role in how data is operated on
during query execution and returned in query results.

> [!Note]
> When performing casting operations, cast to the SQL data type unless you use
> [`arrow_cast()`](/influxdb/version/reference/sql/functions/misc/#arrow_cast)
> to cast to a specific Arrow type.
> Names and identifiers in SQL are _case-insensitive_ by default. For example:
> 
> ```sql
> SELECT
>   '99'::BIGINT,
>   '2019-09-18T00:00:00Z'::timestamp
> ```

- [String types](#string-types)
- [Numeric types](#numeric-types)
  - [Integers](#integers)
  - [Unsigned integers](#unsigned-integers)
  - [Floats](#floats)
- [Date and time data types](#date-and-time-data-types)
  - [Timestamp](#timestamp)
  - [Interval](#interval)
- [Boolean types](#boolean-types)
- [Unsupported SQL types](#unsupported-sql-types)
- [Data types compatible with parameters](#data-types-compatible-with-parameters)

## String types

| SQL data type | Arrow data type | Description                       |
| :------------ | :-------------- | --------------------------------- |
| STRING        | UTF8            | Character string, variable-length |
| CHAR          | UTF8            | Character string, fixed-length    |
| VARCHAR       | UTF8            | Character string, variable-length |
| TEXT          | UTF8            | Variable unlimited length         |

##### Example string literals

```sql
'abcdefghijk'
'time'
'h2o_temperature'
```

## Numeric types

The following numeric types are supported:

| SQL data type   | Arrow data type | Description                                |
| :-------------- | :-------------- | :----------------------------------------- |
| BIGINT          | INT64           | 64-bit signed integer                      |
| BIGINT UNSIGNED | UINT64          | 64-bit unsigned integer                    |
| DOUBLE          | FLOAT64         | 64-bit floating-point number (~15 digits)  |
| FLOAT           | FLOAT32         | 32-bit floating-point number (~7 digits)   |
| REAL            | FLOAT32         | 32-bit floating-point number (alias for FLOAT) |

### Integers

InfluxDB SQL supports the 64-bit signed integers:

**Minimum signed integer**: `-9223372036854775808`
**Maximum signed integer**: `9223372036854775807`

##### Example integer literals

```sql
234
-446
5
```

### Unsigned integers

InfluxDB SQL supports the 64-bit unsigned integers:

**Minimum unsigned integer**: `0`
**Maximum unsigned integer**: `18446744073709551615`

##### Example unsigned integer literals

Unsigned integer literals are comprised of an integer cast to the `BIGINT UNSIGNED` type:

```sql
234::BIGINT UNSIGNED
458374893::BIGINT UNSIGNED
5::BIGINT UNSIGNED
```

### Floats

InfluxDB SQL supports both 32-bit (single precision) and 64-bit (double precision) floating-point values.

| Type   | Precision | Significant Digits | Use Case |
| :----- | :-------- | :----------------- | :------- |
| FLOAT  | 32-bit    | ~7 digits          | Memory-efficient storage when full precision isn't needed |
| DOUBLE | 64-bit    | ~15-16 digits      | Default for most numeric operations |

> [!Note]
> InfluxDB stores float field values as 64-bit (FLOAT64) internally.
> Casting to FLOAT (32-bit) may lose precision for values with more than ~7 significant digits.
> Unlike PostgreSQL where FLOAT defaults to double precision, InfluxDB SQL treats FLOAT as single precision (32-bit).

##### Example float literals

Float literals are stored as 64-bit double precision:

```sql
23.8
-446.89
5.00
0.033
```

##### Example float casting

```sql
-- Cast to 32-bit float (may lose precision)
SELECT 3.141592653589793::FLOAT;
-- Returns: 3.1415927 (truncated to ~7 digits)

-- Cast to 64-bit double (preserves precision)
SELECT 3.141592653589793::DOUBLE;
-- Returns: 3.141592653589793
```

## Date and time data types

InfluxDB SQL supports the following DATE/TIME data types:

| SQL data type | Arrow data type                    | Description                                   |
| :------------ | :--------------------------------- | :-------------------------------------------- |
| TIMESTAMP     | Timestamp(Nanosecond, None)        | Nanosecond timestamp with no time zone offset |
| INTERVAL      | Interval(IntervalMonthDayNano)     | Interval of time with a specified duration    |

### Timestamp

A time type is a single point in time using nanosecond precision.

The following date and time formats are supported:

```sql
YYYY-MM-DDT00:00:00.000Z
YYYY-MM-DDT00:00:00.000-00:00
YYYY-MM-DD 00:00:00.000-00:00
YYYY-MM-DDT00:00:00Z
YYYY-MM-DD 00:00:00.000
YYYY-MM-DD 00:00:00
```

##### Example timestamp literals

```sql
'2023-01-02T03:04:06.000Z'
'2023-01-02T03:04:06.000-00:00'
'2023-01-02 03:04:06.000-00:00'
'2023-01-02T03:04:06Z'
'2023-01-02 03:04:06.000'
'2023-01-02 03:04:06'
```

### Interval

The INTERVAL data type can be used with the following precision:

- nanosecond
- microsecond
- millisecond
- second
- minute
- hour
- day
- week
- month
- year
- century

##### Example interval literals
```sql
INTERVAL '10 minutes'
INTERVAL '1 year'
INTERVAL '2 days 1 hour 31 minutes'
```

## Boolean types

Booleans store TRUE or FALSE values.

| SQL data type | Arrow data type | Description          |
| :------------ | :-------------- | :------------------- |
| BOOLEAN       | Boolean         | True or false values |

##### Example boolean literals

```sql
true
TRUE
false
FALSE
```

## Unsupported SQL types

The following SQL types are not currently supported:

- UUID
- BLOB
- CLOB
- BINARY
- VARBINARY
- REGCLASS
- NVARCHAR
- CUSTOM
- ARRAY
- ENUM
- SET
- DATETIME
- BYTEA

## Data types compatible with parameters

For information about data types that can be substituted by parameters,
see how to [use parameterized queries with SQL](/influxdb/version/query-data/sql/parameterized-queries/).
