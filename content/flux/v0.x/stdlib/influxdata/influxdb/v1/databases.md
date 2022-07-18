---
title: v1.databases() function
description: >
  `v1.databases()` returns a list of databases in an InfluxDB 1.x (1.7+) instance.
menu:
  flux_0_x_ref:
    name: v1.databases
    parent: influxdata/influxdb/v1
    identifier: influxdata/influxdb/v1/databases
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/databases/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/databases/
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-databases, SHOW DATABASES in InfluxQL
append:
  block: warn
  content: |
    #### Not supported in the Flux REPL
    `v1` functions can retrieve schema information when executed within
    the context of InfluxDB, but not from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/v1/v1.flux#L122-L134

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`v1.databases()` returns a list of databases in an InfluxDB 1.x (1.7+) instance.

Output includes the following columns:

- **databaseName**: Database name (string)
- **retentionPolicy**: Retention policy name (string)
- **retentionPeriod**: Retention period in nanoseconds (integer)
- **default**: Default retention policy for the database (boolean)

##### Function type signature

```js
(
    ?host: string,
    ?org: string,
    ?orgID: string,
    ?token: string,
) => stream[{
    retentionPolicy: string,
    retentionPeriod: int,
    organizationID: string,
    default: bool,
    databaseName: string,
    bucketID: string,
}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### org

Organization name.



### orgID

Organization ID.



### host

InfluxDB URL. Default is `http://localhost:8086`.



### token

InfluxDB API token.




## Examples

### List databases from an InfluxDB instance

```js
import "influxdata/influxdb/v1"

v1.databases()

```

