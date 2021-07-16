---
title: Create a bucket with the InfluxDB API
description: >
  Use the `/buckets` endpoint of the InfluxDB API to create a bucket in InfluxDB.
---

Use the InfluxDB API to create a bucket.

{{% note %}}
#### Bucket limits
A single InfluxDB 2.0 OSS instance supports approximately 20 buckets actively being
written to or queried across all organizations depending on the use case.
Any more than that can adversely affect performance.
{{% /note %}}

Create a bucket in InfluxDB using an HTTP request to the InfluxDB API `/buckets` endpoint.
Use the `POST` request method and include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use `orgID` in the JSON payload.                |
| Bucket               | Use `name` in the JSON payload.                 |
| Retention Rules      | Use `retentionRules` in the JSON payload.    |
| Authentication token | Use the `Authorization: Token` header.                   |

#### Example

The URL depends on the version and location of your InfluxDB 2.0 instance _(see [InfluxDB URLs](/{{< latest "influxdb" >}}/reference/urls/))_.

```sh
{{% get-shared-text "api/v2.0/buckets/oss/create.sh" %}}
```

_For information about **InfluxDB API options and response codes**, see
[InfluxDB API Buckets documentation](/influxdb/v2.0/api/#operation/PostBuckets)._
