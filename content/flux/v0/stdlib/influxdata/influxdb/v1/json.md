---
title: v1.json() function
description: >
  `v1.json()` parses an InfluxDB 1.x JSON result into a stream of tables.
menu:
  flux_v0_ref:
    name: v1.json
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/json
weight: 301
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L93-L93

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.json()` parses an InfluxDB 1.x JSON result into a stream of tables.



##### Function type signature

```js
(?file: string, ?json: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### json

InfluxDB 1.x query results in JSON format.

_`json` and `file` are mutually exclusive._

### file

File path to file containing InfluxDB 1.x query results in JSON format.

The path can be absolute or relative.
If relative, it is relative to the working directory of the `fluxd` process.
The JSON file must exist in the same file system running the `fluxd` process.
**Note**: InfluxDB OSS and InfluxDB Cloud do not support the `file` parameter.
Neither allow access to the underlying filesystem.


## Examples

- [Convert a InfluxDB 1.x JSON query output string to a stream of tables](#convert-a-influxdb-1x-json-query-output-string-to-a-stream-of-tables)
- [Convert a InfluxDB 1.x JSON query output file to a stream of tables](#convert-a-influxdb-1x-json-query-output-file-to-a-stream-of-tables)

### Convert a InfluxDB 1.x JSON query output string to a stream of tables

```js
import "influxdata/influxdb/v1"

jsonData =
    "{
    \"results\": [
        {
            \"statement_id\": 0,
            \"series\": [
                {
                    \"name\": \"cpu_load_short\",
                    \"columns\": [
                        \"time\",
                        \"value\"
                    ],
                    \"values\": [
                        [
                            \"2021-01-01T00:00:00.000000000Z\",
                            2
                        ],
                        [
                            \"2021-01-01T00:01:00.000000000Z\",
                            0.55
                        ],
                        [
                            \"2021-01-01T00:02:00.000000000Z\",
                            0.64
                        ]
                    ]
                }
            ]
        }
    ]
}"

v1.json(json: jsonData)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | *_measurement  | *_field | _value  |
| -------------------- | -------------- | ------- | ------- |
| 2021-01-01T00:00:00Z | cpu_load_short | value   | 2       |
| 2021-01-01T00:01:00Z | cpu_load_short | value   | 0.55    |
| 2021-01-01T00:02:00Z | cpu_load_short | value   | 0.64    |

{{% /expand %}}
{{< /expand-wrapper >}}

### Convert a InfluxDB 1.x JSON query output file to a stream of tables

```js
import "influxdata/influxdb/v1"

v1.json(file: "/path/to/results.json")

```

