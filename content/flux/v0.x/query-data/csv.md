---
title: Query CSV data sources
list_title: CSV
description: >
  Use [`csv.from()`](/flux/v0.x/stdlib/csv/from/) and
  [experimental `csv.from()`](/flux/v0.x/stdlib/experimental/csv/from/)
  to query CSV data with Flux.
  Query a CSV string, CSV file, or CSV data from a URL.
menu:
  flux_0_x:
    name: CSV
    parent: Query data sources
weight: 103
related:
  - /flux/v0.x/stdlib/csv/from/
  - /flux/v0.x/stdlib/experimental/csv/from/, Experimental csv.from() function
  - /influxdb/cloud/reference/syntax/annotated-csv/
list_code_example: |
  ```js
  import "csv"

  csvData = "
  #group,false,false,true,true,true,false,false
  #datatype,string,long,string,string,string,long,double
  #default,_result,,,,,,
  ,result,table,dataset,metric,sensorID,timestamp,value
  ,,0,air-sensors,humidity,TLM0100,1627049400000000000,34.79
  ,,0,air-sensors,humidity,TLM0100,1627049700000000000,34.65
  ,,1,air-sensors,humidity,TLM0200,1627049400000000000,35.64
  ,,1,air-sensors,humidity,TLM0200,1627049700000000000,35.67
  "
  
  csv.from(csv: csvData)
  ```
---

Use [`csv.from()`](/flux/v0.x/stdlib/csv/from/) and
[experimental `csv.from()`](/flux/v0.x/stdlib/experimental/csv/from/)
to query CSV data with Flux.
Query a CSV string, CSV file, or CSV data from a URL.
Import the `csv` or `experimental/csv` package.

- [CSV parsing modes](#csv-parsing-modes)
- [Results structure](#results-structure)
- [Examples](#examples)
  - [Query an annotated CSV string](#query-an-annotated-csv-string)
  - [Query a raw CSV string](#query-a-raw-csv-string)
  - [Query CSV data from a file](#query-csv-data-from-a-file)
  - [Query CSV data from a URL](#query-csv-data-from-a-url)

## CSV parsing modes
`csv.from()` supports two CSV parsing modes:

- **annotations**: _(Default)_ Use CSV annotations to determine column data types and table grouping.
- **raw**: Parse all columns as strings and use the first row as the **header row**
  and all subsequent rows as data.

{{% note %}}
When using the **annotations** parsing mode, CSV data must include all annotation rows
(`#datatype`, `#group`, and `#default`).
{{% /note %}}

## Results structure
The structure of results returned by `csv.from()` depends on the
[parsing mode](#csv-parsing-modes) used.

- **annotations**: `csv.from()` returns a stream of tables grouped by columns
  defined as `true` in the `#group` annotation row.
- **raw**: `csv.from()`returns a stream of tables with no grouping (all rows are in a single table).
  All data is formatted as strings.

## Examples

_If just getting started, use the [Flux REPL](/influxdb/v2.0/tools/repl/) or the
[InfluxDB Data Explorer](/influxdb/v2.0/query-data/execute-queries/data-explorer/)
to execute Flux queries._

- [Query an annotated CSV string](#query-an-annotated-csv-string)
- [Query a raw CSV string](#query-a-raw-csv-string)
- [Query CSV data from a file](#query-csv-data-from-a-file)
- [Query CSV data from a URL](#query-csv-data-from-a-url)

---

### Query an annotated CSV string
Use the `csv` parameter to specify the annotated CSV string to query.

#### Query
```js
import "csv"

csvData = "
#group,false,false,true,true,true,false,false
#datatype,string,long,string,string,string,long,double
#default,_result,,,,,,
,result,table,dataset,metric,sensorID,timestamp,value
,,0,air-sensors,humidity,TLM0100,1627049400000000000,34.79
,,0,air-sensors,humidity,TLM0100,1627049700000000000,34.65
,,1,air-sensors,humidity,TLM0200,1627049400000000000,35.64
,,1,air-sensors,humidity,TLM0200,1627049700000000000,35.67
,,2,air-sensors,temperature,TLM0100,1627049400000000000,71.84
,,2,air-sensors,temperature,TLM0100,1627049700000000000,71.87
,,3,air-sensors,temperature,TLM0200,1627049400000000000,74.10
,,3,air-sensors,temperature,TLM0200,1627049700000000000,74.17
"

csv.from(csv: csvData)
```

#### Results
| dataset     | metric   | sensorID | timestamp           | value |
| :---------- | :------- | :------- | :------------------ | ----: |
| air-sensors | humidity | TLM0100  | 1627049400000000000 | 34.79 |
| air-sensors | humidity | TLM0100  | 1627049700000000000 | 34.65 |

| dataset     | metric   | sensorID | timestamp           | value |
| :---------- | :------- | :------- | :------------------ | ----: |
| air-sensors | humidity | TLM0200  | 1627049400000000000 | 35.64 |
| air-sensors | humidity | TLM0200  | 1627049700000000000 | 35.67 |

| dataset     | metric      | sensorID | timestamp           | value |
| :---------- | :---------- | :------- | :------------------ | ----: |
| air-sensors | temperature | TLM0100  | 1627049400000000000 | 71.84 |
| air-sensors | temperature | TLM0100  | 1627049700000000000 | 71.87 |

| dataset     | metric      | sensorID | timestamp           | value |
| :---------- | :---------- | :------- | :------------------ | ----: |
| air-sensors | temperature | TLM0200  | 1627049400000000000 | 74.10 |
| air-sensors | temperature | TLM0200  | 1627049700000000000 | 74.17 |

---

### Query a raw CSV string
Use the `csv` parameter to specify the raw CSV string to query.
Set the `mode` parameter to `raw`.

#### Query
```js
import "csv"

csvData = "
dataset,metric,sensorID,timestamp,value
air-sensors,humidity,TLM0100,1627049400000000000,34.79
air-sensors,humidity,TLM0100,1627049700000000000,34.65
air-sensors,humidity,TLM0200,1627049400000000000,35.64
air-sensors,humidity,TLM0200,1627049700000000000,35.67
air-sensors,temperature,TLM0100,1627049400000000000,71.84
air-sensors,temperature,TLM0100,1627049700000000000,71.87
air-sensors,temperature,TLM0200,1627049400000000000,74.10
air-sensors,temperature,TLM0200,1627049700000000000,74.17
"

csv.from(csv: csvData, mode: "raw")
```

#### Results
{{% note %}}
When using the **raw** CSV parsing mode, all columns values are strings.
{{% /note %}}

| dataset     | metric      | sensorID | timestamp           | value |
| :---------- | :---------- | :------- | :------------------ | ----: |
| air-sensors | humidity    | TLM0100  | 1627049400000000000 | 34.79 |
| air-sensors | humidity    | TLM0100  | 1627049700000000000 | 34.65 |
| air-sensors | humidity    | TLM0200  | 1627049400000000000 | 35.64 |
| air-sensors | humidity    | TLM0200  | 1627049700000000000 | 35.67 |
| air-sensors | temperature | TLM0100  | 1627049400000000000 | 71.84 |
| air-sensors | temperature | TLM0100  | 1627049700000000000 | 71.87 |
| air-sensors | temperature | TLM0200  | 1627049400000000000 | 74.10 |
| air-sensors | temperature | TLM0200  | 1627049700000000000 | 74.17 |

---

### Query CSV data from a file
Use `csv.from()` and the `file` parameter to query CSV data from a file.

{{% note %}}
#### Flux must have access to the file system
To query CSV data from a file, Flux must have access to the filesystem.
If Flux does not have access to the file system, the query will return an error
similar to:

```
failed to read file: filesystem service is uninitialized
```

If using InfluxDB Cloud or InfluxDB OSS, the Flux process **does not** have 
access to the filesystem.
{{% /note %}}

#### Query
```js
import "csv"

csv.from(file: "/path/to/example.csv")
```

#### /path/to/example.csv
```csv
#group,false,false,true,true,true,false,false
#datatype,string,long,string,string,string,long,double
#default,_result,,,,,,
,result,table,dataset,metric,sensorID,timestamp,value
,,0,air-sensors,humidity,TLM0100,1627049400000000000,34.79
,,0,air-sensors,humidity,TLM0100,1627049700000000000,34.65
,,1,air-sensors,humidity,TLM0200,1627049400000000000,35.64
,,1,air-sensors,humidity,TLM0200,1627049700000000000,35.67
,,2,air-sensors,temperature,TLM0100,1627049400000000000,71.84
,,2,air-sensors,temperature,TLM0100,1627049700000000000,71.87
,,3,air-sensors,temperature,TLM0200,1627049400000000000,74.10
,,3,air-sensors,temperature,TLM0200,1627049700000000000,74.17
```

#### Results
| dataset     | metric   | sensorID | timestamp           | value |
| :---------- | :------- | :------- | :------------------ | ----: |
| air-sensors | humidity | TLM0100  | 1627049400000000000 | 34.79 |
| air-sensors | humidity | TLM0100  | 1627049700000000000 | 34.65 |

| dataset     | metric   | sensorID | timestamp           | value |
| :---------- | :------- | :------- | :------------------ | ----: |
| air-sensors | humidity | TLM0200  | 1627049400000000000 | 35.64 |
| air-sensors | humidity | TLM0200  | 1627049700000000000 | 35.67 |

| dataset     | metric      | sensorID | timestamp           | value |
| :---------- | :---------- | :------- | :------------------ | ----: |
| air-sensors | temperature | TLM0100  | 1627049400000000000 | 71.84 |
| air-sensors | temperature | TLM0100  | 1627049700000000000 | 71.87 |

| dataset     | metric      | sensorID | timestamp           | value |
| :---------- | :---------- | :------- | :------------------ | ----: |
| air-sensors | temperature | TLM0200  | 1627049400000000000 | 74.10 |
| air-sensors | temperature | TLM0200  | 1627049700000000000 | 74.17 |

---

### Query CSV data from a URL
Import the [`experimental/csv` package](/flux/v0.x/stdlib/experimental/csv/)
and use the [experimental `csv.from()` function](/flux/v0.x/stdlib/experimental/csv/from/)
to query data from a URL.
Use the `url` parameter to specify the URL to query.

{{% note %}}
The experimental `csv.from()` function does not support multiple parsing modes
and only works with [annotated CSV](/influxdb/cloud/reference/syntax/annotated-csv/).
{{% /note %}}

```js
import "experimental/csv"

csv.from(url: "https://example.com/example.csv")
```

**To use the parsing modes available in `csv.from()`:**

1. Import the [`experimental/http` package](/flux/v0.x/stdlib/experimental/http/).
2. Use [`http.get()`](/flux/v0.x/stdlib/experimental/http/) to fetch the CSV data.
3. Use [`string()`](/flux/v0.x/stdlib/universe/string/) to convert the response body to a string.
4. Use `csv.from` to parse the CSV data and return results.

```js
import "experimental/http"
import "csv"

url = "https://example.com/example.csv"
csvData = string(v: http.get(url: url).body)

csv.from(csv: csvData, mode: "raw")
```
