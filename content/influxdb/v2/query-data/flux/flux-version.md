---
title: Query the Flux version
seotitle: Query the version of Flux installed in InfluxDB
list_title: Query the Flux version
description: >
  Use `runtime.version()` to return the version of Flux installed in InfluxDB.
weight: 221
menu:
  influxdb_v2:
    parent: Query with Flux
    name: Flux version
influxdb/v2/tags: [query]
related:
  - /flux/v0/stdlib/runtime/version/
list_code_example: |
  ```js
  import "array"
  import "runtime"
  
  array.from(rows: [{version: runtime.version()}])
  ```
---

InfluxDB {{< current-version >}} includes specific version of Flux that may or
may not support documented Flux functionality.
It's important to know what version of Flux you're currently using and what
functions are supported in that specific version.

To query the version of Flux installed with InfluxDB, use `array.from()` to
create an ad hoc stream of tables and `runtime.version()` to populate a column
with the Flux version.

{{% note %}}
Because the InfluxDB `/api/v2/query` endpoint can only return a stream of tables
and not single scalar values, you must use `array.from()` to create a stream of tables.
{{% /note %}}

Run the following query in the **InfluxDB user interface**, with the **`influx` CLI**,
or **InfluxDB API**:

```js
import "array"
import "runtime"

array.from(rows: [{version: runtime.version()}])
```

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

To return the version of Flux installed with InfluxDB using the InfluxDB UI:

1.  Click **Data Explorer** in the left navigation bar.

{{< nav-icon "data-explorer" >}}

2.  Click **{{% caps %}}Script Editor{{% /caps %}}** to manually create and
    edit a Flux query.
3.  Enable the **View Raw Data {{< icon "toggle" >}}** toggle or select one of the
    following visualization types:

    - [Single Stat](/influxdb/v2/visualize-data/visualization-types/single-stat/)
    - [Table](/influxdb/v2/visualize-data/visualization-types/table/)

4.  Enter and run the following query:

    ```js
    import "array"
    import "runtime"

    array.from(rows: [{version: runtime.version()}])
    ```

{{% /tab-content %}}
{{% tab-content %}}

To return the version of Flux installed with InfluxDB using the `influx` CLI,
use the `influx query` command. Provide the following:

- InfluxDB **host**, **organization**, and **API token**  
  _(the example below assumes that a
  [CLI configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials)
  is set up and active)_
- Query to execute

```sh
$ influx query \
  'import "array"
   import "runtime"

   array.from(rows: [{version: runtime.version()}])'

# Output
Result: _result
Table: keys: []
        version:string
----------------------
              v0.161.0
```
{{% /tab-content %}}

{{% tab-content %}}

To return the version of Flux installed with InfluxDB using the InfluxDB API,
use the [`/api/v2/query` endpoint](/influxdb/v2/api/#tag/Query).

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/query" api-ref="/influxdb/v2/api/#operation/PostQuery" >}}
Provide the following:

- InfluxDB {{% cloud-only %}}Cloud{{% /cloud-only %}} host
- InfluxDB organization name or ID as a query parameter
- `Authorization` header with the `Token` scheme and your API token
- `Accept: application/csv` header
- `Content-type: application/vnd.flux` header
- Query to execute as the request body

```sh
curl --request POST \
  http://localhost:8086/api/v2/query?orgID=INFLUX_ORG_ID \
  --header 'Authorization: Token INFLUX_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --data 'import "array"
    import "runtime"

    array.from(rows: [{version: runtime.version()}])'

# Output
,result,table,version
,_result,0,v0.161.0
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% warn %}}
#### Flux version in the Flux REPL
When you run `runtime.version()` in the [Flux REPL](/influxdb/v2/tools/flux-repl/),
the function returns the version of Flux the REPL was built with, not the version
of Flux installed in the instance of InfluxDB you're querying.
{{% /warn %}}