---
title: from() function
description: The `from()` function retrieves data from an InfluxDB data source.
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs/from
  - /influxdb/v2.0/reference/flux/functions/built-in/inputs/from/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from/
  - /influxdb/cloud/reference/flux/stdlib/built-in/inputs/from/
menu:
  flux_0_x_ref:
    name: from
    parent: universe
weight: 102
flux/v0.x/tags: [inputs]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#from-clause, InfluxQL - FROM
introduced: 0.7.0
---

The `from()` function retrieves data from an InfluxDB data source.
It returns a stream of tables from the specified [bucket](#parameters).
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

```js
from(
  bucket: "example-bucket",
  host: "https://example.com",
  org: "example-org",
  token: "MySuP3rSecr3Tt0k3n"
)

// OR

from(
  bucketID: "0261d8287f4d6000",
  host: "https://example.com",
  orgID: "867f3fcf1846f11f",
  token: "MySuP3rSecr3Tt0k3n"
)
```

{{% note %}}
#### Query remote InfluxDB data sources
Use `from()` to retrieve data from remote InfluxDB 2.0 OSS and InfluxDB Cloud instances.
To query remote InfluxDB sources, include the [host](#host), [token](#token), and
[org](#org) (or [orgID](#orgid)) parameters.

`from()` **cannot retrieve data** from **remote** InfluxDB OSS 1.x or InfluxDB Enterprise 1.x data sources
_(including hosted, single-tenant InfluxDB Enterprise clusters)_.
{{% /note %}}

## Parameters

### bucket {data-type="string"}
Name of the bucket to query.

### bucketID {data-type="string"}
String-encoded bucket ID to query.

### host {data-type="string"}
URL of the InfluxDB instance to query.
_See [InfluxDB URLs](/influxdb/v2.0/reference/urls/)._

### org {data-type="string"}
Organization name.

### orgID {data-type="string"}
String-encoded [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) to query.

### token {data-type="string"}
InfluxDB [authentication token](/influxdb/v2.0/security/tokens/).

## Examples

##### Query using the bucket name
```js
from(bucket: "example-bucket")
```

##### Query using the bucket ID
```js
from(bucketID: "0261d8287f4d6000")
```

##### Query a remote InfluxDB Cloud instance
```js
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUXDB_CLOUD_TOKEN")

from(
  bucket: "example-bucket",
  host: "https://cloud2.influxdata.com",
  org: "example-org",
  token: token
)
```
