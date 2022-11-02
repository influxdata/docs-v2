---
title: Get started querying data
seotitle: Query data | Get started with InfluxDB
list_title: Query data
description: >
  ...
menu:
  influxdb_2_4:
    name: Query data
    parent: Get started
    identifier: get-started-query-data
weight: 102
metadata: [3 / 5]
---

InfluxDB {{< current-version >}} supports two languages for querying your time series data:

- **Flux**: A functional scripting language designed to query and process data
  from InfluxDB and other data sources.
- **InfluxQL**: A SQL-like query language designed to query time series data from
  InfluxDB.

{{% note %}}
The examples in this section of the tutorial query the data from written in the
[Get started writing data](/influxdb/v2.4/get-started/write/#write-line-protocol-to-influxdb) section.
{{% /note %}}

## Query data with Flux

### Flux query basic syntax

- Pipe-forward operator that takes the output of the previous function and pipes
  it forward as input to the next function.

Basic query functions:

- [from()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from/):
  Queries data from an InfluxDB bucket.
- [range()](/{{< latest "flux" >}}/stdlib/universe/range/):
  Filters data based on time bounds. Flux requires "bounded" queries—queries
  limited to a specific time range.
- [filter()](/{{< latest "flux" >}}/stdlib/universe/filter/):
  Filters data based on column values. Each row is represented by `r`
  and each column is represented by a property of `r`.
  You can apply multiple subsequent filters.
    - If the predicate function defined in the `fn` parameter returns `true`,
      the row is included in the output. If it returns false, the row is excluded
      from the output.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
```

- Stop times are _exclusive_, so to get the last example data point, add 1 second
on to the stop time.

### Execute a Flux query

Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to execute Flux queries.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Visit
    {{% oss-only %}}[localhost:8086](http://localhost:8086){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  In the left navigation bar, click **Data Explorer**.

  {{< nav-icon "data-explorer" "v4" >}}

3. The InfluxDB Data Explorer provides two options for querying data with Flux:

    - [Query Builder](#query-builder) _(default)_: 
      Visual query builder that lets you select the time range,
      measurement, tags, and fields to query.
    - [Script Editor](#script-editor):
      In-browser code editor for composing and running Flux scripts.

    ---

    #### Query builder
    
    **To build and execute a Flux query with the query builder**:

    1.  In the **{{% caps %}}FROM{{% /caps %}}** column, select the bucket to query. For this tutorial,
        select the **get-started** bucket.
    2.  In the next **filter** column, select **_measurement** from the
        column dropdown menu, and then select the **home** measurement.
    3.  _(Optional)_ To query a specific field or fields, in the next **filter**
        column, select **_field** from the column dropdown menu, and then
        select the fields to query. In this tutorial, there are three
        fields: **co**, **hum**, and **temp**.
    4.  _(Optional)_ To query by specific tag values, in the next **filter**
        column, select then tag column from the column dropdown menu, and then
        select the tag values to filter by. In this tutorial, the tag only
        tag column is **room**.
    4.  _(Optional)_ In the **{{% caps %}}Aggregate Function{{% /caps %}}** pane,
        select an aggregate or selector function to use to downsample the data.
        The default aggregate function is `mean`.
    5.  In the time range dropdown menu, select **Custom Time Range**, and
        select the following dates from the date selectors:
          
          - **Start**: 2022-01-01 08:00:00
          - **Stop**: 2022-01-01 20:00:01

            _Note the addition of one second to the stop time. In Flux, stop
            times are exclusive and will exclude points with that timestamp.
            By adding one second, the query will include all points to
            2022-01-01 20:00:00_.
    
    6.  Click **{{% caps %}}Submit{{% /caps %}}** to execute the query with the
        selected filters and operations and display the result.
      
    ---

    #### Script editor

    **To write and execute a Flux query with the query builder**:

    1.  In the Data Explorer, click **{{% caps %}}Script Editor{{% /caps %}}**.
    2.  Write your Flux query in the Script Editor text field.

        _**Note**: You can either hand-write the functions or you can use the function list
        to the right of the script editor to search for and inject functions._
    
        1.  Use `from()` and specify the bucket to query with the `bucket` parameter.
            For this tutorial, query the **get-started** bucket.
        2.  Use `range()` to specify the time range to query. The `start`
            parameter defines the earliest time to include in results.
            The `stop` parameter specifies the latest time (exclusively) to
            include in results.

            - **start**: 2022-01-01T08:00:00Z
            - **stop**: 2022-01-01T20:00:01Z

                _Note the addition of one second to the stop time. In Flux, stop
                times are exclusive and will exclude points with that timestamp.
                By adding one second, the query will include all points to
                2022-01-01 20:00:00_.
            
            If you want to use the start and stop times selected in the time
            selection dropdown menu, use `v.timeRangeStart` and `v.timeRangeStop`
            as the values for the `start` and `stop` parameters.

        3.  Use `filter()` to filter results by the **home** measurement.
        4.  _(Optional)_ Use `filter()` to filter results by a specific field.
            In this tutorial, there are three fields: **co**, **hum**, and **temp**.
        5.  _(Optional)_ Use `filter()` to filter results by specific 
            tag values. In this tutorial, there is one tag, **room**, with two
            potential values: **Living Room** or **Kitchen**.

        ```js
        from(bucket: "get-started")
            |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
            |> filter(fn: (r) => r._measurement == "home")
            // Optional filters below
            // |> filter(fn: (r) => r._field == "temp" or r._field == "hum")
            // |> filter(fn: (r) => r.room == "Kitchen")
        ```
    
    3.  Click **{{% caps %}}Submit{{% /caps %}}** to execute the query with the
        selected filters and operations and display the result.
      



<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/v2.4/tools/influx-cli/).
2.  Use the [`influx query` command](/influxdb/v2.4/reference/cli/influx/query/)
    to query InfluxDB using Flux.
    
    **Provide the following**:

    - String-encoded Flux query.

    {{< cli/influx-creds-note >}}

```sh
influx query '
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
'
```

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To write data to InfluxDB using the InfluxDB HTTP API, send a request to
the InfluxDB API [`/api/v2/query` endpoint](/influxdb/v2.4/api/#operation/PostQuery)
using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/query" method="post" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: application/vnd.flux
  - **Accept**: application/csv
  - _(Optional)_ **Accept-Encoding**: gzip
- **Query parameters**:
  - **org**: InfluxDB organization name
- **Request body**: Flux query as plain text

```sh
export INFLUX_HOST=http://localhost:8086
export INFLUX_ORG=<YOUR_INFLUXDB_ORG>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>

curl --request POST \
"$INFLUX_HOST/api/v2/query?org=$INFLUX_ORG&bucket=get-started" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --header "Content-Type: application/vnd.flux" \
  --header "Accept: application/csv" \
  --data 'from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
  '
```

{{% note %}}
The InfluxDB API returns results in [annotated CSV](/influxdb/v2.4/referency/syntax/annotated-csv/).
{{% /note %}}

<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}



## Query data with InfluxQL

InfluxQL is a SQL-like querying language developed to query time series data
from InfluxDB 0.x and 1.x.

{{% note %}}
Because InfluxQL was developed for earlier versions of InfluxDB, it depends on
**databases and retention policies** which have been replaced by
[buckets](/influxdb/v2.4/get-started/#data-organization) in InfluxDB {{< current-version >}}.
To use InfluxQL with InfluxDB {{< current-version >}}, first map database and
retention policy (DBRP) combinations to an InfluxDB bucket.
{{% /note %}}


---



- Intro to Flux and InfluxQL
- Annotated CSV
- Walk through creating a Flux query
  - `from()`
  - `range()` (InfluxDB doesn't support unbounded queries)
  - `filter()`
  - Other operations you can perform
- Use the InfluxDB CLI, UI, or API to query data

{{< page-nav prev="/influxdb/v2.4/get-started/write/" next="/influxdb/v2.4/get-started/process/" >}}

<!-- 
### Query data

Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/v2.4/query-data/).
-->
