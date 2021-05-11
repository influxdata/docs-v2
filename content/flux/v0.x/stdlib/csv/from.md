---
title: csv.from() function
description: The `csv.from()` function retrieves data from a CSV data source.
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs/fromcsv
  - /influxdb/v2.0/reference/flux/functions/built-in/inputs/fromcsv
  - /influxdb/v2.0/reference/flux/functions/csv/from/
  - /influxdb/v2.0/reference/flux/stdlib/csv/from/
  - /influxdb/cloud/reference/flux/stdlib/csv/from/
menu:
  flux_0_x_ref:
    name: csv.from
    parent: csv
weight: 202
flux/v0.x/tags: [inputs]
introduced: 0.14.0
---

The `csv.from()` function retrieves data from a comma-separated value (CSV) data source.
It returns a stream of tables.
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

_**Function type:** Input_

```js
import "csv"

csv.from(
  csv: csvData,
  mode: "annotations"
)

// OR

csv.from(
  file: "/path/to/data-file.csv",
  mode: "annotations"
)
```

## Parameters

### csv {data-type="string"}
CSV data.
Supports [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/) or raw CSV.
Use [`mode`](#mode) to specify the parsing mode.

{{% note %}}
Annotated CSV data must include all [annotation rows](/influxdb/v2.0/reference/syntax/annotated-csv/#annotations).
{{% /note %}}

### file {data-type="string"}
The file path of the CSV file to query.
The path can be absolute or relative.
If relative, it is relative to the working directory of the `fluxd` process.
_The CSV file must exist in the same file system running the `fluxd` process._

{{% warn %}}
**InfluxDB OSS** and **{{< cloud-name "short" >}}** user interfaces do _**not**_ support the `file` parameter.
Neither allow access to the underlying filesystem.
However, the [Flux REPL](/influxdb/v2.0/tools/repl/) does support the `file` parameter.
{{% /warn %}}

### mode {data-type="string"}
CSV parsing mode.
Default is `annotations`.

##### Available modes
- **annotations:** Use CSV annotations to determine column data types.
- **raw:** Parse all columns as strings and use the first row as the
  [header row](/influxdb/v2.0/reference/syntax/annotated-csv/#rows) and all
  subsequent rows as data.

## Examples

- [Query annotated CSV data from a file](#query-annotated-csv-data-from-a-file)
- [Query raw CSV data from a file](#query-raw-csv-data-from-a-file)
- [Query an annotated CSV string](#query-an-annotated-csv-string)
- [Query a raw CSV string](#query-a-raw-csv-string)

##### Query annotated CSV data from a file
```js
import "csv"

csv.from(file: "/path/to/data-file.csv")
```

##### Query raw CSV data from a file
```js
import "csv"
csv.from(
  file: "/path/to/data-file.csv",
  mode: "raw"
)
```

##### Query an annotated CSV string
```js
import "csv"

csvData = "
#datatype,string,long,dateTime:RFC3339,dateTime:RFC3339,dateTime:RFC3339,string,string,double
#group,false,false,false,false,false,false,false,false
#default,,,,,,,,
,result,table,_start,_stop,_time,region,host,_value
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
,mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
"

csv.from(csv: csvData)
```
##### Query a raw CSV string
```js
import "csv"
csvData = "
_start,_stop,_time,region,host,_value
2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
"
csv.from(
  csv: csvData,
  mode: "raw"
)
```

{{% expand "Function updates" %}}
#### v0.109.0
- Add `mode` parameter to support querying raw CSV data.
{{% /expand %}}
