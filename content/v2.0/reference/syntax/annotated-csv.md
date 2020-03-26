---
title: Annotated CSV syntax
list_title: Annotated CSV
description: >
  InfluxDB and Flux return query results in Annotated CSV format.
  You can also read annotated CSV directly from Flux with the `csv.from()` function
  or write data to InfluxDB using annotated CSV and the `influx write` command.
weight: 103
menu:
  v2_0_ref:
    parent: Syntax
    name: Annotated CSV
v2.0/tags: [csv, syntax]
aliases:
  - /v2.0/reference/annotated-csv/
---

InfluxDB and Flux return query results in Annotated CSV format.
You can also read annotated CSV directly from Flux with the [`csv.from()` function](/v2.0/reference/flux/stdlib/csv/from/)
or write data to InfluxDB using annotated CSV and the `influx write` command.

CSV tables must be encoded in UTF-8 and Unicode Normal Form C as defined in [UAX15](http://www.unicode.org/reports/tr15/).
Line endings must be CRLF (Carriage Return Line Feed) as defined by the `text/csv`
MIME type in [RFC 4180](https://tools.ietf.org/html/rfc4180).

## Examples

In this topic, you'll find examples of valid CSV syntax for responses to the following query:

```js
from(bucket:"mydb/autogen")
    |> range(start:2018-05-08T20:50:00Z, stop:2018-05-08T20:51:00Z)
    |> group(columns:["_start","_stop", "region", "host"])
    |> yield(name:"my-result")
```

## CSV response format

Flux supports encodings listed below.

### Tables

A table may have the following rows and columns.

#### Rows

- **Annotation rows**: describe column properties.

- **Header row**: defines column labels (one header row per table).

- **Record row**: describes data in the table (one record per row).

##### Example

Encoding of a table with and without a header row.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Header row](#)
[Without header row](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```sh
result,table,_start,_stop,_time,region,host,_value
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```sh
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Columns

In addition to the data columns, a table may include the following columns:

- **Annotation column**: Only used in annotation rows. Always the first column.
  Displays the name of an annotation. Value can be empty or a supported [annotation](#annotations).
  You'll notice a space for this column for the entire length of the table,
  so rows appear to start with `,`.

- **Result column**: Contains the name of the result specified by the query.

- **Table column**: Contains a unique ID for each table in a result.

### Multiple tables and results

If a file or data stream contains multiple tables or results, the following requirements must be met:

- A table column indicates which table a row belongs to.
- All rows in a table are contiguous.
- An empty row delimits a new table boundary in the following cases:
    - Between tables in the same result that do not share a common table schema.
    - Between concatenated CSV files.
- Each new table boundary starts with new annotation and header rows.

##### Example

Encoding of two tables in the same result with the same schema (header row) and different schema.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Same schema](#)
[Different schema](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```sh
result,table,_start,_stop,_time,region,host,_value
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62

```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```sh
,result,table,_start,_stop,_time,region,host,_value
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62

,result,table,_start,_stop,_time,location,device,min,max
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,USA,5825,62.73,68.42
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,USA,2175,12.83,56.12
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,USA,6913,51.62,54.25
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Dialect options

Flux supports the following dialect options for `text/csv` format.

| Option            | Description                                                       | Default |
| :--------         | :---------                                                        |:-------:|
| **header**        | If true, the header row is included.                              | `true`  |
| **delimiter**     | Character used to delimit columns.                                | `,`     |
| **quoteChar**     | Character used to quote values containing the delimiter.          | `"`     |
| **annotations**   | List of annotations to encode (datatype, group, or default).      | `empty` |
| **commentPrefix** | String prefix to identify a comment. Always added to annotations. | `#`     |

## Annotations

Annotation rows describe column properties, and start with `#` (or commentPrefix value).
The first column in an annotation row always contains the annotation name.
Subsequent columns contain annotation values as shown in the table below.

| Annotation name | Values                                                                   | Description                                           |
|:--------        |:---------                                                                | :-------                                              |
| **datatype**    | a [valid data type](#valid-data-types)                                   | Describes the type of data.                           |
| **group**       | boolean flag `true` or `false`                                           | Indicates the column is part of the group key.        |
| **default**     | a [valid data type](#valid-data-types)                                   | Value to use for rows with an empty string value.     |
| **linepart**    | a [valid line protocol element](#line-protocol-and-linepart-annotations) | Indicates how to parse the column into line protocol. |

{{% note %}}
To encode a table with its group key, the `datatype`, `group`, and `default` annotations must be included.
If a table has no rows, the `default` annotation provides the group key values.
{{% /note %}}

### Annotated CSV in a Flux query
Example encoding of datatype, group, and default annotations for using annotated CSV with Flux:

```js
import "csv"

csvData = "#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,false,false,false,false,false,false
#default,,,,,,,,
,result,table,_start,_stop,_time,region,host,_value
,,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
,,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62
"

csv.from(csv: csvData)
```

### Annotated CSV with linepart annotations
The `linepart` annotation tells the [`influx write` command](/v2.0/reference/cli/influx/write/)
how to parse the annotated CSV into line protocol when writing to InfluxDB.

```
#linepart measurement,tag,tag,field,field,ignored,time
m,cpu,host,time_steal,usage_user,nothing,time
cpu,cpu1,host1,0,2.7,a,1482669077000000000
cpu,cpu1,host2,0,2.2,b,1482669087000000000
```

#### Line protocol and linepart annotations
| Linepart key         | Description                                                           |
|:------------         |:-----------                                                           |
| `measurement`        | column value parsed as the measurement                                |
| `field` (default)    | column header parsed as field key, column value parsed as field value |
| `tag`                | column header parsed as tag key, column value parsed as tag value     |
| `time`               | column value parsed as timestamp                                      |
| `ignore` or`ignored` | column is not included in line protocol                               |

##### Example linepart annotations
```
#linepart measurement,tag,tag,field,field,ignored,time
m,cpu,host,time_steal,usage_user,nothing,time
cpu,cpu1,host1,0,2.7,a,1482669077000000000
cpu,cpu1,host2,0,2.2,b,1482669087000000000
```

Resulting line protocol:

```
cpu,cpu=cpu1,host=host1 time_steal=0,usage_user=2.7 1482669077000000000
cpu,cpu=cpu1,host=host1 time_steal=0,usage_user=2.2 1482669087000000000
```

##### Example linepart, datatype, and default annotations
```
#datatype ,,string,double,boolean,long,unsignedLong,duration,
#linepart measurement,tag,,,,,,,time
#default test,annotatedDatatypes,,,,,,
m,name,s,d,b,l,ul,dur,time
,,str1,1.0,true,1,1,1ms,1
,,str2,2.0,false,2,2,2us,2020-01-11T10:10:10Z
```

Resulting line protocol:

```
test,name=annotatedDatatypes s="str1",d=1,b=true,l=1i,ul=1u,dur=1000000i 1
test,name=annotatedDatatypes s="str2",d=2,b=false,l=2i,ul=2u,dur=2000i 1578737410000000000
```

## Valid data types

| Datatype     | Flux type  | Description                                                                                               |
| :--------    | :--------- | :----------                                                                                               |
| boolean      | bool       | a truth value, one of "true" or "false"                                                                   |
| unsignedLong | uint       | an unsigned 64-bit integer                                                                                |
| long         | int        | a signed 64-bit integer                                                                                   |
| double       | float      | an IEEE-754 64-bit floating-point number                                                                  |
| string       | string     | a UTF-8 encoded string                                                                                    |
| base64Binary | bytes      | a base64 encoded sequence of bytes as defined in RFC 4648                                                 |
| dateTime     | time       | an instant in time, may be followed with a colon : and a description of the format (RFC3339, RFC3339Nano) |
| duration     | duration   | a length of time represented as an unsigned 64-bit integer number of nanoseconds                          |

## Errors

If an error occurs during execution, a table returns with:

- An error column that contains an error message.
- A reference column with a unique reference code to identify more information about the error.
- A second row with error properties.

If an error occurs:

- Before results materialize, the HTTP status code indicates an error. Error details are encoded in the csv table.
- After partial results are sent to the client, the error is encoded as the next table and remaining results are discarded. In this case, the HTTP status code remains 200 OK.

##### Example

Encoding for an error with the datatype annotation:

```
#datatype,string,long
,error,reference
,Failed to parse query,897
```

Encoding for an error that occurs after a valid table has been encoded:

```
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
,result,table,_start,_stop,_time,region,host,_value
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62
```

```
#datatype,string,long
,error,reference,query terminated: reached maximum allowed memory limits,576
```
