---
title: Annotated CSV syntax
description: >
  Annotated CSV format is used to encode HTTP responses and results returned to the Flux `csv.from()` function.
weight: 6
menu:
  v2_0_ref:
    name: Annotated CSV
---

Annotated CSV (comma-separated values) format is used to encode HTTP responses and results returned to the Flux [`csv.from()` function](https://v2.docs.influxdata.com/v2.0/reference/flux/functions/csv/from/).

CSV tables must be encoded in UTF-8 and Unicode Normal Form C as defined in [UAX15](http://www.unicode.org/reports/tr15/). Line endings must be CRLF (Carriage Return Line Feed) as defined by the `text/csv` MIME type in [RFC 4180](https://tools.ietf.org/html/rfc4180).

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
```js
result,table,_start,_stop,_time,region,host,_value
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Columns
In addition to the data columns, a table may include the following columns:

- **Annotation column**: Only used in annotation rows. Always the first column. Displays the name of an annotation. Value can be empty or a supported [annotation](#annotations). You'll notice a space for this column for the entire length of the table, so rows appear to start with `,`.

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
```js
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
```js
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

### Dialect options
Flux supports the following dialect options for `text/csv` format.

| Option    | Description| Default |
| :-------- | :--------- | :-------|
| **header**    | If true, the header row is included.| `true`|   
| **delimiter** | Character used to delimit columns. | `,`|
| **quoteChar** | Character used to quote values containing the delimiter. |`"`|   
| **annotations** | List of annotations to encode (datatype, group, or default). |`empty`|
| **commentPrefix** | String prefix to identify a comment. Always added to annotations. |`#`|

### Annotations
Annotation rows are optional, describe column properties, and start with `#` (or commentPrefix value). The first column in an annotation row always contains the annotation name. Subsequent columns contain annotation values as shown in the table below.

|Annotation name | Values| Description |
| :-------- | :--------- | :-------|
| **datatype**    | a [valid data type](#Valid-data-types) | Describes the type of data. |   
| **group** | boolean flag `true` or `false` | Indicates the column is part of the group key.|
| **default** | a [valid data type](#Valid-data-types) |Value to use for rows with an empty string value.|   

##### Example
Encoding of datatype and group annotations for two tables.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Datatype annotation](#)
[Group annotation](#)
[Datatype and group annotations](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
,result,table,_start,_stop,_time,region,host,_value
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
#group,false,false,true,true,false,true,false,false
,result,table,_start,_stop,_time,region,host,_value
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62
```
{{% /code-tab-content %}}


{{% code-tab-content %}}
```js
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
,result,table,_start,_stop,_time,region,host,_value
#group,false,false,true,true,false,true,false,false
,result,table,_start,_stop,_time,region,host,_value
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,my-result,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}


**Notes:**
{{% note %}}
To encode a table with its group key, the `datatype`, `group`, and `default` annotations must be included.

If a table has no rows, the `default` annotation provides the group key values.
{{% /note %}}

### Valid data types

| Datatype     | Flux type     | Description                                                                        |
| :--------    | :---------    | :-----------------------------------------------------------------------------|
| boolean      | bool          | a truth value, one of "true" or "false"                                            |
| unsignedLong | uint          | an unsigned 64-bit integer                                                         |
| long         | int           | a signed 64-bit integer                                                            |
| double       | float         | an IEEE-754 64-bit floating-point number                                           |
| string       | string        | a UTF-8 encoded string                                                             |
| base64Binary | bytes         | a base64 encoded sequence of bytes as defined in RFC 4648                          |
| dateTime     | time          | an instant in time, may be followed with a colon : and a description of the format |
| duration     | duration      | a length of time represented as an unsigned 64-bit integer number of nanoseconds   |

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
  ```js
#datatype,string,long
,error,reference
,Failed to parse query,897
  ```

Encoding for an error that occurs after a valid table has been encoded:
 ```js
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double,result,table,_start,_stop,_time,region,host,_value
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,my-result,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62
 ```
```js
#datatype,string,long
,error,reference,query terminated: reached maximum allowed memory limits,576
```
