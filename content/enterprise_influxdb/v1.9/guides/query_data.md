---
title: Query data with the InfluxDB API
description: Query data with Flux and InfluxQL in the InfluxDB API.
alias:
  -/docs/v1.8/query_language/querying_data/
menu:
  enterprise_influxdb_1_9:
    weight: 20
    parent: Guides
aliases:
  - /enterprise_influxdb/v1.9/guides/querying_data/
v2: /influxdb/v2.0/query-data/
---


The InfluxDB API is the primary means for querying data in InfluxDB (see the [command line interface](/enterprise_influxdb/v1.9/tools/use-influx/) and [client libraries](/enterprise_influxdb/v1.9/tools/api_client_libraries/) for alternative ways to query the database).

Query data with the InfluxDB API using [Flux](#query-data-with-flux) or [InfluxQL](#query-data-with-influxql).

> **Note**: The following examples use `curl`, a command line tool that transfers data using URLs. Learn the basics of `curl` with the [HTTP Scripting Guide](https://curl.haxx.se/docs/httpscripting.html).

## Query data with Flux

For Flux queries, the `/api/v2/query` endpoint accepts `POST` HTTP requests. Use the following HTTP headers:
- `Accept: application/csv`
- `Content-type: application/vnd.flux`

If you have authentication enabled, provide your InfluxDB username and password with the `Authorization` header and `Token` schema. For example: `Authorization: Token username:password`.


The following example queries Telegraf data using Flux:
:

```bash
$ curl -XPOST localhost:8086/api/v2/query -sS \
  -H 'Accept:application/csv' \
  -H 'Content-type:application/vnd.flux' \
  -d 'from(bucket:"telegraf")
        |> range(start:-5m)
        |> filter(fn:(r) => r._measurement == "cpu")'  
```
Flux returns [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/):

```
{,result,table,_start,_stop,_time,_value,_field,_measurement,cpu,host
,_result,0,2020-04-07T18:02:54.924273Z,2020-04-07T19:02:54.924273Z,2020-04-07T18:08:19Z,4.152553004641827,usage_user,cpu,cpu-total,host1
,_result,0,2020-04-07T18:02:54.924273Z,2020-04-07T19:02:54.924273Z,2020-04-07T18:08:29Z,7.608695652173913,usage_user,cpu,cpu-total,host1
,_result,0,2020-04-07T18:02:54.924273Z,2020-04-07T19:02:54.924273Z,2020-04-07T18:08:39Z,2.9363988504310883,usage_user,cpu,cpu-total,host1
,_result,0,2020-04-07T18:02:54.924273Z,2020-04-07T19:02:54.924273Z,2020-04-07T18:08:49Z,6.915093159934975,usage_user,cpu,cpu-total,host1}
```

The header row defines column labels for the table. The `cpu` [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) has four points, each represented by one of the record rows. For example the first point has a [timestamp](/enterprise_influxdb/v1.9/concepts/glossary/#timestamp) of `2020-04-07T18:08:19`.  

### Flux

Check out the [Get started with Flux](/influxdb/v2.0/query-data/get-started/) to learn more about building queries with Flux.
For more information about querying data with the InfluxDB API using Flux, see the [API reference documentation](/enterprise_influxdb/v1.9/tools/api/#influxdb-2-0-api-compatibility-endpoints).

## Query data with InfluxQL

To perform an InfluxQL query, send a `GET` request to the `/query` endpoint, set the URL parameter `db` as the target database, and set the URL parameter `q` as your query.
You can also use a `POST` request by sending the same parameters either as URL parameters or as part of the body with `application/x-www-form-urlencoded`.
The example below uses the InfluxDB API to query the same database that you encountered in [Writing Data](/enterprise_influxdb/v1.9/guides/writing_data/).

```bash
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb" --data-urlencode "q=SELECT \"value\" FROM \"cpu_load_short\" WHERE \"region\"='us-west'"
```

InfluxDB returns JSON:


```json
{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "cpu_load_short",
                    "columns": [
                        "time",
                        "value"
                    ],
                    "values": [
                        [
                            "2015-01-29T21:55:43.702900257Z",
                            2
                        ],
                        [
                            "2015-01-29T21:55:43.702900257Z",
                            0.55
                        ],
                        [
                            "2015-06-11T20:46:02Z",
                            0.64
                        ]
                    ]
                }
            ]
        }
    ]
}
```

> **Note:** Appending `pretty=true` to the URL enables pretty-printed JSON output.
While this is useful for debugging or when querying directly with tools like `curl`, it is not recommended for production use as it consumes unnecessary network bandwidth.

### InfluxQL

Check out the [Data Exploration page](/enterprise_influxdb/v1.9/query_language/explore-data/) to get acquainted with InfluxQL.
For more information about querying data with the InfluxDB API using InfluxQL, see the [API reference documentation](/enterprise_influxdb/v1.9/tools/api/#influxdb-1-x-http-endpoints).
