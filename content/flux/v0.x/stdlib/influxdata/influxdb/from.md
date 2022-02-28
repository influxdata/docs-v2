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
    token: "MySuP3rSecr3Tt0k3n",
)

// OR

from(
    bucketID: "0261d8287f4d6000",
    host: "https://example.com",
    orgID: "867f3fcf1846f11f",
    token: "MySuP3rSecr3Tt0k3n",
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

## Push down optimizations

Some transformations called after `from()` trigger performance optimizations called pushdowns.
These optimizations are "pushed down" from Flux into the InfluxDB storage layer and where they utilize code in storage to apply the transformation.
Pushdowns happen automatically, but it is helpful understand how these optimizations work so you can better optimize your Flux queries.

Pushdowns require an unbroken and exclusive chain between transformations.
A `from()` call stored in a variable that then goes to multiple pushdowns will
cause none of the pushdowns to be applied. For example:

```js
// Pushdowns are NOT applied
data = from(bucket: "example-bucket")
    |> range(start: -1h)

data |> filter(fn: (r) => r._measurement == "m0") |> yield(name: "m0")
data |> filter(fn: (r) => r._measurement == "m1") |> yield(name: "m1")
```

To reuse code and still apply pushdowns, invoke `from()` in a function and pipe-forward the output of the function into subsequent pushdowns:

```js
// Pushdowns ARE applied
data = () => from(bucket: "example-bucket")
    |> range(start: -1h)

data() |> filter(fn: (r) => r._measurement == "m0") |> yield(name: "m0")
data() |> filter(fn: (r) => r._measurement == "m1") |> yield(name: "m1")
```

### Filter

`filter()` transformations that compare `r._measurement`, `r._field`, `r._value`
or any tag value are pushed down to the storage layer.
Comparisons that use functions do not.
If the function produces a static value, evaluate the function outside of `filter()`.
For example:

```js
import "strings"

// filter() is NOT pushed down
data
    |> filter(fn: (r) => r.example == strings.joinStr(arr: ["foo", "bar"], v: ""))

// filter() is pushed down
exVar = strings.joinStr(arr: ["foo", "bar"], v: ""))

data
    |> filter(fn: (r) => r.example == exVar)
```

Multiple consecutive `filter()` transformations that can be pushed down are
merged together into a single filter that gets pushed down.

### Aggregates

The following aggregate transformations are pushed down:

- `min()`
- `max()`
- `sum()`
- `count()`
- `mean()` (except when used with `group()`)

Aggregates will also be pushed down if they are preceded by a `group()`.
The only exception is `mean()` which cannot be pushed down to the storage layer with `group()`.

### Aggregate Window

Aggregates used with `aggregateWindow()` are pushed down.
Aggregates pushed down with `aggregateWindow()` are not compatible with `group()`.

## Examples

- [Query InfluxDB using the bucket name](#query-using-the-bucket-name)
- [Query InfluxDB using the bucket ID](#query-using-the-bucket-id)
- [Query a remote InfluxDB Cloud instance](#query-a-remote-influxdb-cloud-instance)
- [Query push downs](#query-push-downs)
- [Query from the same bucket to multiple push downs](#query-multiple-push-downs)

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
    token: token,
)
```

### Utilize pushdowns in multiple queries

```js
from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "m0")
    |> filter(fn: (r) => r._field == "f0")
    |> yield(name: "filter-only")

from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "m0")
    |> filter(fn: (r) => r._field == "f0")
    |> max()
    |> yield(name: "max")

from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "m0")
    |> filter(fn: (r) => r._field == "f0")
    |> group(columns: ["t0"])
    |> max()
    |> yield(name: "grouped-max")

from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "m0")
    |> filter(fn: (r) => r._field == "f0")
    |> aggregateWindow(every: 5m, fn: max)
    |> yield(name: "windowed-max")
```

### Query from the same bucket to multiple pushdowns

```js
// Use a function. If you use a variable, this will stop
// Flux from pushing down the operation.
data = () => from(bucket: "example-bucket")
    |> range(start: -1h)

data() |> filter(fn: (r) => r._measurement == "m0")
data() |> filter(fn: (r) => r._measurement == "m1")
```

### Query from the same bucket to multiple transformations

```js
// The push down chain is not broken until after the push down
// is complete. In this case, it is more efficient to use a variable.
data = from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "m0")

data |> derivative() |> yield(name: "derivative")
data |> movingAverage(n: 5) |> yield(name: "movingAverage")
```
