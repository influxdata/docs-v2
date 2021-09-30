---
title: Work with Prometheus histograms
list_title: Histogram
description: >
  Use Flux to query and transform Prometheus **histogram** metrics stored in InfluxDB.
  A histogram samples observations (usually things like request durations or
  response sizes) and counts them in configurable buckets.
  It also provides a sum of all observed values.
menu:
  flux_0_x:
    name: Histogram
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
---

Use Flux to query and transform Prometheus **histogram** metrics stored in InfluxDB.

> A _histogram_ samples observations (usually things like request durations or
> response sizes) and counts them in configurable buckets.
> It also provides a sum of all observed values.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#gauge){{% /cite %}}

##### Example histogram metric in Prometheus data
```sh
# HELP http_api_request_duration_seconds Time taken to respond to HTTP request
# TYPE http_api_request_duration_seconds histogram
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.005"} 0
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.01"} 2
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.025"} 80
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.05"} 80
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.1"} 80
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.25"} 85
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.5"} 85
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="1"} 87
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="2.5"} 87
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="5"} 88
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="10"} 88
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="+Inf"} 88
http_api_request_duration_seconds_sum{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome"} 6.833441910000001
http_api_request_duration_seconds_count{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome"} 88
```