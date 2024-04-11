---
title: from() function
description: >
  `from()` retrieves data from an InfluxDB bucket between the `start` and `stop` times.
menu:
  flux_v0_ref:
    name: from
    parent: contrib/jsternberg/influxdb
    identifier: contrib/jsternberg/influxdb/from
weight: 301
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/influxdb/influxdb.flux#L83-L111

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`from()` retrieves data from an InfluxDB bucket between the `start` and `stop` times.

This version of `from` is equivalent to `from() |> range()` in a single call.

##### Function type signature

```js
(
    bucket: string,
    start: A,
    ?host: string,
    ?org: string,
    ?stop: B,
    ?token: string,
) => stream[{
    C with
    _value: D,
    _time: time,
    _stop: time,
    _start: time,
    _measurement: string,
    _field: string,
}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket
({{< req >}})
Name of the bucket to query.

**InfluxDB 1.x or Enterprise**: Provide an empty string (`""`).

### start
({{< req >}})
Earliest time to include in results.

Results include points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop

Latest time to include in results. Default is `now()`.

Results exclude points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### host

URL of the InfluxDB instance to query.

See [InfluxDB OSS URLs](/influxdb/latest/reference/urls/)
or [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/).

### org

Organization name.



### token

InfluxDB [API token](/influxdb/latest/security/tokens/).




## Examples

- [Query using the bucket name](#query-using-the-bucket-name)
- [Query using the bucket ID](#query-using-the-bucket-id)
- [Query a remote InfluxDB Cloud instance](#query-a-remote-influxdb-cloud-instance)

### Query using the bucket name

```js
import "contrib/jsternberg/influxdb"

influxdb.from(bucket: "example-bucket")

```


### Query using the bucket ID

```js
import "contrib/jsternberg/influxdb"

influxdb.from(bucketID: "0261d8287f4d6000")

```


### Query a remote InfluxDB Cloud instance

```js
import "contrib/jsternberg/influxdb"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUXDB_CLOUD_TOKEN")

from(
    bucket: "example-bucket",
    host: "https://us-west-2-1.aws.cloud2.influxdata.com",
    org: "example-org",
    token: token,
)

```

