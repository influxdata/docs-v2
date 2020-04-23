---
title: InfluxDB 2.0 URLs
description: >
  InfluxDB 2.0 is available both locally (OSS) or on multiple cloud providers in multiple regions (Cloud).
aliases:
    - /v2.0/cloud/urls/
weight: 6
menu:
  v2_0_ref:
    name: InfluxDB URLs
---

InfluxDB 2.0 is available both locally (OSS) or on multiple cloud providers in multiple regions (Cloud).

## InfluxDB OSS URL

For InfluxDB OSS, the default URL is the following:

{{< keep-url >}}
```
http://localhost:9999/
```

## InfluxDB Cloud URLs

Each region has a unique InfluxDB Cloud URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud instances with the
[InfluxDB API](/v2.0/reference/api/), [InfluxDB client libraries](/v2.0/reference/api/client-libraries/),
[`influx` CLI](/v2.0/reference/cli/influx/), or [Telegraf](/v2.0/write-data/use-telegraf/).

{{< cloud_urls >}}
