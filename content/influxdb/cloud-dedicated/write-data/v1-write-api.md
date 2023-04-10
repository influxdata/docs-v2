---
title: Write data to InfluxDB Cloud Dedicated (Single-tenant) with the v1 API /write endpoint
list_title: Write data with the v1 API /write endpoint
description: >
  Use the v1 API /write endpoint to write time series data to InfluxDB Cloud Dedicated.
weight: 3
menu:
  influxdb_cloud_dedicated:
    name: Write data with the v1 API
influxdb/cloud-dedicated/tags: [write, line protocol]
# related:
#   - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
#   - /influxdb/cloud/reference/syntax/line-protocol
#   - /influxdb/cloud/reference/syntax/annotated-csv
#   - /influxdb/cloud/reference/cli/influx/write
#   - /resources/videos/ingest-data/, How to Ingest Data in InfluxDB (Video)
---

Write data with the InfluxDB v1 API `/write` endpoint for InfluxDB Cloud:
  - Use your existing InfluxDB v1 write workloads.
  - Send v1 API requests from the Telegraf v1 Output Plugin or your own code.
  <!-- v1 SAMPLE CODE -->
    - Authentication and authorization
    - Supports Basic Auth.
      - Use a Database Token as your Basic Auth password.
    - Responses
  - Use Telegraf with the v1 API write endpoint
  - Use the v1 API write endpoint

## Use the v1 API /write endpoint

{{% api-endpoint endpoint="/write" method="post"%}}

### v1 API parameters for InfluxDB Cloud Dedicated

Name               | Allowed in  | Ignored | Value
-------------------|-------------|---------|---------------------------------------------------------------------------------
`db`               | Query param | Honored | Database name
`p`                | Query param | Honored | If using Basic authorization, Database Token with sufficient write privileges
`precision`        | Query param | Honored | One of `n`,`u`,`ms`,`s`,`m`,`h`
`rp`               | Query param | Honored | Honored, but discouraged
`u`                | Query param | Ignored | N/A
`Content-Encoding` | Header      | Honored | `"gzip"` (compressed) or `"identity"` (uncompressed)
`Token`            | Header      | Honored | If using Token authorization, `“Authorization”: ”Token INFLUXDB_DATABASE_TOKEN”`

### Use the v1 API with HTTP clients and custom code

{{% warn %}}
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.
{{% /warn %}}

To test API writes interactively, use common HTTP clients such as cURL and Postman to send requests to the v1 API `/write` endpoint.

The following example shows to use cURL to write line protocol to the v1 API:

```sh
curl -i https://cloud2.influxdata.com/write?db=mydb&precision=s \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```

### v1 CLI (not supported)

Don't use the v1 CLI for writing data to {{% cloud-name %}}.
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.

If you need to test writes interactively, see how to [use the v1 API with HTTP clients and custom code](#use-the-v1-api-with-http-clients-and-custom-code).
