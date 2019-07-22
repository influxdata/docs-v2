---
title: InfluxDB Cloud 2.0 rate limits
description: Rate limits for Free tier users optimize InfluxDB Cloud 2.0 services.
weight: 2
menu:
  v2_0_cloud:
    name: Rate limits
---

InfluxDB Cloud 2.0 offers two options, the rate-limited Free Tier and the Pay As You Go option. 
For details about InfluxDB Cloud 2.0, see [About the InfluxDB Cloud 2.0](/v2/cloud/about/index).

## Free Tier

Everyone starts with the rate-limited Free Tier. 
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
- 72-hour retention period

To remove the rate limits, upgrade to the Pay As You Go option.

## Pay As You Go option

The Pay As You Go option offers more flexibility and ensures that you only pay for what you need. 
This option automatically adjusts for projects based on data needs.

To get more details and upgrade to the Pay As You Go option, perform the following steps.

1. Click **Usage > Billing** in the left navigation menu.

2. At the bottom of the page, click **Pay As You Go** to review the options and upgrade to this option.

## View data usage

To view your data usage, click **Usage** in the left navigation bar.

{{< nav-icon "usage" >}}

## HTTP response codes

When a request exceeds the rate limit for the endpoint, the InfluxDB API returns:

- HTTP 429 “Too Many Requests”
- Retry-After: xxx (seconds to wait before retrying the request)
