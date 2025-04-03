
The [InfluxDB v2 API](/influxdb/version/reference/api) provides a programmatic interface for all interactions with InfluxDB.
To query InfluxDB {{< current-version >}}, do one of the following:

- Send a Flux query request to the [`/api/v2/query`](/influxdb/version/api/#operation/PostQueryAnalyze) endpoint.
- Send an InfluxQL query request to the [/query 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/query/).

In your request, set the following:

- Your organization via the `org` or `orgID` URL parameters.
- `Authorization` header to `Token ` + your API token.
- `Accept` header to `application/csv`.
- `Content-type` header to `application/vnd.flux` (Flux only) or `application/json` (Flux or InfluxQL).
- Query in Flux or InfluxQL with the request's raw data.

{{% note %}}
#### Use gzip to compress the query response

To compress the query response, set the `Accept-Encoding` header to `gzip`.
This saves network bandwidth, but increases server-side load.

We recommend only using gzip compression on responses that are larger than 1.4 KB.
If the response is smaller than 1.4 KB, gzip encoding will always return a 1.4 KB
response, despite the uncompressed response size.
1500 bytes (~1.4 KB) is the maximum transmission unit (MTU) size for the public
network and is the largest packet size allowed at the network layer.
{{% /note %}}

#### Flux - Example query request

Below is an example `curl` request that sends a Flux query to InfluxDB {{< current-version >}}:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Without compression](#)
[With compression](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
curl --request POST \
  http://localhost:8086/api/v2/query?orgID=INFLUX_ORG_ID  \
  --header 'Authorization: Token INFLUX_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --data 'from(bucket:"example-bucket")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl --request POST \
  http://localhost:8086/api/v2/query?orgID=INFLUX_ORG_ID \
  --header 'Authorization: Token INFLUX_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --header 'Accept-Encoding: gzip' \
  --data 'from(bucket:"example-bucket")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### InfluxQL - Example query request

Below is an example `curl` request that sends an InfluxQL query to InfluxDB {{< current-version >}}:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Without compression](#)
[With compression](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
curl --request -G http://localhost:8086/query?orgID=INFLUX_ORG_ID&database=MyDB&retention_policy=MyRP \
  --header 'Authorization: Token INFLUX_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/json' \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl --request -G http://localhost:8086/query?orgID=INFLUX_ORG_ID&database=MyDB&retention_policy=MyRP \
  --header 'Authorization: Token INFLUX_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/json' \
  --header 'Accept-Encoding: gzip' \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

InfluxDB returns the query results in [annotated CSV](/influxdb/version/reference/syntax/annotated-csv/).
