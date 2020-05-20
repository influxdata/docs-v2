---
title: Extended annotated CSV
description: >
  Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write CSV data
  to InfluxDB. Include annotations with the CSV data determine how the data translates
  into [line protocol](/v2.0/reference/syntax/line-protocol/).
menu:
  v2_0_ref:
    name: Extended annotated CSV
    parent: Annotated CSV
weight: 201
v2.0/tags: [csv, syntax, write]
related:
  - /v2.0/write-data/csv/
  - /v2.0/reference/cli/influx/write/
  - /v2.0/reference/syntax/line-protocol/
  - /v2.0/reference/syntax/annotated-csv/
---

**Extended annotated CSV** provides additional annotations and options that specify
how CSV data should be converted to [line protocol](/v2.0/reference/syntax/line-protocol/)
and written to InfluxDB.
Extended annotated CSV supports all [Annotated CSV](/v2.0/reference/syntax/annotated-csv/)
annotations.

{{% warn %}}
The Flux [`csv.from` function](/v2.0/reference/flux/stdlib/csv/from/) only supports
**Annotated CSV**, not **Extended annotated CSV**.
{{% /warn %}}

To write data to InfluxDB, line protocol must include the following:

- [measurement](/v2.0/reference/syntax/line-protocol/#measurement)
- [field set](/v2.0/reference/syntax/line-protocol/#field-set)
- [timestamp](/v2.0/reference/syntax/line-protocol/#timestamp) _(Optional but recommended)_
- [tag set](/v2.0/reference/syntax/line-protocol/#tag-set) _(Optional)_

Extended annotated CSV annotations identify which element of line protocol each
column represents and how the data should be converted.

## CSV Annotations
Extended annotated CSV extends and adds the following annotations:

- [datatype](#datatype)
- [constant](#constant)
- [timezone](#timezone)

### datatype
Use the `#datatype` annotation to specify which [line protocol element](/v2.0/reference/syntax/line-protocol/#elements-of-line-protocol)
each column represents.
To explicitly define a column as a **field** of a specific data type, use the field
type in the annotation.

| Data type                     | Resulting line protocol                 |
|:----------                    |:-----------------------                 |
| [measurement](#measurement)   | Column is the **measurement**           |
| [tag](#tag)                   | Column is a **tag**                     |
| [dateTime](#datetime)         | Column is the **timestamp**             |
| [field](#field)               | Column is a **field**                   |
| [ignored](#ignored)           | Column is ignored                       |
| [string](#string)             | Column is a **string field**            |
| [double](#double)             | Column is a **float field**             |
| [long](#long)                 | Column is an **integer field**          |
| [unsignedLong](#unsignedlong) | Column is an **unsigned integer field** |
| [boolean](#boolean)           | Column is a **boolean field**           |

#### measurement
Indicates the column is the **measurement**.

#### tag
Indicates the column is a **tag**.
The **column label** is the **tag key**.
The **column value** is the **tag value**.

#### dateTime
Indicates the column is the **timestamp**.
`time` is as an alias for `dateTime`.
By default, all timestamps are UTC.
Use the [`#timezone` annotation](#timezone) to adjust timestamps to a specific timezone.

{{% note %}}
There can only be **one** `dateTime` column.
{{% /note %}}

The `influx write` command converts timestamps to [Unix timestamps](/v2.0/reference/glossary/#unix-timestamp).
Append the timestamp format to the `dateTime` datatype with (`:`).

```csv
#datatype dateTime:RFC3339
#datatype dateTime:RFC3339Nano
#datatype dateTime:number
#datatype dateTime:2006-01-02
```

##### Supported timestamp formats

| Timestamp format | Description       | Example                          |
|:---------------- |:-----------       |:-------                          |
| **RFC3339**      | RFC3339 timestamp | `2020-01-01T00:00:00Z`           |
| **RFC3339Nano**  | RFC3339 timestamp | `2020-01-01T00:00:00.000000000Z` |
| **number**       | Unix timestamp    | `1577836800000000000`            |
| **2006-01-02**   | YYYY-MM-DD date   | `2020-01-01`                     |

{{% note %}}
If using the `number` timestamp format and timestamps are **not nanosecond Unix timestamps**,
use the [`--precision` flag](/v2.0/reference/cli/influx/write/#flags) with the
`influx write` command to specify the timestamp precision.
{{% /note %}}

#### field
Indicates the column is a **field** and auto-detects the field type.
The **column label** is the **field key**.
The **column value** is the **field value**.

#### ignored
The column is ignored and not written to InfluxDB.

#### Field types
The column is a **field** of a specified type.
The **column label** is the **field key**.
The **column value** is the **field value**.

##### string
Column is a **[string](/v2.0/reference/glossary/#string) field**.

##### double
Column is a **[float](/v2.0/reference/glossary/#float) field**.
By default, InfluxDB expects float values that use a period (`.`) to separate the
fraction from the whole number.
If column values include or use other separators, such as commas (`,`) to visually
separate large numbers into groups, specify the following  **float separators**:

- **fraction separator**: Separates the fraction from the whole number
- **ignored separator**: Visually separates the whole number into groups but should
  be ignored when parsing the float value.

Use the following syntax to specify **float separators**:

```sh
# Syntax
<fraction-separator><ignored-separator>

# Example
.,

# With the float separators above
# 1,200,000.15 => 1200000.15
```

Append **float separators** to the `double` datatype annotation with a colon (`:`).
For example:

```
#datatype "fieldName|double:.,"
```

{{% note %}}
If your **float separators** include a comma (`,`), wrap the column annotation in double
quotes (`""`) to prevent the comma from being parsed as column separator or delimitter.
You can also [define a custom column separator](#define-custom-column-separator).
{{% /note %}}

##### long
Column is an **[integer](/v2.0/reference/glossary/#integer) field**.

##### unsignedLong
Column is an **[unsigned integer](/v2.0/reference/glossary/#unsigned-integer) field**.

##### boolean
Column is a **[boolean](/v2.0/reference/glossary/#boolean) field**.
If column values are not [supported boolean values](/v2.0/reference/syntax/line-protocol/#boolean),
specify the **boolean format** with the following syntax:

```sh
# Syntax
<true-values>:<false-values>

# Example
y,Y:n,N

# With the boolean format above
# y => true, Y => true, n => false, N => false
```

Append the **boolean format** to the `boolean` datatype annotation with a colon (`:`).
For example:

```
#datatype "fieldName|boolean:y,Y:n,N"
```

{{% note %}}
If your **boolean format** contains commas (`,`), wrap the column annotation in double
quotes (`""`) to prevent the commas from being parsed as column separators or delimiters.
You can also [define a custom column separator](#define-custom-column-separator).
{{% /note %}}

### constant
Use the `#constant` annotation to define a constant column label and value for each row.
The `#constant` annotation provides a way to supply
[line protocol elements](/v2.0/reference/syntax/line-protocol/#elements-of-line-protocol)
that don't exist in the CSV data.

Use the following syntax to define constants:

```
#constant <datatype>,<column-label>,<column-value>
```

To provide multiple constants, include each `#constant` annotations on a separate line.

```
#constant measurement,m
#constant tag,dataSource,csv
```

{{% note %}}
For constants with `measurement` and `dateTime` datatypes, the second value in
the constant definition is the **column-value**.
{{% /note %}}

### timezone
Use the `#timezone` annotation to update timestamps to a specific timezone.
By default, timestamps are parsed as UTC.
Use the `±HHmm` format to specify the timezone offset relative to UTC.

##### Timezone examples
| Timezone                        | Offset  |
|:--------                        | ------: |
| US Mountain Daylight Time       | `-0600` |
| Central European Summer Time    | `+0200` |
| Australia Eastern Standard Time | `+1000` |
| Apia Daylight Time              | `+1400` |

##### Timezone annotation example
```
#timezone -0600
```

## Define custom column separator
If columns are delimited using a character other than a comma, use the `sep`
keyword to define a custom separator for your CSV file.

```
sep=;
```

## Annotation shorthand
Extended annotated CSV supports **annotation shorthand**.
Include the column label, datatype, and _(optional)_ default value in each column
header row using the following syntax:

```
<column-label>|<column-datatype>|<column-default-value>
```

##### Example annotation shorthand
```
m|measurement|general,location|tag,temp|double,pm|long,time|dateTime:RFC3339
weather,San Francisco,51.9,38,2020-01-01T00:00:00Z
weather,New York,18.2,15,2020-01-01T00:00:00Z
,Hong Kong,53.6,171,2020-01-01T00:00:00Z
```

##### The shorthand explained
- The `m` column represents the **measurement** and has a default value of `general`.
- The `location` column is a **tag** with no default value.
- The `temp` column is a **field** with **float** (`double`) values and no default value.
- The `pm` column is a **field** with **integer** (`long`) values and no default value.
- The `time` column represents the **timestamp**, uses the **RFC3339** timestamp format,
  and has no default value.

##### Resulting line protocol
```
weather,location=San\ Francisco temp=51.9,pm=38i 1577836800000000000
weather,location=New\ York temp=18.2,pm=18i 1577836800000000000
general,location=Hong\ Kong temp=53.6,pm=171i 1577836800000000000
```
