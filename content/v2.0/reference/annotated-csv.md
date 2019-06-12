---
title: Annotated CSV reference
description: >
  Describes the annotated CSV format required for Flux.
  
menu:
  v2_0_ref:
    name: Annotated CSV syntax
    weight: 2
---

Flux accepts HTTP responses in CSV (comma-separated values) format in UTF-8 and Unicode Normal Form C as defined in [UAX15](http://www.unicode.org/reports/tr15/). 

Line endings must be CRLF (Carriage Return Line Feed) as defined by the text/csv MIME type in [RFC 4180](https://tools.ietf.org/html/rfc4180).

### Examples
In this topic, you'll find examples of valid CSV responses to the following query:
```
from(bucket:"mydb/autogen")
    |> range(start:2018-05-08T20:50:00Z, stop:2018-05-08T20:51:00Z)
    |> group(columns:["_start","_stop", "region", "host"])
    |> mean()
    |> group(columns:["_start","_stop", "region"])
    |> yield(name:"mean")
```

### CSV response format
Return query results as encoded CSV tables.

#### Dialect options
The following dialect options are supported for CSV tables:

| Option    | Description| Default |
| :-------- | :--------- | :-------|
| header    | If true, the header row is included.| ```true```   
| delimiter | Character used to delimit columns. | ```,```
| quoteChar | Character used to quote values containing the delimiter. |```"```    
| annotations | List of annotations to encode (datatype, group, default, or null). | ```empty``` 
| commentPrefix | String prefix to identify a comment. Always added to annotations. | ```#``` 

#### Annotations
Annotation rows are optional and always start with a commentPrefix (usually #). An annotation row describes column properties. The first column describes the annotation name: datatype, group, default, or null. Subsequent columns in the row vary depending on the type of annotation:
- Datatype annotations display the `datatype` of each column in a table.
- Group annotations display yes if the column is part of the group key (tag?). Otherwise, displays no.
Note: To encode a table with its group key, you must include the datatype, group, and default annotations. <<is group key same as group annotation?>>

- When the default annotation value of a column is the same as the null annotation value of a column, the default annotation value is interpreted as null.

- Null annotation. If not specified, an empty string value is the null value for the column. 

- A non-null string value that is the same as the null annotation value for columns of type string cannot be encoded or decoded.



The following table includes valid data types:

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

- Header row: defines column label.
- Record rows: contain record data, one record per row.







The following tabs show valid annotations:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[One table](#)
[Multiple tables](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
curl http://localhost:9999/api/v2/query?org=my-org -XPOST -sS \
-H 'Authorization: Token YOURAUTHTOKEN' \
-H 'accept:application/csv' \
-H 'content-type:application/vnd.flux' \
-d 'from(bucket:“test”)
      |> range(start:-1000h)
      |> group(columns:[“_measurement”], mode:“by”)
      |> sum()'
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl http://localhost:9999/api/v2/query?org=my-org -XPOST -sS -H 'Authorization: Token TOKENSTRINGHERE' -H 'accept:application/csv' -H 'content-type:application/vnd.flux' -d 'from(bucket:“test”) |> range(start:-1000h) |> group(columns:[“_measurement”], mode:“by”) |> sum()'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}










Example response with two tables and datatype annotation:
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
,result,table,_start,_stop,_time,region,host,_value
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62

Response with two tables with datatype and group annotations:
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,true,true,false,true,false,false
,result,table,_start,_stop,_time,region,host,_value
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62

Response with two tables with different schemas that have data type and group annotations:
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,true,true,false,true,false,false
,result,table,_start,_stop,_time,region,host,_value
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62

#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,true,true,false,true,false,false
,result,table,_start,_stop,_time,location,device,min,max
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,USA,5825,62.73,68.42
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,USA,2175,12.83,56.12
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,USA,6913,51.62,54.25

## Errors

Error with the datatype annotation:
#datatype,string,long
,error,reference
,Failed to parse query,897

Error after a valid table has already been encoded
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
,result,table,_start,_stop,_time,region,host,_value
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
,mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62

#datatype,string,long
,error,reference
,query terminated: reached maximum allowed memory limits,576



#### Columns

In addition to the data columns, a table may include the following columns:

- Annotation column (optional): The first column in a table. Contains the name of an annotation. Valid values include an empty value or one of the following supported annotations:
    - datatype: type of data in the column
    - group: boolean indicates whether the column is in the table's group key
    - default: value used for rows with an empty string value
    - null: indicates missing data 
- Result column: contains the name of the result specified by the query.
- Table column: contains a unique ID for each table in a result.

### Multiple tables
If file or data stream contains multiple tables, the following requirements must be met:
 
- A table column indicates which table a row belongs to. 
- All rows in a table are contiguous.
- An empty row delimits a new table boundary in the following cases:
    - Between tables in the same result that do not share a common table scheme 
    - Between concatenated CSV files
- Each new table boundary starts with new annotation and header rows.

{{% note %}}
If a table has no rows, the default annotation provides the group key values.
{{% /note %}}

### Multiple results
Similar to multiple tables, you must add an empty row to delimit multiple results in a file or data stream, for example, between two concatenated CSV files.

## Errors

If an error occurs during execution, a table returns with: 
- An error column with the error message.
- A reference column with a unique reference code to identify more information about the error.
- A second row with error properties. 
 
If an error occurs:
- Before results materialize, the HTTP status code indicates an error. Error details are encoded in the csv table.
- After partial results are sent to the client, the error is encoded as the next table and remaining results are discarded. In this case, the HTTP status code remains 200 OK.

Example error without annotations:
```
error,reference
Failed to parse query,897
```


 


Single table with no annotations:
result,table,_start,_stop,_time,region,host,_value
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62

Two tables in the same result with no annotations:
result,table,_start,_stop,_time,region,host,_value
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62

Two tables in the same result with no annotations and no header row:
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,west,A,62.73
mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,west,B,12.83
mean,1,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,west,C,51.62


---

There is a horizontal rule above and below this line.

---


#### Here's a title for this codeblock
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
data = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT "used_percent"
FROM "telegraf"."autogen"."mem"
WHERE time > now() - 15m
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}


###### This is a table with lots of stuff
| Column 1 | Column 2 | Column 3 | Column 4 |
| -------- | -------- | -------- | -------- |
| Row 1.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 1.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 1.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 1.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |
| Row 2.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 2.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 2.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 2.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |
| Row 3.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 3.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 3.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 3.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |
| Row 4.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 4.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 4.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 4.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |

###### This is a table in a blockquote
| Column 1 | Column 2  | Column 3 | Column 4 |
| -------- | --------  | -------- | -------- |
| Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  |
| Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  |
| Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  |
| Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  |
