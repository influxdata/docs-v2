---
title: Use parameterized Flux queries
description: >
  Use parameterized queries to re-use Flux queries and dynamically populate variables and prevent injection attacks.
weight: 104
menu:
  influxdb_cloud:
    name: Parameterized queries
    parent: Query data
influxdb/cloud/tags: [query, security]
---

Flux supports parameterized queries in InfluxDB Cloud.
Parameterized queries make Flux queries more reusable, and can also be used to help prevent injection attacks

Use parameterized queries to dynamically change values used in a query without having to re-write it.
This feature allows users to define the values of variables in a separate field in a request payload.
A parameterized query enables you to supply arguments which are then inserted into the Flux query for it to be executed.

Use parameterized queries when executing Flux with untrusted user input;
for example, in a web or IoT application.
For more information on security and query parameterization,
see the OWASP [SQL Injection Prevention Cheat Sheet][].
While this guide is about SQL, it contains useful general advice.

## Example

To use a parameterized query, do the following:

1. Create your Flux query.
   ```js
   from(bucket:params.mybucket)
     |> range(start: -7d)
     |> limit(n:2)","params":{"mybucket":"telegraf"}
   ```
   Here we pass in a bucket name as an argument to a parameterized Flux query.
   The Flux engine will replace `params.mybucket` with the bucket name that we want to query.
1. Specify the value of the `mybucket` parameter at the end of the Flux query request payload with `"params":{"mybucket":"telegraf"}`:
    ```js
    from(bucket:params.mybucket)
      |> range(start: -7d)
      |> limit(n:2)","params":{"mybucket":"telegraf"}
    ```
   This will query the `telegraf` bucket.
1. Since this query must be executed with the API, it needs to be in JSON format.
   Schematically, it will look like this:
   ```json
   {
      "query":"from(bucket:params.mybucket) |> range(start: -7d) |> limit(n:2)",
      "params":{
         "mybucket":"telegraf"
      }
   }
   ```
1. Using the `/api/v2/query` endpoint, pass query parameters using the `params` field in the request body.
   Execute the following `curl` request:
   ```
   curl -X POST \
     'https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?orgID=<myOrgID>' \
     -H 'authorization: Token <myToken>' \
     -H 'content-type: application/json' \
     -d '{"query":"from(bucket:params.mybucket) |> range(start: -7d) |> limit(n:2)","params":{"mybucket":"telegraf"}}'
   ```

## Typing for parameterized Flux query

Parameterized Flux queries support parameters of `int`, `float`, and `string` types.
Flux itself supports more types, such as `duration` and others.
Therefore, you must make sure to correctly type date parameters.
For example if you want to make a parameter a timestamp,
you must convert that value into a duration with the `duration()` function.

```js
from(bucket:"telegraf")
  |> range(start: duration(v : params.mystart))
  |> limit(n:2)
```

The JSON body of your request should look like this:

```
{"query":"from(bucket:\"telegraf\") |> range(start: duration(v : params.mystart)) |> limit(n:2)","params":{"mystart":"-7d"}}
```

[SQL Injection Prevention Cheat Sheet]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html#defense-option-1-prepared-statements-with-parameterized-queries
