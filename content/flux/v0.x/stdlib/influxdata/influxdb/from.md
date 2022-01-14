---
title: from() function
description: The `from()` function retrieves data from an InfluxDB data source.
aliases:
  - /flux/v0.x/stdlib/universe/from
  - /influxdb/v2.0/reference/flux/functions/inputs/from
  - /influxdb/v2.0/reference/flux/functions/built-in/inputs/from/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from/
  - /influxdb/cloud/reference/flux/stdlib/built-in/inputs/from/
menu:
  flux_0_x_ref:
    name: from
    parent: influxdb-pkg
weight: 301
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
#### from() does not require a package import
`from()` is part of the `influxdata/influxdb` package, but is included with the
[`universe` package](/flux/v0.x/stdlib/universe/) by default and does not require
an import statement or package namespace.
{{% /note %}}

{{% note %}}
#### Query remote InfluxDB data sources
Use `from()` to retrieve data from remote InfluxDB OSS 1.7+, InfluxDB Enterprise 1.9+, and InfluxDB Cloud.
To query remote InfluxDB sources, include the [host](#host), [token](#token), and
[org](#org) (or [orgID](#orgid)) parameters.
{{% /note %}}

## Parameters

### bucket {data-type="string"}
Name of the bucket to query.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### bucketID {data-type="string"}
String-encoded bucket ID to query.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### host {data-type="string"}
URL of the InfluxDB instance to query.
_See [InfluxDB URLs](/{{< latest "influxdb" >}}/reference/urls/) or
[InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)._

### org {data-type="string"}
Organization name.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### orgID {data-type="string"}
String-encoded [organization ID](/{{< latest "influxdb" >}}/organizations/view-orgs/#view-your-organization-id) to query.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### token {data-type="string"}
InfluxDB [API token](/{{< latest "influxdb" >}}/security/tokens/).

**InfluxDB 1.x or Enterprise**:
If authentication is _disabled_, provide an empty string (`""`).
If authentication is _enabled_, provide your InfluxDB username and password
using the `<username>:<password>` syntax.

## Examples

- [Query InfluxDB using the bucket name](#query-using-the-bucket-name)
- [Query InfluxDB using the bucket ID](#query-using-the-bucket-id)
- [Query a remote InfluxDB Cloud instance](#query-a-remote-influxdb-cloud-instance)

#### Query using the bucket name
```js
from(bucket: "example-bucket")
```

#### Query using the bucket ID
```js
from(bucketID: "0261d8287f4d6000")
```

#### Query a remote InfluxDB Cloud instance
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
