---
title: Write CSV data to InfluxDB
description: >
  Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write CSV data
  to InfluxDB. Include annotations with the CSV data determine how the data translates
  into [line protocol](/v2.0/reference/syntax/line-protocol/).
menu:
  v2_0:
    name: Write CSV data
    parent: Write data
weight: 104
related:
  - /v2.0/reference/syntax/line-protocol/
  - /v2.0/reference/syntax/annotated-csv/
  - /v2.0/reference/cli/influx/write/
---

Use the [`influx write` command](/v2.0/reference/cli/influx/write/) to write CSV data
to InfluxDB. Include annotations with the CSV data to specify how the data translates
into [line protocol](/v2.0/reference/syntax/line-protocol/).

InfluxDB requires the following for each point written:

- measurement
- field set
- timestamp
- (optional) tag set

## CSV Annotations

{{% note %}}
When writing CSV data to InfluxDB, the `influx write` command supports all annotations
supported and returned by [Flux Annotated CSV](/v2.0/reference/syntax/annotated-csv/).
Additional annotation options described in this article are specific to the
`influx write` command and **cannot** be read directly with the
[Flux `csv.from()` function](/v2.0/reference/flux/stdlib/csv/from/).
{{% /note %}}

- [datatype](#datatype)
- [constant](#constant)

### datatype
Use the `#datatype` annotation to specify which [line protocol element](/v2.0/reference/syntax/line-protocol/#elements-of-line-protocol)
each column represents.
To explicitly define a column as a **field** of a specific data type, use the field
type in the annotation.

| Data type                    | Resulting line protocol                 |
|:----------                   |:-----------------------                 |
| [measurement](#measurement)  | Column is the **measurement**           |
| [tag](#tag)                  | Column is a **tag**                     |
| [dateTime](#datetime)        | Column is the **timestamp**             |
| [field](#field)              | Column is a **field**                   |
| [ignored](#ignored)          | Column is ignored                       |
| [string](#field-types)       | Column is a **string field**            |
| [double](#field-types)       | Column is a **float field**             |
| [long](#field-types)         | Column is an **integer field**          |
| [unsignedLong](#field-types) | Column is an **unsigned integer field** |
| [boolean](#field-types)      | Column is a **boolean field**           |

#### measurement
Indicates the column is the **measurement** for the row.

#### tag
Indicates the column is a **tag**.
The **column label** is the **tag key**.
The **column value** is the **tag value**.

#### dateTime
Indicates the column is the **timestamp** for the row.
You can also use `time` as an alias for `dateTime`.
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

- `string`: column is a **[string](/v2.0/reference/glossary/#string) field**.
- `double`: column is a **[float](/v2.0/reference/glossary/#float) field**.
- `long`: column is an **[integer](/v2.0/reference/glossary/#integer) field**.
- `unsignedLong`: column is an **[unsigned integer](/v2.0/reference/glossary/#unsigned-integer) field**.
- `boolean`: column is a **[boolean](/v2.0/reference/glossary/#boolean) field**.

### constant
Use the `#constant` annotation to define a constant column label and value for each row.
The `#constant` annotation provides a way to supply elements required to write
to InfluxDB if they don't exist in the CSV data.

Use the following syntax to define constants:

```
#constant <datatype>,<column-label>,<column-value>
```

{{% note %}}
For constants with `measurement` and `dateTime` datatypes, the second value in
the constant definition is the **column-value**.
{{% /note %}}

##### Example constants
```
#constant measurement,m
#constant tag,dataSource,csv
```

### timezone
Use the `#timezone` annotation to update timestamps to a specific timezone.
By default, timestamps are parsed as UTC.
Use the `±HHMM` format to the offset relative to UTC.

##### Timezone examples
| Timezone                        | Offset  |
|:--------                        | ------: |
| US Mountain Daylight Time       | `-0600` |
| Central European Summer Time    | `+0200` |
| Australia Eastern Standard Time | `+1000` |

##### Timezone annotation example
```
#timezone -0600
```


## Define custom column separator
```
sep=;
```

---

  - Annotation shorthand
    - include column label, datatype, and default value in one line.
  - Set constants
  - Custom column separator

- Write command
  - inject annotation headers
  - skip headers

- Example commands
  - Write the raw results of a Flux query
  - Simple annotated CSV with #datatype annotation
  - Annotated CSV with #datatype and CSV annotations
    - Include defaults with the #datatype annotation
