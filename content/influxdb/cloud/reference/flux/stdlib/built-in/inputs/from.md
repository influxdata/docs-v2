---
title: from() function
description: The `from()` function retrieves data from an InfluxDB data source.
aliases:
  - /influxdb/cloud/reference/flux/functions/inputs/from
  - /influxdb/cloud/reference/flux/functions/built-in/inputs/from/
menu:
  influxdb_cloud_ref:
    name: from
    parent: built-in-inputs
weight: 401
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/data_exploration/#from-clause, InfluxQL - FROM
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
  orgID: "example-org",
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
_See [InfluxDB URLs](/influxdb/cloud/reference/urls/)._

_**Data type:** String_

### org
Organization name.

_**Data type:** String_

### orgID
String-encoded [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id) to query.

_**Data type:** String_

### token
InfluxDB [authentication token](/influxdb/cloud/security/tokens/).

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
