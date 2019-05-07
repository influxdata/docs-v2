---
title: InfluxDB Cloud rate limits
description: Rate limits for Free tier users optimize InfluxDB Cloud 2.0 services.
weight: 2
menu:
  v2_0_cloud:
    name: Rate limits
---

To optimize InfluxDB Cloud 2.0 services, the following rate limits are in place for Free tier users. To increase your rate limits, contact <a href="mailto:cloudbeta@influxdata.com?subject={{ $cloudName }} Feedback">cloudbeta@influxdata.com</a>.

- `write` endpoint:
  - 5 concurrent API calls
  - 3000 KB (10 KB/s) of data written in a 5 minute window

- `query` endpoint:
  - 20 concurrent API calls
  - 3000 MB (10 MB/s) of data returned in a 5 minute window

- 5 dashboards
- 5 tasks
- 2 buckets
- 72 hour retention period

## HTTP response codes

When a request exceeds the rate limit for the endpoint, the InfluxDB API returns:

- HTTP 429 “Too Many Requests”
- Retry-After: xxx (seconds to wait before retrying the request)

<!-- potential information to add moving forward?

Use HTTP headers to review the following:

?: the rate limit ceiling for a given endpoint
?: the number of requests remaining in the 4 hour window (will we provide functionality to change this window?)
?: time remaining before the rate limit resets, in <precision> seconds

## Rate limit messaging

When a request exceeds the rate limit for a given API endpoint, the API returns the following errors in the response body:

{ "errors": [ { "code": ??, "message": "??" } ] }

-->

