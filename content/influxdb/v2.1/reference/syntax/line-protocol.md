---
title: Line protocol
description: >
  InfluxDB uses line protocol to write data points.
  It is a text-based format that provides the measurement, tag set, field set, and timestamp of a data point.
menu:
  influxdb_2_1_ref:
    parent: Syntax
weight: 102
influxdb/v2.1/tags: [write, line protocol, syntax]
aliases:
  - /influxdb/v2.1/reference/line-protocol
  - /influxdb/v2.1/write_protocols/line_protocol_tutorial/
  - /influxdb/v2.1/write_protocols/line_protocol_reference/
related:
  - /influxdb/v2.1/write-data/
---

InfluxDB uses line protocol to write data points.
It is a text-based format that provides the measurement, tag set, field set, and timestamp of a data point.

- [Elements of line protocol](#elements-of-line-protocol)
- [Data types and format](#data-types-and-format)
- [Quotes](#quotes)
- [Special characters](#special-characters)
- [Comments](#comments)
- [Naming restrictions](#naming-restrictions)
- [Duplicate points](#duplicate-points)

```js
// Syntax
<measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]

// Example
myMeasurement,tag1=value1,tag2=value2 fieldKey="fieldValue" 1556813561098000000
```

## Lines

Line protocol consists of zero or more lines, each terminated by a newline character `\n`.
A line may represent one of the following:
- [data point]() that represents a [point]() in InfluxDB
- blank line that consists entirely of [whitespace]()
- comment that starts with `#`

Line protocol is [whitespace-sensitive]().
Line protocol string elements may support certain [special characters](#special-characters).

## Character set

Line protocol is encoded as a sequence of UTF-8-encoded Unicode characters.

## Elements of line protocol

Lines that represent data points contain a [measurement name], optional [tags], at least one [field], and an optional [timestamp].

```
measurementName,tagKey=tagValue fieldKey="fieldValue" 1465839830100400200
--------------- --------------- --------------------- -------------------
       |               |                  |                    |
  Measurement       Tag set           Field set            Timestamp
```

### Measurement

({{< req >}})
The measurement name.
InfluxDB accepts one measurement per point.
_Measurement names are case-sensitive and subject to [naming restrictions](#naming-restrictions)._

_**Data type:** [String](#string)_


### Tag set

_**Optional**_ –
All tag key-value pairs for the point.
Key-value relationships are denoted with the `=` operand.
Multiple tag key-value pairs are comma-delimited.
_Tag keys and tag values are case-sensitive.
Tag keys are subject to [naming restrictions](#naming-restrictions)._

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

{{% note %}}
_Always double quote string field values. More on quotes [below](#quotes)._

```sh
measurementName fieldKey="field string value" 1556813561098000000
```
{{% /note %}}

### Timestamp

_**Optional**_ –
The [unix timestamp](/influxdb/v2.1/reference/glossary/#unix-timestamp) for the data point.
InfluxDB accepts one timestamp per point.
If no timestamp is provided, InfluxDB uses the system time (UTC) of its host machine.

_**Data type:** [Unix timestamp](#unix-timestamp)_

{{% note %}}

#### Important notes about timestamps

- To ensure a data point includes the time a metric is observed (not received by InfluxDB),
  include the timestamp.
- If your timestamps are not in nanoseconds, specify the precision of your timestamps
  when [writing the data to InfluxDB](/influxdb/v2.1/write-data/#timestamp-precision).

{{% /note %}}

### Whitespace

Whitespace in line protocol determines how InfluxDB interprets the data point.
Allowed whitespace characters are regular spaces ` ` and carriage-returns `\r`.
The **first unescaped space** delimits the measurement and the tag set from the field set.
The **second unescaped space** delimits the field set from the timestamp.

```
measurementName,tagKey=tagValue fieldKey="fieldValue" 1465839830100400200
                               |                     |
                           1st space             2nd space
```

## Data types and format

### Float

IEEE-754 64-bit floating-point numbers.
Default numerical type.
_InfluxDB supports scientific notation in float field values._

##### Float field value examples

```js
myMeasurement fieldKey=1.0
myMeasurement fieldKey=1
myMeasurement fieldKey=-1.234456e+78
```

### Integer

Signed 64-bit integers.
Trailing `i` on the number specifies an integer.

| Minimum integer         | Maximum integer        |
| ---------------         | ---------------        |
| `-9223372036854775808i` | `9223372036854775807i` |

##### Integer field value examples

```js
myMeasurement fieldKey=1i
myMeasurement fieldKey=12485903i
myMeasurement fieldKey=-12485903i
```

### UInteger

Unsigned 64-bit integers.
Trailing `u` on the number specifies an unsigned integer.

| Minimum uinteger | Maximum uinteger        |
| ---------------- | ----------------        |
| `0u`             | `18446744073709551615u` |

##### UInteger field value examples

```js
myMeasurement fieldKey=1u
myMeasurement fieldKey=12485903u
```

### String

Plain text string.
Length limit 64KB.

##### String example

```sh
# String measurement name, field key, and field value
myMeasurement fieldKey="this is a string"
```

### Boolean

Stores `true` or `false` values.

| Boolean value | Accepted syntax                     |
|:-------------:|:---------------                     |
| True          | `t`, `T`, `true`, `True`, `TRUE`    |
| False         | `f`, `F`, `false`, `False`, `FALSE` |

##### Boolean field value examples

```js
myMeasurement fieldKey=true
myMeasurement fieldKey=false
myMeasurement fieldKey=t
myMeasurement fieldKey=f
myMeasurement fieldKey=TRUE
myMeasurement fieldKey=FALSE
```

{{% note %}}
Do not quote boolean field values.
Quoted field values are interpreted as strings.
{{% /note %}}

### Unix timestamp

Unix timestamp in a [specified precision](/influxdb/v2.1/reference/glossary/#unix-timestamp).
A timestamp is the number of seconds, milliseconds, microseconds or nanoseconds since Jan 1st 1970 UTC.
InfluxDB uses nanoseconds (`ns`) as the default precision.
Given InfluxDB cannot determine the unit of precision from the timestamp value,
precision is passed as external metadata (e.g., in the `?precision=` HTTP query parameter).

| Minimum timestamp      | Maximum timestamp     |
| -----------------      | -----------------     |
| `-9223372036854775806` | `9223372036854775806` |

##### Unix timestamp example

```js
myMeasurementName fieldKey="fieldValue" 1556813561098000000
```

## Quotes

Line protocol supports single and double quotes as described in the following table:

| Element     | Double quotes                           | Single quotes                           |
| :------     | :------------:                          |:-------------:                          |
| Measurement | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Tag key     | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Tag value   | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Field key   | _Limited_ <sup class="required">*</sup> | _Limited_ <sup class="required">*</sup> |
| Field value | **Strings only**                        | Never                                   |
| Timestamp   | Never                                   | Never                                   |

<sup class="required">\*</sup> _Line protocol accepts double and single quotes in
measurement names, tag keys, tag values, and field keys, but interprets them as
part of the name, key, or value._

## Special Characters

Line protocol supports special characters in [string elements](#string).
In the following contexts, it requires escaping certain characters with a backslash (`\`):

|: Escape sequence :|: Applies to elements :|
| `\n` is replaced by `U+000A` (newline) | field string values only |
| `\r` is replaced by `U+000D` (carriage-return) | [field string values only |
| `\t` is replaced by `U+0009` (tab) | field string values only |
| `\` is replaced by space `U+0020` (space) | all except field string values |
| `\,` is replaced with `,` | all except field string values |
| `\=` is replaced with `=` | all except field string values and measurements |
| `\”` is replaced with `”` | field string values only |
| `\\` is replaced with `\` | field string values only |

To unescape a character within a backslash escape sequence, InfluxDB removes _the last backslash_ and its following character and replaces them with the replacement character.
If the backslash is followed by a character not supported by the element, both the backslash and its following character remain in place, unchanged.
Note that the above rules imply that a tag key, tag value, field key, or measurement cannot end with a backslash character.

### Escaping backslashes

Line protocol supports both literal backslashes and backslashes as an escape character.
With two contiguous backslashes, the first is interpreted as an escape character.
For example:

| Backslashes | Interpreted as |
|:-----------:|:-------------:|
| `\`         | `\`           |
| `\\`        | `\`           |
| `\\\`       | `\\`          |
| `\\\\`      | `\\`          |
| `\\\\\`     | `\\\`         |
| `\\\\\\`    | `\\\`         |

##### Examples of special characters in line protocol

```sh
# Measurement name with spaces
my\ Measurement fieldKey="string value"

# Double quotes in a string field value
myMeasurement fieldKey="\"string\" within a string"

# Tag keys and values with spaces
myMeasurement,tag\ Key1=tag\ Value1,tag\ Key2=tag\ Value2 fieldKey=100

# Emojis
myMeasurement,tagKey=🍭 fieldKey="Launch 🚀" 1556813561098000000
```

## Comments

Line protocol interprets `#` at the beginning of a line as a comment character
and ignores all subsequent characters until the next newline `\n`.

```sh
# This is a comment
myMeasurement fieldKey="string value" 1556813561098000000
```

## Naming restrictions

Measurement names, tag keys, and field keys cannot begin with an underscore `_`.
The `_` namespace is reserved for InfluxDB system use.

## Canonical form

**Canonical form** describes a [tag set](/influxdb/v2.1/reference/key-concepts/data-elements/#tag-set) in which the tags' decoded values are in lexical order, lowest to highest.
Decoding line protocol is often more efficient when points are written with tags in canonical form.

The data point in the following example has a tag set in canonical form:

```sh
# The tag set below is in canonical form.
foo,a\ b=x,aB=y value=99
```

## Duplicate points

A point is uniquely identified by the measurement name, tag set, and timestamp.
If you submit line protocol with the same measurement, tag set, and timestamp,
but with a different field set, the field set becomes the union of the old
field set and the new field set, where any conflicts favor the new field set.

## Out of range values

Fields can hold numeric values, which have the potential for falling outside supported ranges.
Integer and float values should be considered **out of range** if they can't fit within a 64-bit value of the appropriate type. Out of range values may generate [parsing errors](#parsing-errors).

A timestamp must fall within the range 1677-09-21T00:12:43.145224194Z to 2262-04-11T23:47:16.854775806Z (this is almost the range of a 64-bit signed integer when expressed as nanoseconds from the epoch, but with a few nanoseconds removed at either end to allow for sentinel values).

## Parsing errors

When a line protocol decoder encounters an invalid line, tag or field (e.g., with an [out-of-range value]),
it may choose to recover from the error by ignoring the offending value or it may fail the decoding.
One common approach to handling syntax errors is for the decoder to recover by discarding data until the next newline character and then resume parsing.
