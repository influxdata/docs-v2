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

InfluxDB Cloud supports **parameterized Flux queries** that let you dynamically change values in a query using the InfluxDB API.
Parameterized queries make Flux queries more reusable and can also be used to help prevent injection attacks.

{{% note %}}
#### Prevent injection attacks
Use parameterized queries when executing Flux queries with untrusted user input;
for example, in a web or IoT application.
For more information on security and query parameterization,
see the [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html#defense-option-1-prepared-statements-with-parameterized-queries).
While this guide is about SQL, it contains useful general advice.
{{% /note %}}

The InfluxDB Cloud [`/api/v2/query` API endpoint](/influxdb/cloud/api/#operation/PostQuery)
accepts a `params` field in the request body.
The `params` field is a JSON object with key-value pairs where the key is a
parameter name and the value is the parameter value.
For example:

```json
"params": {
  "ex1": "foo",
  "ex2": "bar" 
}
```

InfluxDB Cloud inserts the `params` JSON object into the Flux query as a
[Flux record](/{{< latest "flux" >}}/data-types/composite/record/) named `params`.
Use [dot or bracket notation](/{{< latest "flux" >}}/data-types/composite/record/#reference-values-in-a-record)
to access parameters in the `params` record in your Flux query.
For example, using the example `params` JSON above, the following query

```js
from(bucket: params.ex1)
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == params.ex2)
```

would execute as

```js
from(bucket: "foo")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "bar")
```

## Example

To use a parameterized query, do the following:

1. Create your Flux query.
   Use [dot or bracket notation](/{{< latest "flux" >}}/data-types/composite/record/#reference-values-in-a-record)
   to reference parameters inside the `params`
   record to populate values at query time.
   The following example uses `params.mybucket` to define the bucket name.

    ```js
    from(bucket: params.mybucket)
      |> range(start: -7d)
      |> limit(n:2)
    ```
2. Use the InfluxDB Cloud `/api/v2/query` API endpoint to execute your query.
   Provide the following in your request body:
   
    - **query:** Raw Flux query to execute
    - **params:** JSON object with key-value pairs for each parameter to include in the query.
   
    For example:
   
    ```sh
    curl --request POST \
      'https://cloud2.influxdata.com/api/v2/query?orgID=<YourOrgID>' \
      --header 'authorization: Token <YourAuthToken>' \
      --header 'content-type: application/json' \
      --data '{
        "query":"from(bucket: params.mybucket) |> range(start: -7d) |> limit(n:2)",
        "params":{
          "mybucket":"telegraf"
          }
        }'
    ```

## Supported parameter data types

Parameterized Flux queries support `int`, `float`, and `string` data types.
To convert the supported data types into other [Flux basic data types](/{{< latest "flux" >}}/data-types/basic/),
use [Flux type conversion functions](/{{< latest "flux" >}}/function-types/#type-conversions).

For example, to define the `start` parameter of the `range()` function using a parameterized duration value:

1. Use the `duration()` function to convert the `param` value into a duration:
    
    ```js
    from(bucket:"example-bucket")
      |> range(start: duration(v: params.mystart))
      |> limit(n:2)
    ```

2. In the `param` field of your query request body, format the duration parameter as a string:

    ```json
    {
      "query": "from(bucket:\"example-bucket\") |> range(start: duration(v : params.mystart)) |> limit(n:2)",
      "params": {
        "mystart": "-7d"
      }
    }
    ```
