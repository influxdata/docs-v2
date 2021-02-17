---
title: http.endpoint() function
description: >
  The `http.endpoint()` function sends output data to an HTTP URL using the POST request method.
aliases:
  - /influxdb/v2.0/reference/flux/functions/http/endpoint/
  - /influxdb/v2.0/reference/flux/stdlib/http/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/http/endpoint/
menu:
  flux_0_x_ref:
    name: http.endpoint
    parent: http
weight: 202
flux/v0.x/tags: [notification endpoints]
introduced: 0.39.0
---

The `http.endpoint()` function sends output data to an HTTP URL using the POST request method.

_**Function type:** Output_

```js
import "http"

http.endpoint(
  url: "http://localhost:1234/"
)
```

## Parameters

### url
The URL to POST to.

_**Data type:** String_

### mapFn
A function that builds the record used to generate the POST request.

{{% note %}}
_You should rarely need to override the default `mapFn` parameter.
To see the default `mapFn` value or for insight into possible overrides, view the
[`http.endpoint()` source code](https://github.com/influxdata/flux/blob/master/stdlib/http/http.flux)._
{{% /note %}}

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns a record that must include the following fields:

- `headers`
- `data`

_For more information, see [`http.post()`](/flux/v0.x/stdlib/http/post/)_
