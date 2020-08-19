---
title: from() function
description: The `from()` function retrieves data from an InfluxDB data source.
aliases:
  - /v2.0/reference/flux/functions/inputs/from
  - /v2.0/reference/flux/functions/built-in/inputs/from/
menu:
  influxdb_2_0_ref:
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
_**Output data type:** Object_

```js
from(bucket: "example-bucket")

// OR

from(bucketID: "0261d8287f4d6000")
```

## Parameters

### bucket
The name of the bucket to query.

_**Data type:** String_

### bucketID
The string-encoded ID of the bucket to query.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
```
```js
from(bucketID: "0261d8287f4d6000")
```
[FROM]()
