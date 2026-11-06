---
title: Supported cloud providers
seotitle: Supported cloud providers for {{< product-name >}}
description: >
  Learn which cloud providers {{< product-name >}} runs on and which object
  storage service each one uses.
menu:
  influxdb3_cloud:
    parent: Reference
    name: Supported cloud providers
weight: 111
influxdb3/cloud/tags: [cloud providers, regions]
related:
  - /influxdb3/cloud/reference/regions/
  - /influxdb3/cloud/admin/availability-zones/
---

{{% product-name %}} runs on Amazon Web Services (AWS) and Microsoft Azure.
Each instance runs on one cloud provider, in one
[region](/influxdb3/cloud/reference/regions/).

- [Object storage](#object-storage)
- [Private connectivity and encryption keys](#private-connectivity-and-encryption-keys)
- [Pricing](#pricing)

## Object storage

Each instance stores its data in its cloud provider's object storage service:

- **AWS**: Amazon S3
- **Azure**: Azure Blob Storage

## Private connectivity and encryption keys

Private Link and customer-managed encryption keys are available on both cloud
providers.
To set up either one, contact your InfluxData representative.

## Pricing

Pricing differs by region and cloud provider.
For pricing, contact your InfluxData representative.
