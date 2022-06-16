---
title: prometheus.scrape() function
description: >
  `prometheus.scrape()` scrapes Prometheus metrics from an HTTP-accessible endpoint and returns
  them as a stream of tables.
menu:
  flux_0_x_ref:
    name: prometheus.scrape
    parent: experimental/prometheus
    identifier: experimental/prometheus/scrape
weight: 201
flux/v0.x/tags: [inputs, prometheus]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/prometheus/prometheus.flux#L33-L33

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`prometheus.scrape()` scrapes Prometheus metrics from an HTTP-accessible endpoint and returns
them as a stream of tables.



##### Function type signature

```js
prometheus.scrape = (url: string) => stream[A] where A: Record
```

## Parameters

### url

({{< req >}})
URL to scrape Prometheus metrics from.


## Examples


### Scrape InfluxDB OSS internal metrics

```js
import "experimental/prometheus"

prometheus.scrape(url: "http://localhost:8086/metrics")
```

