---
title: Supported regions
seotitle: Supported regions for {{< product-name >}}
description: >
  View the AWS and Azure regions where {{< product-name >}} is available, request
  a region, and find the region that your instance runs in.
menu:
  influxdb3_cloud:
    parent: Reference
    name: Supported regions
weight: 110
influxdb3/cloud/tags: [regions, cloud providers]
related:
  - /influxdb3/cloud/reference/cloud-providers/
  - /influxdb3/cloud/admin/availability-zones/
  - /influxdb3/cloud/admin/monitor-instance/
---

Each {{% product-name %}} instance runs in one cloud provider region.
Use this page to see where {{% product-name %}} is available.

- [Available regions](#available-regions)
- [Request a region](#request-a-region)
- [Find your instance's region](#find-your-instances-region)
- [Pricing](#pricing)

## Available regions

{{% product-name %}} is available in the following regions.
Available regions can change.

> [!Note]
> #### Don't see your region?
>
> If the region you need isn't listed,
> [contact InfluxData Sales](https://www.influxdata.com/contact-sales/) or your
> InfluxData representative.

### North America

| Cloud provider | Region ID       | Location                 |
| :------------- | :-------------- | :----------------------- |
| AWS            | `us-east-1`     | United States (Virginia) |
| AWS            | `us-east-2`     | United States (Ohio)     |
| AWS            | `us-west-2`     | United States (Oregon)   |
| AWS            | `ca-central-1`  | Canada (Montreal)        |
| Azure          | `eastus`        | United States (Virginia) |
| Azure          | `westus2`       | United States (Washington) |
| Azure          | `canadacentral` | Canada (Toronto)         |

### Europe

| Cloud provider | Region ID            | Location                 |
| :------------- | :------------------- | :----------------------- |
| AWS            | `eu-central-1`       | Germany (Frankfurt)      |
| AWS            | `eu-north-1`         | Sweden (Stockholm)       |
| AWS            | `eu-west-1`          | Ireland (Dublin)         |
| AWS            | `eu-west-2`          | United Kingdom (London)  |
| AWS            | `eu-west-3`          | France (Paris)           |
| Azure          | `germanywestcentral` | Germany (Frankfurt)      |
| Azure          | `swedencentral`      | Sweden (Gävle)           |
| Azure          | `westeurope`         | Netherlands              |
| Azure          | `uksouth`            | United Kingdom (London)  |
| Azure          | `francecentral`      | France (Paris)           |

### Asia Pacific

| Cloud provider | Region ID        | Location            |
| :------------- | :--------------- | :------------------ |
| AWS            | `ap-northeast-1` | Japan (Tokyo)       |
| AWS            | `ap-northeast-2` | South Korea (Seoul) |
| AWS            | `ap-south-1`     | India (Mumbai)      |
| AWS            | `ap-southeast-1` | Singapore           |
| AWS            | `ap-southeast-2` | Australia (Sydney)  |

## Request a region

To run an instance in a listed region, or to ask about a region that isn't listed,
contact your InfluxData representative or
[InfluxData Sales](https://www.influxdata.com/contact-sales/).

## Find your instance's region

To find the region that an instance runs in, go to the instance's
[**Overview** page](/influxdb3/cloud/admin/monitor-instance/#view-instance-details)
in the Admin UI, and then see **Region**.

## Pricing

Pricing differs by region and cloud provider.
For pricing, contact your InfluxData representative.
