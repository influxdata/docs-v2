---
title: influxdb.buckets() function
description: >
  `influxdb.buckets()` returns a list of buckets in the specified organization.
menu:
  flux_0_x_ref:
    name: influxdb.buckets
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/buckets
weight: 201
flux/v0.x/tags: [metadata]
introduced: 0.16.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/influxdb.flux#L368-L379

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`influxdb.buckets()` returns a list of buckets in the specified organization.



##### Function type signature

```js
influxdb.buckets = (
    ?host: string,
    ?org: string,
    ?orgID: string,
    ?token: string,
) => stream[{
    retentionPolicy: string,
    retentionPeriod: int,
    organizationID: string,
    name: string,
    id: string,
}]
```

## Parameters

### org

Organization name. Default is the current organization.

_`org` and `orgID` are mutually exclusive_.

### orgID

Organization ID. Default is the ID of the current organization.

_`org` and `orgID` are mutually exclusive_.

### host

URL of the InfluxDB instance.

See [InfluxDB Cloud regions](https://docs.influxdata.com/influxdb/cloud/reference/regions/)
or [InfluxDB OSS URLs](https://docs.influxdata.com/influxdb/latest/reference/urls/).
_`host` is required when `org` or `orgID` are specified._

### token

InfluxDB API token.

_`token` is required when `host`, `org, or `orgID` are specified._


## Examples

### List buckets in an InfluxDB organization

```js
buckets(org: "example-org", host: "http://localhost:8086", token: "mYSuP3rSecR37t0k3N")
```

