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
_**Output data type:** Record_

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

## Parameters

{{% note %}}
[host](#host), [org](#org) or [orgID](#orgid), and [token](#token) parameters
are only required when querying data from a **different organization** or a
**remote InfluxDB instance**.
{{% /note %}}

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
