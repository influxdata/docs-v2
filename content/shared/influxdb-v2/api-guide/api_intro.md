
InfluxDB offers a rich API and [client libraries](/influxdb/version/api-guide/client-libraries) ready to integrate with your application. Use popular tools like Curl and [Postman](/influxdb/version/api-guide/postman) for rapidly testing API requests.

This section guides you through the most commonly used API methods.

For detailed documentation on the entire API, see the [InfluxDB v2 API Reference](/influxdb/version/reference/api/#influxdb-v2-api-documentation).

> [!Tip]
> #### Use {{< current-version >}} API with InfluxDB 1.x clients
> If you need to use InfluxDB {{< current-version >}} with **InfluxDB 1.x** API clients and integrations, see the [1.x compatibility guide](/influxdb/version/reference/api/influxdb-1x/).

## Bootstrap your application

With most API requests, you'll need to provide a minimum of your InfluxDB URL and Authorization Token (API Token).

[Install InfluxDB OSS v2.x](/influxdb/version/install/) or upgrade to
an [InfluxDB Cloud account](/influxdb/cloud/sign-up).

### Authentication

InfluxDB uses [API tokens](/influxdb/version/admin/tokens/) to authorize API requests.

1. Before exploring the API, use the InfluxDB UI to
[create an initial API token](/influxdb/version/admin/tokens/create-token/) for your application.

2. Include your API token in an `Authorization: Token YOUR_API_TOKEN` HTTP header with each request.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v2.0/auth/oss/token-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v2.0/auth/oss/token-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Postman is another popular tool for exploring APIs. See how to [send authenticated requests with Postman](/influxdb/version/tools/postman/#send-authenticated-api-requests-with-postman).

## Buckets API

Before writing data you'll need to create a Bucket in InfluxDB.
[Create a bucket](/influxdb/version/admin/buckets/create-bucket/#create-a-bucket-using-the-influxdb-api) using an HTTP request to the InfluxDB API `/buckets` endpoint.

```sh
{{% get-shared-text "api/v2.0/buckets/oss/create.sh" %}}
```

## Write API

[Write data to InfluxDB](/influxdb/version/write-data/developer-tools/api/) using an HTTP request to the InfluxDB API `/api/v2/write` endpoint.

## Query API

[Query from InfluxDB](/influxdb/version/query-data/execute-queries/influx-api/) using an HTTP request to the `/api/v2/query` endpoint.
