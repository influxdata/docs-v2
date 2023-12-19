---
title: Write line protocol data to InfluxDB Cloud Dedicated
description: >
  Use Telegraf and API clients to write line protocol data
  to InfluxDB Cloud Dedicated.
menu:
  influxdb_cloud_dedicated:
    name: Write line protocol
    parent: Write data
weight: 101
related:
  - /influxdb/cloud-dedicated/reference/syntax/line-protocol/
  - /influxdb/cloud-dedicated/get-started/write/
---

Learn the fundamentals of constructing and writing line protocol data.
Use tools like the `influxctl` CLI and InfluxDB client libraries to
build line protocol and then write it to an InfluxDB database.

You can use these tools to build line protocol from scratch or transform
your data to line protocol.
However, if you already have CSV data, you might want to use tools that [consume CSV
and write it to InfluxDB as line protocol](/influxdb/cloud-dedicated/write-data/csv/).

<!-- TOC -->

- [Line protocol](#line-protocol)
  - [Line protocol elements](#line-protocol-elements)
    - [Line protocol element parsing](#line-protocol-element-parsing)
- [Write line protocol to InfluxDB](#write-line-protocol-to-influxdb)

<!-- /TOC -->

## Line protocol

All data written to InfluxDB is written using [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/), a text-based
format that lets you provide the necessary information to write a data point to InfluxDB.

### Line protocol elements

In InfluxDB, a point contains a measurement name, one or more fields, a timestamp, and optional tags that provide metadata about the observation.

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#string) (quoted),
  [floats](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#float),
  [integers](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#integer),
  [unsigned integers](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#uinteger),
  or [booleans](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#unix-timestamp)
  associated with the data. InfluxDB supports up to nanosecond precision.
  _If the precision of the timestamp is not in nanoseconds, you must specify the
  precision when writing the data to InfluxDB._

#### Line protocol element parsing

- **measurement**: Everything before the _first unescaped comma before the first whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`).
  Line protocol is whitespace sensitive.

---

{{< influxdb/line-protocol >}}

---

_For schema design recommendations, see [InfluxDB schema design](/influxdb/cloud-dedicated/write-data/best-practices/schema-design/)._

## Write line protocol to InfluxDB

{{< children >}}
