---
title: InfluxDB Cloud 2.0 URLs
description: >
  InfluxDB Cloud 2.0 is available on multiple cloud providers in multiple regions,
  each with with a unique URL and API endpoint.
weight: 3
menu:
  v2_0_cloud:
    name: InfluxDB Cloud URLs
---

InfluxDB Cloud 2.0 is available on multiple cloud providers in multiple regions.
Each region has a unique InfluxDB Cloud URL and API endpoint.
Use the URLs below to interact with your InfluxDB Cloud instances with the
[InfluxDB API](/v2.0/reference/api/) or [InfluxDB client libraries](/v2.0/reference/api/client-libraries/).

## Amazon Web Services (AWS)

| Region               | URL                                              |
|:------               |:---                                              |
| AWS US West (Oregon) | https://us-west-2-1.aws.cloud2.influxdata.com    |
| AWS EU Frankfurt     | https://eu-central-1-1.aws.cloud2.influxdata.com |

## Google Cloud Platform (GCP)

| Region                         | URL                                                   |
|:------                         |:---                                                   |
| Google Cloud US Central (Iowa) | https://prod01-us-central-1.gcp.cloud2.influxdata.com |

---

### View your Cloud URL in the InfluxDB Cloud UI
For the URL of your specific InfluxDB Cloud instance:

1. Click the **Load Data** icon in the left navigation of your InfluxDB Cloud user interface (UI).

    {{< nav-icon "load-data" >}}

2. Go to **Client Libraries**.
3. The URL of your InfluxDB instance is displayed at the top of the page.
