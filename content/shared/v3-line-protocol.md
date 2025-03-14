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

_**Optional**_ –
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

_**Optional**_ –
The [unix timestamp](/influxdb3/version/reference/glossary/#unix-timestamp) for the data point.
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
