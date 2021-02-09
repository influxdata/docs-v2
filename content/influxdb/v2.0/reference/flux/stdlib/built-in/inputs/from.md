---
title: from() function
description: The `from()` function retrieves data from an InfluxDB data source.
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs/from
  - /influxdb/v2.0/reference/flux/functions/built-in/inputs/from/
menu:
  influxdb_2_0_ref:
    name: from
    parent: built-in-inputs
weight: 401
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#from-clause, InfluxQL - FROM
---

The `from()` function retrieves data from an InfluxDB data source.
It returns a stream of tables from the specified [bucket](#parameters).
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

_**Function type:** Input_  

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

### bucket
Name of the bucket to query.

_**Data type:** String_

### bucketID
String-encoded bucket ID to query.

_**Data type:** String_

### host
URL of the InfluxDB instance to query.
_See [InfluxDB URLs](/influxdb/v2.0/reference/urls/)._

_**Data type:** String_

### org
Organization name.

_**Data type:** String_

### orgID
String-encoded [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) to query.

_**Data type:** String_

### token
InfluxDB [authentication token](/influxdb/v2.0/security/tokens/).

_**Data type:** String_

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
