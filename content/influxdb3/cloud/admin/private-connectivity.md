---
title: Private connectivity
seotitle: Private connectivity for {{< product-name >}}
description: >
  Learn how to use AWS PrivateLink or Azure Private Link to connect to your
  {{< product-name >}} instance from your own cloud network.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
    name: Private connectivity
weight: 107
influxdb3/cloud/tags: [private link, networking, security]
---

Use Private Link to connect to an instance from your own cloud network without
going over the public internet.
Your instance's public endpoint is unaffected.

{{% product-name %}} supports AWS PrivateLink and Azure Private Link.
To set up Private Link, contact your InfluxData representative.

| | AWS PrivateLink | Azure Private Link |
| :-- | :-- | :-- |
| **What you provide** | Principal ARN | Subscription ID |
| **What you create** | Interface VPC endpoint | Private endpoint |
| **Private DNS** | Enable **Private DNS names** on the endpoint | Create an A record in a DNS zone linked to your virtual network |

Create the endpoint in the same region as your instance.
