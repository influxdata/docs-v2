---
title: Flux BigPanda package
list_title: bigpanda package
description: >
  The Flux BigPanda package provides functions that send alerts to
  [BigPanda](https://www.bigpanda.io/).
menu:
  flux_0_x_ref:
    name: bigpanda
    parent: rhajek
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/bigpanda/
  - /influxdb/cloud/reference/flux/stdlib/contrib/bigpanda/
flux/v0.x/tags: [functions, bigpanda, package]
---

The Flux BigPanda package provides functions that send alerts to
[BigPanda](https://www.bigpanda.io/).
Import the `contrib/rhajek/bigpanda` package:

```js
import "contrib/rhajek/bigpanda"
```

## Options
The BigPanda package provides the following options:

- [defaultURL](#defaulturl)
- [defaultTokenPrefix](#defaulttokenprefix)

```js
import "contrib/rhajek/bigpanda"

option bigpanda.defaultUrl = "https://api.bigpanda.io/data/v2/alerts"
option bigpanda.defaultTokenPrefix = "Bearer"
```

### defaultUrl
The default [BigPanda alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works)
for functions in the BigPanda package.
Default is `https://api.bigpanda.io/data/v2/alerts`.

### defaultTokenPrefix
The default HTTP authentication schema to use when authenticating with BigPanda.
Default is `Bearer`.

## Functions
{{< children type="functions" show="pages" >}}

## Send alert timestamps to BigPanda
Sending alert timestamps to BigPanda is optional, but if you choose to send them,
convert timestamps to **epoch second timestamps**:

```js
//
  |> map(fn: (r) => ({ r with secTime: int(v: r._time) / 1000000000 }))
```

{{% note %}}
#### Package author and maintainer
**Github:** [@rhajek](https://github.com/rhajek), [@bonitoo-io](https://github.com/bonitoo-io)
{{% /note %}}
