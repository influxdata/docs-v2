
Use compatibility APIs when you need to migrate existing InfluxDB v1 or v2 write
workloads to InfluxDB 3.x.
The `/api/v2/write` (v2-compatible) and `/write` (v1-compatible) HTTP API
endpoints work with InfluxDB [client libraries](/influxdb3/version/reference/client-libraries/), [Telegraf](/telegraf/v1/), and third-party integrations 
to write points as line protocol data to {{% product-name %}}.

> [!Note]
> #### Compatibility APIs differ from native APIs
> 
> Keep in mind that the compatibility APIs differ from the v1 and v2 APIs in previous versions in the following ways:
>
> - Tags in a table (measurement) are _immutable_
> - A tag and a field can't have the same name within a table.

## InfluxDB v2 compatibility

The `/api/v2/write` InfluxDB v2 compatibility endpoint provides backwards
compatibility with clients that can write data to InfluxDB OSS v2.x and Cloud 2 (TSM).

{{<api-endpoint endpoint="/api/v2/write?bucket=mydb&precision=ns" method="post" api-ref="/influxdb3/version/api/v3/#operation/PostV1Write" >}}


## InfluxDB v1 compatibility

The `/write` InfluxDB v1 compatibility endpoint provides backwards compatibility with clients that can write data to InfluxDB v1.x.

{{<api-endpoint endpoint="/write?db=mydb&precision=ns" method="post" api-ref="/influxdb3/version/api/v3/#operation/PostV2Write" >}}

