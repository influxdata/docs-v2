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
  - /influxdb/v2.1/reference/key-concepts/data-elements/
  - /influxdb/v2.1/write-data/best-practices/schema-design/
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
- [Out of range values](#out-of-range-values)
- [Parse errors](#parse-errors)

#### Syntax

```py
# Line protocol syntax
<measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]
```
#### Example

```py
# Line protocol example
myMeasurement,tag1=value1,tag2=value2 fieldKey="fieldValue" 1556813561098000000
```

## Lines

Line protocol consists of zero or more entries, each terminated by the newline character (`\n`).
A line contains one of the following:
- [data point](#elements-of-line-protocol) that represents a [point](/influxdb/v2.1/reference/key-concepts/data-elements) in InfluxDB
- blank line that consists entirely of [whitespace](#whitespace)
- [comment](#comments) that starts with `#` optionally preceded by whitespace.

Line protocol is [whitespace-sensitive](#whitespace).
Line protocol string elements may support certain [special characters](#special-characters).

## Elements of line protocol

Lines that represent data points contain a [measurement name](#measurement), optional [tags](#tag-set), at least one [field](#field-set), and an optional [timestamp](#timestamp).

```js
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

{{% note %}}

To learn more about designing efficient measurements for InfluxDB, see [best practices for schema design](/influxdb/v2.1/write-data/best-practices/schema-design/).

{{% /note %}}

### Tag set

_**Optional**_ –
All [tag](/influxdb/v2.1/reference/key-concepts/data-elements/#tags) key-value pairs for the point.
Key-value relationships are denoted by the `=` operand.
Multiple tag key-value pairs are comma-delimited.
_Tag keys and tag values are case-sensitive.
Tag keys are subject to [naming restrictions](#naming-restrictions)._

_**Key data type:** [String](#string)_  
_**Value data type:** [String](#string)_

#### Canonical form

**Canonical form** describes a [tag set](/influxdb/v2.1/reference/key-concepts/data-elements/#tag-set) in which the tags' decoded values are in lexical order, lowest to highest.
Line protocol consumers are often more efficient at decoding points with tags in canonical form.

The data point in the following example has a tag set in canonical form:

```py
# The tag set below is in canonical form.
foo,a\ b=x,aB=y value=99
```

{{% note %}}

To learn more about designing efficient tags for InfluxDB, see [best practices for schema design](/influxdb/v2.1/write-data/best-practices/schema-design/).

{{% /note %}}

### Field set

({{< req >}})
All [field](/influxdb/v2.1/reference/key-concepts/data-elements/#fields) key-value pairs for the point.
Points must have at least one field.
_Field keys and string values are case-sensitive.
Field keys are subject to [naming restrictions](#naming-restrictions)._

_**Key data type:** [String](#string)_  
_**Value data type:** [Float](#float) | [Integer](#integer) | [UInteger](#uinteger) | [String](#string) | [Boolean](#boolean)_

{{% note %}}

Always double quote string field values. Learn more about using [quotes in line protocol](#quotes).

```py
measurementName fieldKey="string field value" 1556813561098000000
measurementName fieldKey="\"quoted words\" in a string field value" 1556813561098000000
```

{{% /note %}}

{{% note %}}

To learn more about designing efficient fields for InfluxDB, see [best practices for schema design](/influxdb/v2.1/write-data/best-practices/schema-design/).

{{% /note %}}

### Timestamp

_**Optional**_ –
Unix timestamp for the data point.
InfluxDB accepts one timestamp per point.

If no timestamp is provided, InfluxDB uses the system time (UTC) of its host machine. To ensure a data point includes the time a metric is observed (not received by InfluxDB), include the timestamp.

Nanoseconds is the default precision for timestamps. If your timestamps are not in nanoseconds, specify the precision when [writing the data to InfluxDB](/influxdb/v2.1/write-data/#timestamp-precision).

_**Data type:** [Unix timestamp](#unix-timestamp)_

#### Example

```py
myMeasurementName fieldKey="fieldValue" 1556813561098000000
                                        -------------------
                                                  |
                                              Timestamp
```

### Whitespace

Whitespace in line protocol determines how InfluxDB interprets the data point.
Allowed whitespace characters are regular spaces (` `) and carriage-returns (`\r`). Carriage-returns (`\r`) are only allowed as whitespace when they immediately precede a newline (`\n`).
The **first unescaped space** after the start of the measurement delimits the [measurement](#measurement) and the [tag set](#tag-set) from the [field set](#field-set).
The **second unescaped space** delimits the field set from the [timestamp](#timestamp).

```js
measurementName,tagKey=tagValue fieldKey="fieldValue" 1465839830100400200
                               |                     |
                           1st space             2nd space
```

## Data types and format

### Character set

Line protocol is composed of Unicode characters encoded in UTF-8. Non-printable ASCII characters (0x00 - 0x1f and 0x7f) are not allowed.

### Float

64-bit floating-point numbers. Note that non-finite numbers (NaN and Inf) are not allowed.
Default numerical type.

#### Float field value examples

```py
myMeasurement fieldKey=1.0
myMeasurement fieldKey=1
```

InfluxDB supports scientific notation in float field values.

```py
myMeasurement fieldKey=-1.234456e+78

```
### Integer

Signed 64-bit integers.
Trailing `i` on the number specifies an integer.

| Minimum integer         | Maximum integer        |
| ---------------         | ---------------        |
| `-9223372036854775808i` | `9223372036854775807i` |

#### Integer field value examples

```py
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

#### UInteger field value examples

```py
myMeasurement fieldKey=1u
myMeasurement fieldKey=12485903u
```

### String

Plain text string.
Length limit is 1.8432MB. 64K is the recommended length limit.

#### String example

```py
# String measurement name, field key, and field value
myMeasurement fieldKey="this is a string"
```

### Boolean

Stores `true` or `false` values.

| Boolean value | Accepted syntax                     |
|:-------------:|:---------------                     |
| True          | `t`, `T`, `true`, `True`, `TRUE`    |
| False         | `f`, `F`, `false`, `False`, `FALSE` |

#### Boolean field value examples

```py
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

[Unix timestamp](/influxdb/v2.1/reference/glossary/#unix-timestamp) within the range `1677-09-21T00:12:43.145224194Z` to `2262-04-11T23:47:16.854775806Z` (i.e., almost the range of a 64-bit signed integer when expressed as nanoseconds from the epoch, but with a few nanoseconds removed at either end to allow for sentinel values).

| Minimum timestamp      | Maximum timestamp     |
| -----------------      | -----------------     |
| `-9223372036854775806` | `9223372036854775806` |

## Special characters

- Line protocol supports special characters in [string elements](#string).
- Line protocol supports both literal backslashes and backslashes as an escape character.

The following contexts require [escaping](#escaping-backslashes) certain characters with a backslash (`\`):

### Escaping rules

| Escape sequence | Supported in elements |
|:----------------|:----------------------|
| `\n` is replaced with `U+000A` (newline) | string field values |
| `\r` is replaced with `U+000D` (carriage-return) | string field values |
| `\t` is replaced with `U+0009` (tab) | string field values |
| `\ ` is replaced with `U+0020` (space) | all except string field values |
| `\,` is replaced with `,` | all except string field values |
| `\=` is replaced with `=` | all except string field values and measurements |
| `\”` is replaced with `”` | string field values |
| `\\` is replaced with `\` | string field values |

To unescape a character within a backslash escape sequence, InfluxDB removes _the last backslash_ and its following character and replaces them with the replacement character.
If the backslash is followed by a character that the line protocol element doesn't support, InfluxDB leaves the backslash and the following character in place, unchanged.

The [escaping rules](#escaping-rules) imply the following for [tag keys](/influxdb/v2.1/reference/glossary/#tag-key), [tag values](/influxdb/v2.1/reference/glossary/#tag-value), [field keys](/influxdb/v2.1/reference/glossary/#field-key), and [measurements](/influxdb/v2.1/reference/glossary/#measurement):
- they cannot end with a backslash (`\`).
- they accept double quote (`"`) and single quote (`'`) characters as part of the name, key, or value.

In _string_ [field values](/influxdb/v2.1/reference/glossary/#field-value) with two contiguous backslashes, the first backslash is interpreted as an escape character.

Given the following line protocol:

```py
# Escaped = in tag value.
# Literal backslash at start of string field value.
# Escaped backslash at end of string field value.
airSensor,sensor_id=TLM\=0201 desc="\=My data==\\"

# Measurement name with literal backslashes.
# Escaped = in tag value.
# Escaped \ and escaped " in string field value.
air\\\\\Sensor,sensor_id=TLM\=0201 desc="\\\"==My data\==\\"
```

InfluxDB writes the following points:

| _measurement     | _sensor_id | _field     | _value |
|:-----------------|------------|------------|--------|
| `airSensor`      | `TLM=0201` | `desc`     | `\=My data==\`        |
| `air\\\\\Sensor` | `TLM=0201` | `desc`     | `\"==My data\==\`     |

#### Examples of special characters in line protocol

```py
# Measurement name with spaces
my\ Measurement fieldKey="string value"

# Double quotes in a string field value
myMeasurement fieldKey="\"string\" within a string"

# Tag keys and values with spaces
myMeasurement,tag\ Key1=tag\ Value1,tag\ Key2=tag\ Value2 fieldKey=100

# Measurement name and tag key with quotes
joe'smeasurement,pat'sTag=tag1 fieldKey=100

# Emojis
myMeasurement,tagKey=🍭 fieldKey="Launch 🚀" 1556813561098000000
```

## Comments

If a line contains `#` as the first non-whitespace character, line protocol interprets it as a comment
and ignores all subsequent characters until the next newline `\n`.

```py
# This is a comment
myMeasurement fieldKey="string value" 1556813561098000000
```

## Naming restrictions

InfluxDB reserves the underscore (`_`) namespace and certain words for system use.
- Measurement names, tag keys, and field keys cannot begin with an underscore (`_`).
- Tag keys and tag values cannot end with a backslash (`\`).
- Tag keys and field keys cannot be named `time`.
- Tag keys cannot be named `field`.

To make your schema easier to query, [avoid using Flux keywords and special characters](/influxdb/v2.1/write-data/best-practices/schema-design/#keep-keys-simple) in keys.

## Duplicate points

A point is uniquely identified by the measurement name, tag set, and timestamp.
If you submit line protocol with the same measurement, tag set, and timestamp,
but with a different field set, the field set becomes the union of the old
field set and the new field set, where any conflicts favor the new field set.

See how InfluxDB [handles duplicate points](/influxdb/v2.1/write-data/best-practices/duplicate-points/).

## Out of range values

Fields can contain numeric values, which have the potential for falling outside supported ranges.
Integer and float values should be considered **out of range** if they can't fit within a 64-bit value of the appropriate type. Out of range values may cause [parsing errors](#parsing-errors).

For detail about supported ranges, see the minimum and maximum values for [data types](#data-types-and-format).

## Parse errors

When a line protocol decoder encounters an invalid line, tag, or field (e.g., with an [out-of-range value](#out-of-range-values)),
the decoder may choose to recover from the error by ignoring the offending value or it may fail the decoding.
One common approach to handling syntax errors is for the decoder to recover by discarding data until the next newline character and then resume parsing.

See [how to troubleshoot issues writing data](/influxdb/v2.1/write-data/troubleshoot/) to InfluxDB.
