---
title: InfluxDB v2 API
description: >
  The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
  Access the InfluxDB API using the `/api/v2/` endpoint.
menu: v2_0_ref
weight: 3
v2.0/tags: [api]
---

The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
Access the InfluxDB API using the `/api/v2/` endpoint.

## Authentication
InfluxDB uses [authentication tokens](/v2.0/security/tokens/) to authorize API requests.
Include your authentication token as an `Authorization` header in each request.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[InfluxDB OSS](#)
[InfluxDB Cloud](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
curl --request POST \
  --url http://localhost:9999/api/v2/write?org=my-org&bucket=example-bucket \
  --header 'Authorization: Token YOURAUTHTOKEN'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# Use the hostname of your InfluxDB Cloud UI
curl --request POST \
  --url https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/write?org=my-org&bucket=example-bucket \
  --header 'Authorization: Token YOURAUTHTOKEN'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## View InfluxDB v2 API Documentation
<a class="btn" href="/v2.0/api/">InfluxDB v2.0 API documentation</a>

### View InfluxDB API documentation locally
InfluxDB API documentation is built into the `influxd` service and represents
the API specific to the current version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/v2.0/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser: [us-west-2-1.aws.cloud2.influxdata.com/docs](https://us-west-2-1.aws.cloud2.influxdata.com/docs) (Cloud) or [localhost:9999/docs](http://localhost:9999/docs) (OSS).
_For specific InfluxDB Cloud provider and region URLs, see [InfluxDB Cloud URLs](/v2.0/cloud/urls/)._. 

## InfluxDB client libraries
InfluxDB client libraries are language-specific packages that integrate with the InfluxDB v2 API.
For information about supported client libraries, see [InfluxDB client libraries](/v2.0/reference/api/client-libraries/).
