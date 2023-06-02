---
title: Use the InfluxDB v1 HTTP query API
seotitle: Use InfluxQL and InfluxDB v1 HTTP query API
description: >
  Use the InfluxDB v1 HTTP query API to query data in InfluxDB Cloud Dedicated
  with InfluxQL.
weight: 401
menu:
  influxdb_cloud_dedicated:
    parent: influxql-execute-queries
    name: v1 query API
influxdb/cloud-dedicated/tags: [query, influxql, python]
list_code_example: |
  ```sh
  curl --get https://cluster-id.influxdb.io/query \
    --header "Authorization: Token DATABASE_TOKEN" \
    --data-urlencode "db=DATABASE_NAME" \
    --data-urlencode "q=SELECT * FROM home"
  ```
---

Use the InfluxDB v1 HTTP query API to query data in {{< cloud-name >}}
with InfluxQL.

The examples below use **cURL** to send HTTP requests to the InfluxDB v1 HTTP API,
but you can use any HTTP client.

{{% warn %}}
#### InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/cloud-dedicated/reference/influxql/feature-support/).
{{% /warn %}}

Use the v1 `/query` endpoint and the `GET` request method to query data with InfluxQL:

{{< api-endpoint endpoint="https://cluster-id.influxdb.io/query" method="get" api-ref="/influxdb/cloud-dedicated/api/#tag/Query" >}}

Provide the following with your request:

- **Headers:**
  - **Authorization:** `Bearer DATABASE_TOKEN`
- **Query parameters:**
  - **db**: Database to query
  - **rp**: _(Optional)_ Retention policy to query 
  - **q**: URL-encoded InfluxQL query

```sh
curl --get https://cluster-id.influxdb.io/query \
  --header "Authorization: Token DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```

Replace the following:

- **`DATABASE_NAME`**: Name of the database to query
- **`DATABASE_TOKEN`**: [Database token](/influxdb/cloud-dedicated/admin/tokens/)
  with read permission on the database you want to query

## Return results as JSON or CSV

By default, the `/query` endpoint returns results in **JSON**, but it can also
return results in **CSV**. To return results as CSV, include the `Accept` header
with the `application/csv` or `text/csv` MIME type:

```sh
curl --get https://cluster-id.influxdb.io/query \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```

<!-- 
TO-DO: Explain how DBRP mappings work with bucket names
-->
