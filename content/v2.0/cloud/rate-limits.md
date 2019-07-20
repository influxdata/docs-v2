---
title: InfluxDB Cloud 2.0 rate limits
description: Rate limits for Free tier users optimize InfluxDB Cloud 2.0 services.
weight: 2
menu:
  v2_0_cloud:
    name: Rate limits
---


[About the InfluxDB Cloud 2.0](/)

## Free Tier

You can try out InfluxDB Cloud as long as you like, 
but the data retention is limited to new data (within the last 72 hours) only. 
Other limits are in place for query and writes, 
but you should be able to monitor 5-10 sensors, stacks or servers comfortably.

The following rate limits apply to Free tier users.

- `write` endpoint
  - 3000 KB (10 KB/s) of data written in a 5 minute window

- `query` endpoint
  - 30 MB (5 MB/s) of data returned in a 5 minute window

- 5 dashboards
- 5 tasks
- 2 buckets
- 72 hour retention period

To increase your rate limits, upgrade to the Pay As You Go option.

## Pay As You Go option

The Pay As You Go option offers more flexibility and ensures that you only pay for what you need. 
This option automatically adjusts for projects based on data needs.

To upgrade to the Pay As You Go option and learn more details, 
click **Usage** in the left navigation menu.

{{< img-hd src="/img/2-0-cloud-usage.png" />}}

## View data usage

To view your data usage, click **Usage** in the left navigation bar.

{{< nav-icon "usage" >}}

## HTTP response codes

When a request exceeds the rate limit for the endpoint, the InfluxDB API returns:

- HTTP 429 “Too Many Requests”
- Retry-After: xxx (seconds to wait before retrying the request)
