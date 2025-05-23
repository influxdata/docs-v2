
The [InfluxDB v2 API](/influxdb/version/reference/api) provides a programmatic interface for all interactions with InfluxDB.
To query InfluxDB {{< current-version >}}, do one of the following:

- [Send a Flux query request](#send-a-flux-query-request)
- [Send an InfluxQL query request](#send-an-influxql-query-request)

## Send a Flux query request

Send a Flux query request to the following endpoint:

{{% api-endpoint method="POST" endpoint="/api/v2/query" api-ref="/influxdb/version/api/#operation/PostQueryAnalyze" %}}

In your request, set the following:

- Your organization via the `org` or `orgID` URL parameters
- Headers:
  - `Authorization: Token <API_TOKEN>`
  - `Accept: application/csv`
  - `Content-type: application/vnd.flux`
- Your Flux query text in the request body

> [!Note]
> #### Use gzip to compress a large query response
> 
> To compress the query response, set the `Accept-Encoding` header to `gzip`.
> This saves network bandwidth, but increases server-side load.
> 
> We recommend only using gzip compression on responses that are larger than 1.4 KB.
> If the response is smaller than 1.4 KB, gzip encoding will always return a 1.4 KB
> response, despite the uncompressed response size.
> 1500 bytes (~1.4 KB) is the maximum transmission unit (MTU) size for the public
> network and is the largest packet size allowed at the network layer.

#### Flux - Example query request

The following example shows how to use cURL to send a Flux query to InfluxDB {{< current-version >}}:

{{% code-placeholders "ORG_ID|API_TOKEN|BUCKET_NAME" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Without compression](#)
[With compression](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
curl \
  --request POST \
  http://{{< influxdb/host >}}/api/v2/query?orgID=ORG_ID  \
  --header 'Authorization: Token API_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --data 'from(bucket:"BUCKET_NAME")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl \
  --request POST \
  http://{{< influxdb/host >}}/api/v2/query?orgID=ORG_ID \
  --header 'Authorization: Token API_TOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --header 'Accept-Encoding: gzip' \
  --data 'from(bucket:"BUCKET_NAME")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

Replace the following with your values:

- {{% code-placeholder-key %}}`ORG_ID`{{% /code-placeholder-key %}} - the ID of the [organization](/influxdb/version/admin/organizations/) that owns the bucket.
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}} - your [token](/influxdb/version/admin/tokens/).
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}} - the name of the [bucket](/influxdb/version/admin/buckets/) to create.

## Send an InfluxQL query request

To query InfluxDB {{< current-version >}} using the [InfluxQL query language](/influxdb/v2/reference/syntax/influxql/), send a request to the v1-compatible API endpoint:

{{% api-endpoint method="GET" endpoint="/query" api-ref="/influxdb/v2/api/v2/#operation/GetLegacyQuery" %}}

{{% api-endpoint method="POST" endpoint="/query" api-ref="/influxdb/v2/api/v2/#operation/PostQueryV1" %}}

In your request, set the following:

- [1.x-compatible or 2.x authentication](/influxdb/v2/api-guide/influxdb-1x/#authentication) credentials
- Headers:
  - `Accept: application/csv` or `Accept: application/json`
  - `Content-type: application/vnd.influxql`
- The database and retention policy mapped to the bucket you want to query
- Your InfluxQL query text

> [!Note]
> If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
> you **must** [manually create a database and retention policy mapping](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings)
> to query that bucket with the `/query` compatibility API.
> Use the `db` and `rp` query parameters to specify the database and retention policy
> for the bucket you want to query.

#### InfluxQL - Example query request

The following example shows how to use cURL to send an InfluxQL query to InfluxDB {{< current-version >}} using v1-compatible authentication:

{{% code-placeholders "API_TOKEN|BUCKET_NAME" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[HTTP POST](#)
[HTTP GET](#)
{{% /code-tabs %}}

{{% code-tab-content %}}

```bash
# 1.x compatible POST request using Basic authentication and InfluxQL
curl --request POST \
  "http://{{< influxdb/host >}}/query?db=BUCKET_NAME&p=API_TOKEN&u=ignored" \
  --header "Content-type: application/vnd.influxql" \
  --data "SELECT * FROM home WHERE time > now() - 1h"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

```bash
# 1.x compatible GET request using Basic authentication and InfluxQL
curl --get "http://{{< influxdb/host >}}/query" \
  --header "Accept: application/json" \
  --data-urlencode "q=SELECT * FROM home WHERE time > now() - 1h" \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "u=ignored" \
  --data-urlencode "p=API_TOKEN"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

Replace the following with your values:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}} - your [token](/influxdb/version/admin/tokens/).
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}} - the name of the [bucket](/influxdb/version/admin/buckets/) to query.

{{% code-placeholders "ORG_ID|API_TOKEN|BUCKET_NAME" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Without compression](#)
[With compression](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
curl --get "http://{{< influxdb/host >}}/query" \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/json' \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "p=API_TOKEN" \
  --data-urlencode "u=ignored" \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

```bash
curl --get "http://{{< influxdb/host >}}/query" \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/json' \
  --header 'Accept-Encoding: gzip' \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "p=API_TOKEN" \
  --data-urlencode "u=ignored" \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

Replace the following with your values:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}} - your [token](/influxdb/version/admin/tokens/).
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}} - the name of the [bucket](/influxdb/version/admin/buckets/) to create.

InfluxDB returns the query results in [annotated CSV](/influxdb/version/reference/syntax/annotated-csv/).
