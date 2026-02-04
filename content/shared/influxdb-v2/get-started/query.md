
InfluxDB supports many different tools for querying data, including:

- InfluxDB user interface (UI)
- [InfluxDB HTTP API](/influxdb/version/reference/api/)
- [`influx` CLI](/influxdb/version/tools/influx-cli/)
- [Chronograf](/chronograf/v1/)
- [Grafana](/influxdb/version/tools/grafana/)
- [InfluxDB client libraries](/influxdb/version/api-guide/client-libraries/)

This tutorial walks you through the fundamentals of querying data in InfluxDB and
focuses primarily on the two languages you can use to query your time series data:

- **Flux**: A functional scripting language designed to query and process data
  from InfluxDB and other data sources.
- **InfluxQL**: A SQL-like query language designed to query time series data from
  InfluxDB.

{{% note %}}
The examples in this section of the tutorial query the data from written in the
[Get started writing data](/influxdb/version/get-started/write/#write-line-protocol-to-influxdb) section.
{{% /note %}}

###### On this page:
- [Query data with Flux](#query-data-with-flux)
  - [Flux query basics](#flux-query-basics)
  - [Execute a Flux query](#execute-a-flux-query)
- [Query data with InfluxQL](#query-data-with-influxql)
  - [InfluxQL query basics](#influxql-query-basics)
  - [Execute an InfluxQL query](#execute-an-influxql-query)

---

## Query data with Flux

Flux is a functional scripting language that lets you query and process data
from InfluxDB and [other data sources](/flux/v0/query-data/).

{{% note %}}
This is a brief introduction to writing Flux queries.
For a more in-depth introduction, see [Get started with Flux](/flux/v0/get-started/).
{{% /note %}}

### Flux query basics

When querying InfluxDB with Flux, there are three primary functions you use:

- [from()](/flux/v0/stdlib/influxdata/influxdb/from/):
  Queries data from an InfluxDB bucket.
- [range()](/flux/v0/stdlib/universe/range/):
  Filters data based on time bounds. Flux requires "bounded" queries—queries
  limited to a specific time range.
- [filter()](/flux/v0/stdlib/universe/filter/):
  Filters data based on column values. Each row is represented by `r`
  and each column is represented by a property of `r`.
  You can apply multiple subsequent filters.

  To see how `from()` structures data into rows and tables when returned from InfluxDB,
  [view the data written in Get started writing to InfluxDB](/influxdb/version/get-started/write/#view-the-written-data).

  {{< expand-wrapper >}}
{{% expand "Learn more about how `filter()` works" %}}

[`filter()`](/flux/v0/stdlib/universe/filter/) reads each row as a
[record](/flux/v0/data-types/composite/record/) named `r`.
In the `r` record, each key-value pair represents a column and its value.
For example:

```js
r = {
    _time: 2020-01-01T00:00:00Z,
    _measurement: "home",
    room: "Kitchen",
    _field: "temp",
    _value: 21.0,
}
```

To filter rows, use [predicate expressions](/flux/v0/get-started/syntax-basics/#predicate-expressions)
to evaluate the values of columns. Given the row record above:

```javascript
(r) => r._measurement == "home" // Returns true
(r) => r.room == "Kitchen" // Returns true
(r) => r._field == "co" // Returns false
(r) => r._field == "co" or r._field == "temp" // Returns true
(r) => r._value <= 20.0 // Returns false
```

Rows that evaluate to `true` are included in the `filter()` output.
Rows that evaluate to `false` are dropped from the `filter()` output.
  {{% /expand %}}
  {{< /expand-wrapper >}}

#### Pipe-forward operator

Flux uses the pipe-forward operator (`|>`) to pipe the output of one function as
input the next function as input.

#### Query the example data

The following Flux query returns the **co**, **hum**, and **temp** fields stored in
the **home** measurement with timestamps **between 2022-01-01T08:00:00Z and 2022-01-01T20:00:01Z**.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field== "co" or r._field == "hum" or r._field == "temp")
```

### Execute a Flux query

Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to execute Flux queries.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!--------------------------- BEGIN FLUX UI CONTENT --------------------------->

1.  Visit
    {{% show-in "v2" %}}[localhost:8086](http://localhost:8086){{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /show-in %}}
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
    5.  _(Optional)_ In the **{{% caps %}}Aggregate Function{{% /caps %}}** pane,
        select an aggregate or selector function to use to downsample the data.
        The default aggregate function is `mean`.
    6.  In the time range dropdown menu, select **Custom Time Range**, and
        select the following dates from the date selectors:
          
          - **Start**: 2022-01-01 08:00:00
          - **Stop**: 2022-01-01 20:00:01

            _Note the addition of one second to the stop time. In Flux, stop
            times are exclusive and will exclude points with that timestamp.
            By adding one second, the query will include all points to
            2022-01-01 20:00:00_.
    
    7.  Click **{{% caps %}}Submit{{% /caps %}}** to execute the query with the
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
            |> filter(fn: (r) => r._field== "co" or r._field == "hum" or r._field == "temp")
        ```
    
    3.  Click **{{% caps %}}Submit{{% /caps %}}** to execute the query with the
        selected filters and operations and display the result.

<!---------------------------- END FLUX UI CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN FLUX CLI CONTENT --------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/version/tools/influx-cli/).
2.  Use the [`influx query` command](/influxdb/version/reference/cli/influx/query/)
    to query InfluxDB using Flux.
    
    **Provide the following**:

    - String-encoded Flux query.
    - [Connection and authentication credentials](/influxdb/version/get-started/setup/?t=influx+CLI#configure-authentication-credentials)

```sh
influx query '
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field== "co" or r._field == "hum" or r._field == "temp")
'
```

<!--------------------------- END FLUX CLI CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN FLUX API CONTENT --------------------------->

To query data from InfluxDB using Flux and the InfluxDB HTTP API, send a request
to the InfluxDB API [`/api/v2/query` endpoint](/influxdb/version/api/#post-/api/v2/query)
using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/query" method="post" api-ref="/influxdb/version/api/#post-/api/v2/query" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: application/vnd.flux
  - **Accept**: application/csv
  - _(Optional)_ **Accept-Encoding**: gzip
- **Query parameters**:
  - **org**: InfluxDB organization name
- **Request body**: Flux query as plain text

The following example uses cURL and the InfluxDB API to query data with Flux:

```sh
curl --request POST \
"$INFLUX_HOST/api/v2/query?org=$INFLUX_ORG&bucket=get-started" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --header "Content-Type: application/vnd.flux" \
  --header "Accept: application/csv" \
  --data 'from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field== "co" or r._field == "hum" or r._field == "temp")
  '
```

{{% note %}}
The InfluxDB `/api/v2/query` endpoint returns query results in
[annotated CSV](/influxdb/version/reference/syntax/annotated-csv/).
{{% /note %}}

<!--------------------------- END FLUX API CONTENT ---------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Flux query results

{{< expand-wrapper >}}
{{% expand "View Flux query results" %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
These columns, by default, represent the query time bounds and are added by `range()`.
{{% /note %}}

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T09:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T10:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T11:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T12:00:00Z | home         | Kitchen | co     |      0 |
| 2022-01-01T13:00:00Z | home         | Kitchen | co     |      1 |
| 2022-01-01T14:00:00Z | home         | Kitchen | co     |      1 |
| 2022-01-01T15:00:00Z | home         | Kitchen | co     |      3 |
| 2022-01-01T16:00:00Z | home         | Kitchen | co     |      7 |
| 2022-01-01T17:00:00Z | home         | Kitchen | co     |      9 |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 |

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen | hum    |   35.9 |
| 2022-01-01T09:00:00Z | home         | Kitchen | hum    |   36.2 |
| 2022-01-01T10:00:00Z | home         | Kitchen | hum    |   36.1 |
| 2022-01-01T11:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T12:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T13:00:00Z | home         | Kitchen | hum    |   36.5 |
| 2022-01-01T14:00:00Z | home         | Kitchen | hum    |   36.3 |
| 2022-01-01T15:00:00Z | home         | Kitchen | hum    |   36.2 |
| 2022-01-01T16:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T17:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T18:00:00Z | home         | Kitchen | hum    |   36.9 |
| 2022-01-01T19:00:00Z | home         | Kitchen | hum    |   36.6 |
| 2022-01-01T20:00:00Z | home         | Kitchen | hum    |   36.5 |

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen | temp   |     21 |
| 2022-01-01T09:00:00Z | home         | Kitchen | temp   |     23 |
| 2022-01-01T10:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T11:00:00Z | home         | Kitchen | temp   |   22.4 |
| 2022-01-01T12:00:00Z | home         | Kitchen | temp   |   22.5 |
| 2022-01-01T13:00:00Z | home         | Kitchen | temp   |   22.8 |
| 2022-01-01T14:00:00Z | home         | Kitchen | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T09:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T10:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T11:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T12:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T13:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T14:00:00Z | home         | Living Room | co     |      0 |
| 2022-01-01T15:00:00Z | home         | Living Room | co     |      1 |
| 2022-01-01T16:00:00Z | home         | Living Room | co     |      4 |
| 2022-01-01T17:00:00Z | home         | Living Room | co     |      5 |
| 2022-01-01T18:00:00Z | home         | Living Room | co     |      9 |
| 2022-01-01T19:00:00Z | home         | Living Room | co     |     14 |
| 2022-01-01T20:00:00Z | home         | Living Room | co     |     17 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T09:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T10:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T11:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T12:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T13:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T14:00:00Z | home         | Living Room | hum    |   36.1 |
| 2022-01-01T15:00:00Z | home         | Living Room | hum    |   36.1 |
| 2022-01-01T16:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T17:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T18:00:00Z | home         | Living Room | hum    |   36.2 |
| 2022-01-01T19:00:00Z | home         | Living Room | hum    |   36.3 |
| 2022-01-01T20:00:00Z | home         | Living Room | hum    |   36.4 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Living Room | temp   |   21.1 |
| 2022-01-01T09:00:00Z | home         | Living Room | temp   |   21.4 |
| 2022-01-01T10:00:00Z | home         | Living Room | temp   |   21.8 |
| 2022-01-01T11:00:00Z | home         | Living Room | temp   |   22.2 |
| 2022-01-01T12:00:00Z | home         | Living Room | temp   |   22.2 |
| 2022-01-01T13:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Query data with InfluxQL

InfluxQL is a SQL-like query language similar to most SQL languages, but
specifically designed to query time series data from InfluxDB 0.x and 1.x.

{{% note %}}
#### Map databases and retention policies to buckets

Because InfluxQL was developed for earlier versions of InfluxDB, it depends on
**databases and retention policies** (DBRP) which have been replaced by
[buckets](/influxdb/version/get-started/#data-organization) in InfluxDB {{< current-version >}}.
To use InfluxQL with InfluxDB {{< current-version >}}, first
[map database and retention policy (DBRP) combinations to an InfluxDB bucket](/influxdb/version/query-data/influxql/dbrp/).
{{% /note %}}

### InfluxQL query basics

When querying InfluxDB with InfluxQL, the most basic query includes the following
statements and clauses:

- `SELECT`: Specify which fields and tags to query.
- `FROM`: Specify the measurement to query.
  Use the measurement name or a fully-qualified measurement name which includes
  the database and retention policy. For example: `db.rp.measurement`.
- `WHERE`: _(Optional)_ Filter data based on fields, tags, and time.

The following InfluxQL query returns the **co**, **hum**, and **temp** fields and
the **room** tag stored in the **home** measurement with timestamps
**between 2022-01-01T08:00:00Z and 2022-01-01T20:00:00Z**.

```sql
SELECT co,hum,temp,room FROM "get-started".autogen.home WHERE time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T20:00:00Z'
```

{{% note %}}
These are just the fundamentals of the InfluxQL syntax.
For more in-depth information, see the [InfluxQL documentation](/influxdb/version/query-data/influxql/).
{{% /note %}}

### Execute an InfluxQL query

Use the **`influx` CLI**, or **InfluxDB API** to execute InfluxQL queries.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------- BEGIN INFLUXQL UI CONTENT ------------------------->

{{% note %}}
#### The influxdb UI does not support InfluxQL

The InfluxDB {{< current-version >}} UI does not provide a way to query data with InfluxQL.
For a user interface that builds and executes InfluxQL queries, consider using
[Chronograf](/influxdb/version/tools/chronograf/) or
[Grafana](/influxdb/version/tools/grafana/) with InfluxDB {{< current-version >}}.
{{% /note %}}

<!-------------------------- END INFLUXQL UI CONTENT -------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN INFLUXQL CLI CONTENT ------------------------->

{{< cli/influx-creds-note >}}

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/version/tools/influx-cli/).
2.  Use the [`influx v1 shell` command](/influxdb/version/reference/cli/influx/v1/shell/)
    to start an InfluxQL shell and query InfluxDB using InfluxQL.
    Provide the following:

    - [Connection and authentication credentials](/influxdb/version/get-started/setup/?t=influx+CLI#configure-authentication-credentials)

    ```sh
    influx v1 shell
    ```

3.  Enter an InfluxQL query and press {{< keybind mac="return" other="Enter ↵" >}}.

    ```sql
    SELECT co,hum,temp,room FROM "get-started".autogen.home WHERE time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T20:00:00Z'
    ```

<!------------------------- END INFLUXQL CLI CONTENT -------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN INFLUXQL API CONTENT ------------------------->

To query data from InfluxDB using InfluxQL and the InfluxDB HTTP API, send a request
to the InfluxDB API [`/query` 1.X compatibility endpoint](/influxdb/version/reference/api/influxdb-1x/query/)
using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/query" method="post" api-ref="/influxdb/version/api/v1/#post-/query" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Accept**: application/json
  - _(Optional)_ **Accept-Encoding**: gzip
- **Query parameters**:
  - **db**: Database to query.
  - **rp**: Retention policy to query data from.
  - **q**: InfluxQL query to execute.
  - **epoch**: _(Optional)_  Return results with
    [Unix timestamps](/influxdb/version/reference/glossary/#unix-timestamp) of a
    specified precision instead of [RFC3339 timestamps](/influxdb/version/reference/glossary/#rfc3339-timestamp). The following precisions are available:

    - `ns` - nanoseconds
    - `u` or `µ` - microseconds
    - `ms` - milliseconds
    - `s` - seconds
    - `m` - minutes
    - `h` - hours

- **Request body**: Flux query as plain text

The following example uses cURL and the InfluxDB API to query data with InfluxQL:

```sh
curl --get "$INFLUX_HOST/query?org=$INFLUX_ORG&bucket=get-started" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --data-urlencode "db=get-started" \
  --data-urlencode "rp=autogen" \
  --data-urlencode "q=SELECT co,hum,temp,room FROM home WHERE time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T20:00:00Z'"
```

{{% note %}}
The InfluxDB `/write` 1.x compatibility endpoint returns query results in JSON format.
{{% /note %}}

<!------------------------- END INFLUXQL API CONTENT -------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### InfluxQL query results

{{< expand-wrapper >}}
{{% expand "View InfluxQL query results" %}}

| time                 | room        |  co |  hum | temp |
| :------------------- | :---------- | --: | ---: | ---: |
| 2022-01-01T08:00:00Z | Kitchen     |   0 | 35.9 |   21 |
| 2022-01-01T08:00:00Z | Living Room |   0 | 35.9 | 21.1 |
| 2022-01-01T09:00:00Z | Kitchen     |   0 | 36.2 |   23 |
| 2022-01-01T09:00:00Z | Living Room |   0 | 35.9 | 21.4 |
| 2022-01-01T10:00:00Z | Kitchen     |   0 | 36.1 | 22.7 |
| 2022-01-01T10:00:00Z | Living Room |   0 |   36 | 21.8 |
| 2022-01-01T11:00:00Z | Kitchen     |   0 |   36 | 22.4 |
| 2022-01-01T11:00:00Z | Living Room |   0 |   36 | 22.2 |
| 2022-01-01T12:00:00Z | Kitchen     |   0 |   36 | 22.5 |
| 2022-01-01T12:00:00Z | Living Room |   0 | 35.9 | 22.2 |
| 2022-01-01T13:00:00Z | Kitchen     |   1 | 36.5 | 22.8 |
| 2022-01-01T13:00:00Z | Living Room |   0 |   36 | 22.4 |
| 2022-01-01T14:00:00Z | Kitchen     |   1 | 36.3 | 22.8 |
| 2022-01-01T14:00:00Z | Living Room |   0 | 36.1 | 22.3 |
| 2022-01-01T15:00:00Z | Kitchen     |   3 | 36.2 | 22.7 |
| 2022-01-01T15:00:00Z | Living Room |   1 | 36.1 | 22.3 |
| 2022-01-01T16:00:00Z | Kitchen     |   7 |   36 | 22.4 |
| 2022-01-01T16:00:00Z | Living Room |   4 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Kitchen     |   9 |   36 | 22.7 |
| 2022-01-01T17:00:00Z | Living Room |   5 | 35.9 | 22.6 |
| 2022-01-01T18:00:00Z | Kitchen     |  18 | 36.9 | 23.3 |
| 2022-01-01T18:00:00Z | Living Room |   9 | 36.2 | 22.8 |
| 2022-01-01T19:00:00Z | Kitchen     |  22 | 36.6 | 23.1 |
| 2022-01-01T19:00:00Z | Living Room |  14 | 36.3 | 22.5 |
| 2022-01-01T20:00:00Z | Kitchen     |  26 | 36.5 | 22.7 |
| 2022-01-01T20:00:00Z | Living Room |  17 | 36.4 | 22.2 |

{{% /expand %}}
{{< /expand-wrapper >}}

**Congratulations!** You've learned the basics of querying data in InfluxDB.
For a deep dive into all the ways you can query InfluxDB, see the
[Query data in InfluxDB](/influxdb/version/query-data/) section of documentation.

Let's move on to more advanced data processing queries and automating queries
with InfluxDB tasks.

{{< page-nav prev="/influxdb/version/get-started/write/" next="/influxdb/version/get-started/process/" keepTab=true >}}
