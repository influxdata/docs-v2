<!--  -->
{{< product-name >}} uses line protocol to write data points.
It is a text-based format that provides the table, tag set, field set, and
timestamp of a data point.

- [Elements of line protocol](#elements-of-line-protocol)
- [Data types and format](#data-types-and-format)
- [Quotes](#quotes)
- [Special characters](#special-characters)
- [Comments](#comments)
- [Naming restrictions](#naming-restrictions)
- [Duplicate points](#duplicate-points)

```js
// Syntax
<table>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]

// Example
myTable,tag1=value1,tag2=value2 fieldKey="fieldValue" 1556813561098000000
```

Lines separated by the newline character `\n` represent a single point
in InfluxDB. Line protocol is whitespace-sensitive.

> [!Note]
> Line protocol does not support the newline character `\n` in tag or field values.

## Elements of line protocol

{{< influxdb/line-protocol commas=false whitespace=false version="v3" >}}

### Table

({{< req >}})
The table name.
InfluxDB accepts one table per point.
_Table names are case-sensitive and subject to [naming restrictions](#naming-restrictions)._

_**Data type:** [String](#string)_

> [!Note]
> If familiar with previous InfluxDB versions, "**table**" is synonymous with
> "**measurement**."

### Tag set

(_**Optional**_)
All tag key-value pairs for the point.
Key-value relationships are denoted with the `=` operand.
Multiple tag key-value pairs are comma-delimited.
_Tag keys and tag values are case-sensitive.
Tag keys are subject to [naming restrictions](#naming-restrictions).
Tag values cannot be empty; instead, omit the tag from the tag set._

_**Key data type:** [String](#string)_  
_**Value data type:** [String](#string)_

### Field set

({{< req >}})
All field key-value pairs for the point.
Points must have at least one field.
_Field keys and string values are case-sensitive.
Field keys are subject to [naming restrictions](#naming-restrictions)._

_**Key data type:** [String](#string)_  
_**Value data type:** [Float](#float) | [Integer](#integer) | [UInteger](#uinteger) | [String](#string) | [Boolean](#boolean)_

> [!Note]
> _Always double quote string field values. More on quotes [below](#quotes)._
> 
> ```sh
> tableName fieldKey="field string value" 1556813561098000000
> ```

### Timestamp

(_**Optional**_)
The [Unix timestamp](/influxdb3/version/reference/glossary/#unix-timestamp) for the data point.
InfluxDB accepts one timestamp per point.
If no timestamp is provided, InfluxDB uses the system time (UTC) of its host machine.

_**Data type:** [Unix timestamp](#unix-timestamp)_

> [!Note]
> #### Important notes about timestamps
> 
> - To ensure a data point includes the time a metric is observed (not received by InfluxDB),
>   include the timestamp.
> - If your timestamps are not in nanoseconds, specify the precision of your timestamps
>   when writing the data to {{< product-name >}}.

### Whitespace

Whitespace in line protocol determines how InfluxDB interprets the data point.
The **first unescaped space** delimits the table and the tag set from the field set.
The **second unescaped space** delimits the field set from the timestamp.

{{< influxdb/line-protocol elements=false commas=false version="v3" >}}

## Data types and format

### Float

IEEE-754 64-bit floating-point numbers.
Default numerical type.
_InfluxDB supports scientific notation in float field values._

##### Float field value examples

```js
myTable fieldKey=1.0
myTable fieldKey=1
myTable fieldKey=-1.234456e+78
```

### Integer

Signed 64-bit integers.
Trailing `i` on the number specifies an integer.

| Minimum integer         | Maximum integer        |
| ---------------         | ---------------        |
| `-9223372036854775808i` | `9223372036854775807i` |

##### Integer field value examples

```js
myTable fieldKey=1i
myTable fieldKey=12485903i
myTable fieldKey=-12485903i
```

### UInteger

Unsigned 64-bit integers.
Trailing `u` on the number specifies an unsigned integer.

| Minimum uinteger | Maximum uinteger        |
| ---------------- | ----------------        |
| `0u`             | `18446744073709551615u` |

##### UInteger field value examples

```js
myTable fieldKey=1u
myTable fieldKey=12485903u
```

### String

Plain text string.
Length limit 64KB.

##### String example

```sh
# String table name, field key, and field value
myTable fieldKey="this is a string"
```

### Boolean

Stores `true` or `false` values.

| Boolean value | Accepted syntax                     |
|:-------------:|:---------------                     |
| True          | `t`, `T`, `true`, `True`, `TRUE`    |
| False         | `f`, `F`, `false`, `False`, `FALSE` |

##### Boolean field value examples

```js
myTable fieldKey=true
myTable fieldKey=false
myTable fieldKey=t
myTable fieldKey=f
myTable fieldKey=TRUE
myTable fieldKey=FALSE
```

> [!Note]
> Do not quote boolean field values.
> Quoted field values are interpreted as strings.

### Unix timestamp

Unix timestamp in a [specified precision](/influxdb3/version/reference/glossary/#unix-timestamp).
Default precision is nanoseconds (`ns`).

| Minimum timestamp      | Maximum timestamp     |
| -----------------      | -----------------     |
| `-9223372036854775806` | `9223372036854775806` |

##### Unix timestamp example

```js
myTableName fieldKey="fieldValue" 1556813561098000000
```

## Quotes

Line protocol supports single and double quotes as described in the following table:

| Element     |              Double quotes              |              Single quotes              |
| :---------- | :-------------------------------------: | :-------------------------------------: |
| Table       | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Tag key     | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Tag value   | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Field key   | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Field value |            **Strings only**             |                  Never                  |
| Timestamp   |                  Never                  |                  Never                  |

<sup class="required">\*</sup> _Line protocol accepts double and single quotes in
table names, tag keys, tag values, and field keys, but interprets them as
part of the name, key, or value._

## Special Characters

Line protocol supports special characters in [string elements](#string).
In the following contexts, it requires escaping certain characters with a backslash (`\`):

| Element     | Escape characters         |
| :---------- | :------------------------ |
| Table       | Comma, Space              |
| Tag key     | Comma, Equals Sign, Space |
| Tag value   | Comma, Equals Sign, Space |
| Field key   | Comma, Equals Sign, Space |
| Field value | Double quote, Backslash   |

You do not need to escape other special characters.

##### Examples of special characters in line protocol

```sh
# Table name with spaces
my\ Table fieldKey="string value"

# Double quotes in a string field value
myTable fieldKey="\"string\" within a string"

# Tag keys and values with spaces
myTable,tag\ Key1=tag\ Value1,tag\ Key2=tag\ Value2 fieldKey=100

# Emojis
myTable,tagKey=🍭 fieldKey="Launch 🚀" 1556813561098000000
```

### Escaping backslashes

Line protocol supports both literal backslashes and backslashes as an escape character.
With two contiguous backslashes, the first is interpreted as an escape character.
For example:

| Backslashes | Interpreted as |
| :---------- | :------------- |
| `\`         | `\`            |
| `\\`        | `\`            |
| `\\\`       | `\\`           |
| `\\\\`      | `\\`           |
| `\\\\\`     | `\\\`          |
| `\\\\\\`    | `\\\`          |

## Comments

Line protocol interprets `#` at the beginning of a line as a comment character
and ignores all subsequent characters until the next newline `\n`.

```sh
# This is a comment
myTable fieldKey="string value" 1556813561098000000
```

## Naming restrictions

Table names, tag keys, and field keys are alphanumeric and must begin with a
letter or a number. They can contain dashes (`-`) and underscores (`_`).

## Duplicate points

A point is uniquely identified by the table name, tag set, and timestamp.
If you submit line protocol with the same table, tag set, and timestamp,
but with a different field set, the field set becomes the union of the old
field set and the new field set, where any conflicts favor the new field set.

{{% show-in "cloud-dedicated,clustered" %}}
> [!Warning]
> #### Duplicate point overwrites are non-deterministic
>
> Overwriting duplicate points (same table, tag set, and timestamp) is _not a reliable way to maintain a last-value view_.
> When duplicate points are flushed together, write ordering is not guaranteed—a prior write may "win."
> See [Anti-patterns to avoid](#anti-patterns-to-avoid) and [Recommended patterns](#recommended-patterns-for-last-value-tracking) below.

### Recommended patterns for last-value tracking

To reliably maintain a last-value view of your data, use one of these append-only patterns:

#### Append-only with unique timestamps (recommended)

Write each change as a new point with a unique timestamp using the actual event time.
Query for the most recent point to get the current value.

**Line protocol example**:

```text
device_status,device_id=sensor01 status="active",temperature=72.5 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1 1700000300000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1 1700000600000000000
```

**SQL query to get latest state**:

```sql
SELECT
  device_id,
  status,
  temperature,
  time
FROM device_status
WHERE time >= now() - INTERVAL '7 days'
  AND device_id = 'sensor01'
ORDER BY time DESC
LIMIT 1
```

**InfluxQL query to get latest state**:

```influxql
SELECT LAST(status), LAST(temperature)
FROM device_status
WHERE device_id = 'sensor01'
  AND time >= now() - 7d
GROUP BY device_id
```

#### Append-only with change tracking field

If you need to filter by "changes since a specific time," add a dedicated `last_change_timestamp` field.

**Line protocol example**:

```text
device_status,device_id=sensor01 status="active",temperature=72.5,last_change_timestamp=1700000000000000000i 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1,last_change_timestamp=1700000300000000000i 1700000300000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1,last_change_timestamp=1700000600000000000i 1700000600000000000
```

**SQL query to get changes since a specific time**:

```sql
SELECT
  device_id,
  status,
  temperature,
  time
FROM device_status
WHERE last_change_timestamp >= 1700000000000000000
ORDER BY time DESC
```

### Anti-patterns to avoid

The following patterns will produce non-deterministic results when duplicate points are flushed together:

#### Don't overwrite the same (time, tags) point

If points with the same time and tag set are flushed to storage together, any of the values might be retained.
For example, **don't do this**:

```text
-- All writes use the same timestamp
device_status,device_id=sensor01 status="active",temperature=72.5 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1 1700000000000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1 1700000000000000000

#### Don't add a field while overwriting data (time, tags)

Adding a field doesn't make points unique.
Points with the same time and tag set are still considered duplicates--for example,
**don't do this**:

```text
-- All writes use the same timestamp, but add a version field
device_status,device_id=sensor01 status="active",temperature=72.5,version=1i 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1,version=2i 1700000000000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1,version=3i 1700000000000000000

#### Don't rely on write delays to force ordering

Delays don't guarantee that duplicate points won't be flushed together.
The flush interval depends on buffer size, ingestion rate, and system load.

For example, **don't do this**:

```text
-- Writing with delays between each write
device_status,device_id=sensor01 status="active" 1700000000000000000
# Wait 10 seconds...
device_status,device_id=sensor01 status="inactive" 1700000000000000000
{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}
### Retention guidance for last-value tables

{{% product-name %}} applies retention at the database level.
If your last-value view only needs to retain data for days or weeks, but your main database retains data for months or years (for example, ~400 days), consider creating a separate database with shorter retention specifically for last-value tracking.

**Benefits**:
- Reduces storage costs for last-value data
- Improves query performance by limiting data volume
- Allows independent retention policies for different use cases

**Example**:

```bash
# Create a database for last-value tracking with 7-day retention
influxctl database create device_status_current --retention-period 7d

# Create your main database with longer retention
influxctl database create device_status_history --retention-period 400d
```

Then write current status to `device_status_current` and historical data to `device_status_history`.
{{% /show-in %}}

{{% show-in "cloud-dedicated,clustered" %}}
### Performance considerations

#### Row count and query performance

Append-only patterns increase row counts compared to overwriting duplicate points.
To maintain query performance:

1. **Limit query time ranges**: Query only the time range you need (for example, last 7 days for current state)
2. **Use time-based filters**: Always include a `WHERE time >=` clause to narrow the query scope
3. **Consider shorter retention**: For last-value views, use a dedicated database with shorter retention

**Example - Good query with time filter**:

```sql
SELECT device_id, status, temperature, time
FROM device_status
WHERE time >= now() - INTERVAL '7 days'
ORDER BY time DESC
```

**Example - Avoid querying entire table**:

```sql
-- Don't do this - queries all historical data
SELECT device_id, status, temperature, time
FROM device_status
ORDER BY time DESC
```

#### Storage and cache bandwidth

Append-only patterns create more data points, which results in larger Parquet files.
This can increase cache bandwidth usage when querying large time ranges.

**Mitigation strategies**:
1. **Narrow time filters**: Query only same-day partitions when possible
2. **Use partition-aligned time ranges**: Queries that align with partition boundaries are more efficient
3. **Consider aggregation**: For historical analysis, use downsampled or aggregated data instead of raw points

**Example - Partition-aligned query**:

```sql
SELECT device_id, status, temperature, time
FROM device_status
WHERE time >= '2025-11-20T00:00:00Z'
  AND time < '2025-11-21T00:00:00Z'
ORDER BY time DESC
```
{{% /show-in %}}
