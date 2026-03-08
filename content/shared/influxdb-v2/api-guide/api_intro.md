
InfluxDB offers a rich API and [client libraries](/influxdb/version/api-guide/client-libraries) ready to integrate with your application. Use popular tools like Curl and [Postman](/influxdb/version/api-guide/postman) for rapidly testing API requests.

This section guides you through the most commonly used API methods.

For detailed documentation on the entire API, see the [InfluxDB v2 API Reference](/influxdb/version/reference/api/#influxdb-v2-api-documentation).

> [!Tip]
> #### Use InfluxDB 1.x API clients with {{< current-version >}}
> If you need to use InfluxDB {{< current-version >}} with **InfluxDB 1.x** API clients and integrations, see the [1.x compatibility guide](/influxdb/version/reference/api/influxdb-1x/).

## Bootstrap your application

With most API requests, you'll need to provide a minimum of your InfluxDB URL and [Authorization Token (API Token)](/influxdb/version/admin/tokens/).

[Install InfluxDB OSS v2.x](/influxdb/v2/install/) or upgrade to
an [InfluxDB Cloud account](/influxdb/cloud/sign-up).

### Authentication

InfluxDB uses [API tokens](/influxdb/version/admin/tokens/) to authorize API requests.
InfluxDB filters API requests and response data based on the permissions associated with the token.

1. Before exploring the API, use the `influx` CLI or the InfluxDB UI to
[create an initial API token](/influxdb/version/admin/tokens/create-token/) for your application.

1. Include your API token in an `Authorization: Token API_TOKEN` HTTP header with each request--for example:

{{% code-placeholders "API_TOKEN" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
# Use a token to authorize a GET request to the InfluxDB API.
# List buckets in your organization that the token can read.
curl -X GET "http://{{< influxdb/host >}}/api/v2/buckets" \
  --header 'Accept: application/json' \
  --header 'Authorization: Token API_TOKEN'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
/**
  * Use a token to authorize a GET request to the InfluxDB API.
  * List buckets in your organization that the token can read.
  */

const https = require('https');

function listBuckets() {

  const options = {
    host: '{{< influxdb/host >}}',
    path: "/api/v2/buckets",
    headers: {
      'Authorization': 'Token API_TOKEN',
      'Content-type': 'application/json'
    },
  };

  const request = https.get(options, (response) => {
    let rawData = '';
    response.on('data', () => {
      response.on('data', (chunk) => { rawData += chunk; });
    })
    response.on('end', () => {
      console.log(rawData);
    })
  });

  request.end();
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

> [!Note]
> Postman is another popular tool for exploring APIs.
> See how to [send authenticated requests with Postman](/influxdb/version/tools/postman/#send-authenticated-api-requests-with-postman).

## Buckets API

Before writing data you'll need to create a bucket in your InfluxDB instance.
To use the API to create a bucket, send a request to the following endpoint:

{{% api-endpoint method="POST" endpoint="/api/v2/buckets" api-ref="/influxdb/version/api/v2/#post-/api/v2/buckets" %}}

{{% code-placeholders "API_TOKEN|ORG_ID|BUCKET_NAME|RETENTION_PERIOD_SECONDS" %}}

```bash
curl --request POST \
  "http://localhost:8086/api/v2/buckets" \
  --header "Authorization: Token API_TOKEN" \
  --json '{
    "orgID": "'"ORG_ID"'",
    "name": "BUCKET_NAME",
    "retentionRules": [
      {
        "type": "expire",
        "everySeconds": RETENTION_PERIOD_SECONDS,
        "shardGroupDurationSeconds": 0
      }
    ]
  }'
```

{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}} - your [token](/influxdb/version/admin/tokens/).
- {{% code-placeholder-key %}}`ORG_ID`{{% /code-placeholder-key %}} - the ID of the [organization](/influxdb/version/admin/organizations/) that owns the bucket.
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}} - the name of the [bucket](/influxdb/version/admin/buckets/) to create.
- Optional: {{% code-placeholder-key %}}`RETENTION_PERIOD_SECONDS`{{% /code-placeholder-key %}} - the [retention period](/influxdb/version/reference/glossary/#retention-period) (in number of seconds) to retain data in the bucket. Default is `0` (infinite retention).
  - For example, `31536000` (1 year) or `604800` (7 days).

For more information, see [Create a bucket](/influxdb/version/admin/buckets/create-bucket/#create-a-bucket-using-the-influxdb-api).

## Write API

[Write data to InfluxDB](/influxdb/version/write-data/developer-tools/api/) using an HTTP request to the InfluxDB API `/api/v2/write` endpoint.

## Query API

[Query from InfluxDB](/influxdb/version/query-data/execute-queries/influx-api/) using an HTTP request to the `/api/v2/query` endpoint.
