
The InfluxDB `/api/v2/query` API returns query results in annotated CSV format.
You can also write data to InfluxDB using annotated CSV and the `influx write` command,
or [upload a CSV file](/influxdb/version/write-data/no-code/load-data/)
in the InfluxDB UI.

CSV tables must be encoded in UTF-8 and Unicode Normal Form C as defined in [UAX15](http://www.unicode.org/reports/tr15/).
InfluxDB removes carriage returns before newline characters.

## CSV response format

InfluxDB annotated CSV supports encodings listed below.

### Tables

A table may have the following rows and columns.

#### Rows

- **Annotation rows**: describe column properties.
- **Header row**: defines column labels (one header row per table).
- **Record row**: describes data in the table (one record per row).

##### Example

```csv
#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,mean,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,region
,,0,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:52:00Z,15.43,mem,m,A,east
,,1,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:52:00Z,59.25,mem,m,B,east
,,2,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:52:00Z,52.62,mem,m,C,east
```

#### Columns

In addition to the data columns, a table may include the following columns:

- **Annotation column**: Displays the name of an annotation.
  Only used in annotation rows and is always the first column.
  Value can be empty or a supported [annotation](#annotations).
  The response format uses a comma (`,`) to separate an annotation name from values in the row.
  To account for this, rows in the table start with a leading comma; you'll notice an empty column for the entire length of the table.
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

```csv
#group,false,false,true,true,false,false,true,true,true,true
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,double,string,string,string,string
#default,_result,,,,,,,,,
,result,table,_start,_stop,_time,_value,_field,_measurement,host,region
,,0,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:00:00Z,15.43,mem,m,A,east
,,1,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:00:00Z,59.25,mem,m,B,east
,,2,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:00:00Z,52.62,mem,m,C,east

#group,false,false,true,true,true,true,false,false,true,true
#datatype,string,long,string,string,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,string
#default,_result,,,,,,,,,
,result,table,_field,_measurement,_start,_stop,_time,_value,host,region
,,3,mem_level,m,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:00:00Z,ok,A,east
,,4,mem_level,m,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:00:00Z,info,B,east
,,5,mem_level,m,2022-12-31T05:41:24Z,2023-01-31T05:41:24.001Z,2023-01-01T00:00:00Z,info,C,east
```

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

| Annotation name | Values                                                                         | Description                                                                      |
|:--------        |:---------                                                                      | :-------                                                                         |
| **datatype**    | a [data type](#data-types) or [line protocol element](#line-protocol-elements) | Describes the type of data or which line protocol element the column represents. |
| **group**       | boolean flag `true` or `false`                                                 | Indicates the column is part of the group key.                                   |
| **default**     | a value of the column's data type                                              | Value to use for rows with an empty value.                                       |


Some tools might use or require a comma (`,`) to separate the annotation name from values in an annotation row.

{{% note %}}
To encode a table with its [group key](/influxdb/version/reference/glossary/#group-key),
the `datatype`, `group`, and `default` annotations must be included.
If a table has no rows, the `default` annotation provides the group key values.
{{% /note %}}

## Data types

| Datatype     | Flux type  | Description                                                                                                    |
| :--------    | :--------- | :----------                                                                                                    |
| boolean      | bool       | "true" or "false"                                                                                              |
| unsignedLong | uint       | unsigned 64-bit integer                                                                                        |
| long         | int        | signed 64-bit integer                                                                                          |
| double       | float      | IEEE-754 64-bit floating-point number                                                                          |
| string       | string     | UTF-8 encoded string                                                                                           |
| base64Binary | bytes      | base64 encoded sequence of bytes as defined in RFC 4648                                                        |
| dateTime     | time       | instant in time, may be followed with a colon : and a description of the format (number, RFC3339, RFC3339Nano) |
| duration     | duration   | length of time represented as an unsigned 64-bit integer number of nanoseconds                                 |


## Line protocol elements

The `datatype` annotation accepts [data types](#data-types) and **line protocol elements**.
Line protocol elements identify how columns are converted into line protocol when using the
[`influx write` command](/influxdb/version/reference/cli/influx/write/) to write annotated CSV to InfluxDB.

| Line protocol element | Description                                                     |
|:--------------------- |:-----------                                                     |
| `measurement`         | column value is the measurement                                 |
| `field` _(default)_   | column header is the field key, column value is the field value |
| `tag`                 | column header is the tag key, column value is the tag value     |
| `time`                | column value is the timestamp _(alias for `dateTime`)_          |
| `ignore` or`ignored`  | column is ignored and not included in line protocol             |

### Mixing data types and line protocol elements

Columns with [data types](#data-types) (other than `dateTime`) in the
`#datatype` annotation are treated as **fields** when converted to line protocol.
Columns without a specified data type default to `field` when converted to line protocol
and **column values are left unmodified** in line protocol.
_See an example [below](#example-of-mixing-data-types-line-protocol-elements) and
[line protocol data types and format](/influxdb/version/reference/syntax/line-protocol/#data-types-and-format)._

### Time columns

A column with `time` or `dateTime` `#datatype` annotations are used as the timestamp
when converted to line protocol.
If there are multiple `time` or `dateTime` columns, the last column (on the right)
is used as the timestamp in line protocol.
Other time columns are ignored and the `influx write` command outputs a warning.

Time column values should be **Unix nanosecond timestamps**, **RFC3339**, or **RFC3339Nano**.

##### Example line protocol elements in datatype annotation

```csv
#group false,false,false,false,false,false,false
#datatype measurement,tag,tag,field,field,ignored,time
#default ,,,,,,
m,cpu,host,time_steal,usage_user,nothing,time
cpu,cpu1,host1,0,2.7,a,1482669077000000000
cpu,cpu1,host2,0,2.2,b,1482669087000000000
```

Resulting line protocol:

```text
cpu,cpu=cpu1,host=host1 time_steal=0,usage_user=2.7 1482669077000000000
cpu,cpu=cpu1,host=host2 time_steal=0,usage_user=2.2 1482669087000000000
```

##### Example of mixing data types and line protocol elements

```csv
#group,false,false,false,false,false,false,false,false,false
#datatype,measurement,tag,string,double,boolean,long,unsignedLong,duration,dateTime
#default,test,annotatedDatatypes,,,,,,
,m,name,s,d,b,l,ul,dur,time
,,,str1,1.0,true,1,1,1ms,1
,,,str2,2.0,false,2,2,2us,2020-01-11T10:10:10Z
```

Resulting line protocol:

```text
test,name=annotatedDatatypes s="str1",d=1,b=true,l=1i,ul=1u,dur=1000000i 1
test,name=annotatedDatatypes s="str2",d=2,b=false,l=2i,ul=2u,dur=2000i 1578737410000000000
```

## Errors

If an error occurs during execution, a table returns with:

- An error column that contains an error message.
- A reference column with a unique reference code to identify more information about the error.
- A second row with error properties.

If an error occurs:

- Before InfluxDB responds with data, the HTTP status code indicates an error. The output table contains error details.
- After InfluxDB sends partial results to the client, the error is encoded as the next table and remaining results are discarded. In this case, the HTTP status code remains 200 OK.

##### Example

Encoding for an error with the datatype annotation:

```csv
#datatype,string,long
,error,reference
,Failed to parse query,897
```
