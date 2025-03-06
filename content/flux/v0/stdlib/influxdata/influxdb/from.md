---
title: from() function
description: >
  `from()` queries data from an InfluxDB data source.
menu:
  flux_v0_ref:
    name: from
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/from
weight: 201
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/influxdb.flux#L167-L174

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`from()` queries data from an InfluxDB data source.

It returns a stream of tables from the specified bucket.
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

#### Query remote InfluxDB data sources
Use `from()` to query data from remote **InfluxDB OSS 1.7+**,
**InfluxDB Enterprise 1.9+**, and **InfluxDB Cloud**.
To query remote InfluxDB sources, include the `host`, `token`, and `org`
(or `orgID`) parameters.

#### from() does not require a package import
`from()` is part of the `influxdata/influxdb` package, but is part of the
Flux prelude and does not require an import statement or package namespace.

##### Function type signature

```js
(
    ?bucket: string,
    ?bucketID: string,
    ?host: string,
    ?org: string,
    ?orgID: string,
    ?token: string,
) => stream[{A with _value: B, _time: time, _measurement: string, _field: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket

Name of the bucket to query.
_`bucket` and `bucketID` are mutually exclusive_.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### bucketID

String-encoded bucket ID to query.
_`bucket` and `bucketID` are mutually exclusive_.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### host

URL of the InfluxDB instance to query.

See [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
or [InfluxDB OSS URLs](/influxdb/v2/reference/urls/).

### org

Organization name.
_`org` and `orgID` are mutually exclusive_.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### orgID

String-encoded organization ID to query.
_`org` and `orgID` are mutually exclusive_.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### token

InfluxDB API token.

**InfluxDB 1.x or Enterprise**: If authentication is disabled, provide an
empty string (`""`). If authentication is enabled, provide your InfluxDB
username and password using the `<username>:<password>` syntax.


## Examples

- [Query InfluxDB using the bucket name](#query-influxdb-using-the-bucket-name)
- [Query InfluxDB using the bucket ID](#query-influxdb-using-the-bucket-id)
- [Query a remote InfluxDB Cloud instance](#query-a-remote-influxdb-cloud-instance)

### Query InfluxDB using the bucket name

```js
from(bucket: "example-bucket")

```


### Query InfluxDB using the bucket ID

```js
from(bucketID: "0261d8287f4d6000")

```


### Query a remote InfluxDB Cloud instance

```js
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUXDB_CLOUD_TOKEN")

from(
    bucket: "example-bucket",
    host: "https://us-west-2-1.aws.cloud2.influxdata.com",
    org: "example-org",
    token: token,
)

```

