---
title: Parameterize Flux queries
description: >
  Use parameterized queries to ensure reliability and prevent injection attacks
weight: 104
menu:
  influxdb_cloud:
    name: parameterized queries
    parent: Query data
influxdb/cloud/tags: [query]
---

Flux supports parameterized queries in InfluxDB Cloud.
A parameterized query enables you to supply arguments
which are then inserted into the Flux query for it to be executed.

<!-- Parameterized queries can only be used with the InfluxDB v2 API, -->
<!-- but will be landing in the InfluxDB User Interface soon. -->

Parameterized queries also make updating a query to reflect a new bucket, filter or timestamp 
and encourage code reuse.

<!-- Now you can start constructing parameterized queries to secure your IoT application -->
<!-- and help prevent injection attacks. -->

## Example

For the most basic example, we’ll pass in a bucket name as an argument to our parameterized Flux query.
The Flux script looks like this:

```js
from(bucket:params.mybucket) 
|> range(start: -7d) 
|> limit(n:2)","params":{"mybucket":"telegraf"}
```

The Flux engine will replace `params.mybucket` with the bucket name that we want to query.
We specify the value of the mybucket parameter at the end of the Flux query request payload with

```
"params":{"mybucket":"telegraf"} 
```

This will query the `telegraf` bucket.

Since this query must be executed with the API,
we convert the query into JSON to execute the following `curl` request:

```
curl -X POST \
'https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?orgID=<myOrgID>' \
  -H 'authorization: Token <myToken>' \
  -H 'content-type: application/json' \
  -d '{"query":"from(bucket:params.mybucket) |> range(start: -7d) |> limit(n:2)","params":{"mybucket":"telegraf"}}'
```

Typing for parameterized Flux query

Using parameterized Flux queries is pretty straightforward.
Parameterized Flux queries support parameters of int, float, and string types.
However, Flux itself supports more types, such as duration and others.
Therefore, you must make sure to correctly type date parameters.
For example if you want to make a parameter a timestamp, you must convert that value into a duration with the duration() function.
The body of your request should look like this:

```
{"query":"from(bucket:\"telegraf\") |> range(start: duration(v : params.mystart)) |> limit(n:2)","params":{"mystart":"-7d"}}Copy
```
