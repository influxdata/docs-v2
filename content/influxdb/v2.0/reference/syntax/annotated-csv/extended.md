---
title: Extended annotated CSV
description: >
  Extended annotated CSV provides additional annotations and options that specify
  how CSV data should be converted to [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/)
  and written to InfluxDB.
menu:
  influxdb_2_0_ref:
    name: Extended annotated CSV
    parent: Annotated CSV
weight: 201
influxdb/v2.0/tags: [csv, syntax, write]
related:
  - /influxdb/v2.0/write-data/developer-tools/csv/
  - /influxdb/v2.0/reference/cli/influx/write/
  - /influxdb/v2.0/reference/syntax/line-protocol/
  - /influxdb/v2.0/reference/syntax/annotated-csv/
---

**Extended annotated CSV** provides additional annotations and options that specify
how CSV data should be converted to [line protocol](/influxdb/v2.0/reference/syntax/line-protocol/)
and written to InfluxDB.
InfluxDB uses the [`csv2lp` library](https://github.com/influxdata/influxdb/tree/master/pkg/csv2lp)
to convert CSV into line protocol.
Extended annotated CSV supports all [Annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/)
annotations.

{{% warn %}}
The Flux [`csv.from` function](/influxdb/v2.0/reference/flux/stdlib/csv/from/) only supports
[annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/), not extended annotated CSV.
{{% /warn %}}

To write data to InfluxDB, line protocol must include the following:

- [measurement](/influxdb/v2.0/reference/syntax/line-protocol/#measurement)
- [field set](/influxdb/v2.0/reference/syntax/line-protocol/#field-set)
- [timestamp](/influxdb/v2.0/reference/syntax/line-protocol/#timestamp) _(Optional but recommended)_
- [tag set](/influxdb/v2.0/reference/syntax/line-protocol/#tag-set) _(Optional)_

Extended CSV annotations identify the element of line protocol a column represents.

## CSV Annotations
Extended annotated CSV extends and adds the following annotations:

- [datatype](#datatype)
- [constant](#constant)
- [timezone](#timezone)
- [concat](#concat)

### datatype
Use the `#datatype` annotation to specify the [line protocol element](/influxdb/v2.0/reference/syntax/line-protocol/#elements-of-line-protocol)
a column represents.
To explicitly define a column as a **field** of a specific data type, use the field
type in the annotation (for example: `string`, `double`, `long`, etc.).

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
`time` is an alias for `dateTime`.
If the [timestamp format](#supported-timestamp-formats) includes a time zone,
the parsed timestamp includes the time zone offset.
By default, all timestamps are UTC.
You can also use the [`#timezone` annotation](#timezone) to adjust timestamps to
a specific time zone.

{{% note %}}
There can only be **one** `dateTime` column.
{{% /note %}}

The `influx write` command converts timestamps to [Unix timestamps](/influxdb/v2.0/reference/glossary/#unix-timestamp).
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

{{% note %}}
If using the `number` timestamp format and timestamps are **not in nanoseconds**,
use the [`influx write --precision` flag](/influxdb/v2.0/reference/cli/influx/write/#flags)
to specify the [timestamp precision](/influxdb/v2.0/reference/glossary/#precision).
{{% /note %}}

##### Custom timestamp formats
To specify a custom timestamp format, use timestamp formats as described in the
[Go time package](https://golang.org/pkg/time).
For example: `2020-01-02`.

#### field
Indicates the column is a **field**.
The **column label** is the **field key**.
The **column value** is the **field value**.

{{% note %}}
With the `field` datatype, field values are copies **as-is** to line protocol.
For information about line protocol values and how they are written to InfluxDB,
see [Line protocol data types and formats](/influxdb/v2.0/reference/syntax/line-protocol/#data-types-and-format).
We generally recommend specifying the [field type](#field-types) in annotations.
{{% /note %}}

#### ignored
The column is ignored and not written to InfluxDB.

#### Field types
The column is a **field** of a specified type.
The **column label** is the **field key**.
The **column value** is the **field value**.

- [string](#string)
- [double](#double)
- [long](#long)
- [unsignedLong](#unsignedlong)
- [boolean](#boolean)

##### string
Column is a **[string](/influxdb/v2.0/reference/glossary/#string) field**.

##### double
Column is a **[float](/influxdb/v2.0/reference/glossary/#float) field**.
By default, InfluxDB expects float values that use a period (`.`) to separate the
fraction from the whole number.
If column values include or use other separators, such as commas (`,`) to visually
separate large numbers into groups, specify the following  **float separators**:

- **fraction separator**: Separates the fraction from the whole number.
- **ignored separator**: Visually separates the whole number into groups but ignores
  the separator when parsing the float value.

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
#datatype "double:.,"
```

{{% note %}}
If your **float separators** include a comma (`,`), wrap the column annotation in double
quotes (`""`) to prevent the comma from being parsed as a column separator or delimiter.
You can also [define a custom column separator](#define-custom-column-separator).
{{% /note %}}

##### long
Column is an **[integer](/influxdb/v2.0/reference/glossary/#integer) field**.
If column values contain separators such as periods (`.`) or commas (`,`), specify
the following **integer separators**:

- **fraction separator**: Separates the fraction from the whole number.
  _**Integer values are truncated at the fraction separator when converted to line protocol.**_
- **ignored separator**: Visually separates the whole number into groups but ignores
  the separator when parsing the integer value.

Use the following syntax to specify **integer separators**:

```sh
# Syntax
<fraction-separator><ignored-separator>

# Example
.,

# With the integer separators above
# 1,200,000.00 => 1200000i
```

Append **integer separators** to the `long` datatype annotation with a colon (`:`).
For example:

```
#datatype "long:.,"
```

{{% note %}}
If your **integer separators** include a comma (`,`), wrap the column annotation in double
quotes (`""`) to prevent the comma from being parsed as a column separator or delimiter.
You can also [define a custom column separator](#define-custom-column-separator).
{{% /note %}}

##### unsignedLong
Column is an **[unsigned integer (uinteger)](/influxdb/v2.0/reference/glossary/#unsigned-integer) field**.
If column values contain separators such as periods (`.`) or commas (`,`), specify
the following **uinteger separators**:

- **fraction separator**: Separates the fraction from the whole number.
  _**Uinteger values are truncated at the fraction separator when converted to line protocol.**_
- **ignored separator**: Visually separates the whole number into groups but ignores
  the separator when parsing the uinteger value.

Use the following syntax to specify **uinteger separators**:

```sh
# Syntax
<fraction-separator><ignored-separator>

# Example
.,

# With the uinteger separators above
# 1,200,000.00 => 1200000u
```

Append **uinteger separators** to the `long` datatype annotation with a colon (`:`).
For example:

```
#datatype "usignedLong:.,"
```

{{% note %}}
If your **uinteger separators** include a comma (`,`), wrap the column annotation in double
quotes (`""`) to prevent the comma from being parsed as a column separator or delimiter.
You can also [define a custom column separator](#define-custom-column-separator).
{{% /note %}}

##### boolean
Column is a **[boolean](/influxdb/v2.0/reference/glossary/#boolean) field**.
If column values are not [supported boolean values](/influxdb/v2.0/reference/syntax/line-protocol/#boolean),
specify the **boolean format** with the following syntax:

```sh
# Syntax
<true-values>:<false-values>

# Example
y,Y,1:n,N,0

# With the boolean format above
# y => true, Y => true, 1 => true
# n => false, N => false, 0 => false
```

Append the **boolean format** to the `boolean` datatype annotation with a colon (`:`).
For example:

```
#datatype "boolean:y,Y:n,N"
```

{{% note %}}
If your **boolean format** contains commas (`,`), wrap the column annotation in double
quotes (`""`) to prevent the comma from being parsed as a column separator or delimiter.
You can also [define a custom column separator](#define-custom-column-separator).
{{% /note %}}

### constant
Use the `#constant` annotation to define a constant column label and value for each row.
The `#constant` annotation provides a way to supply
[line protocol elements](/influxdb/v2.0/reference/syntax/line-protocol/#elements-of-line-protocol)
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

### strict mode
Use the `:strict` keyword to indicate a loss of precision when parsing `long` or `unsignedLong` data types.
Turn on strict mode by using a column data type that ends with `strict`, such as `long:strict`.
When parsing `long` or `unsignedLong` value from a string value with fraction digits, the whole CSV row fails when in a strict mode.
A warning is printed when not in a strict mode, saying `line x: column y: '1.2' truncated to '1' to fit into long data type`.
For more information on strict parsing, see the [package documentation](https://github.com/influxdata/influxdb/tree/master/pkg/csv2lp).

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

### concat

The `#concat` annotation adds a new column that is concatenated from existing columns according to bash-like string interpolation literal with variables referencing existing column labels.

For example:

```
#concat,string,fullName,${firstName} ${lastName}
```

This is especially useful when constructing a timestamp from multiple columns.
For example, the following annotation will combine the given CSV columns into a timestamp:

```
#concat,dateTime:2006-01-02,${Year}-${Month}-${Day}

Year,Month,Day,Hour,Minute,Second,Tag,Value
2020,05,22,00,00,00,test,0
2020,05,22,00,05,00,test,1
2020,05,22,00,10,00,test,2
```

## Define custom column separator
If columns are delimited using a character other than a comma, use the `sep`
keyword to define a custom separator **in the first line of your CSV file**.

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
m|measurement,location|tag|Hong Kong,temp|double,pm|long|0,time|dateTime:RFC3339
weather,San Francisco,51.9,38,2020-01-01T00:00:00Z
weather,New York,18.2,,2020-01-01T00:00:00Z
weather,,53.6,171,2020-01-01T00:00:00Z
```

##### The shorthand explained
- The `m` column represents the **measurement** and has no default value.
- The `location` column is a **tag** with the default value, `Hong Kong`.
- The `temp` column is a **field** with **float** (`double`) values and no default value.
- The `pm` column is a **field** with **integer** (`long`) values and a default of `0`.
- The `time` column represents the **timestamp**, uses the **RFC3339** timestamp format,
  and has no default value.

##### Resulting line protocol
```
weather,location=San\ Francisco temp=51.9,pm=38i 1577836800000000000
weather,location=New\ York temp=18.2,pm=0i 1577836800000000000
weather,location=Hong\ Kong temp=53.6,pm=171i 1577836800000000000
```
